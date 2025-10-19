import { create } from "zustand";
import { devtools } from "zustand/middleware";
import products from "@/data/products";
import { categories } from "@/data/categories";
import { dispensaries } from "@/data/dispensaries";
import {
  adminInventory,
  adminMetrics,
  adminOrders,
  driverAssignments,
  mockCustomerOrder,
} from "@/data/orders";
import type {
  AppState,
  CartLineItem,
  CheckoutPayload,
  Role,
  SortOption,
} from "@/shared/types/app";
import type { CustomerOrder, DriverAssignmentStatus, OrderStatus } from "@/data/orders";
import {
  MIN_CART_QUANTITY,
  MAX_CART_QUANTITY,
  FREE_DELIVERY_THRESHOLD,
} from "@/lib/constants";
import { buildOrderTimeline, getNextOrderStatus } from "@/shared/lib/order-utils";
import { getNextDriverStatus } from "@/shared/config/statuses";
import { formatTime, addMinutes } from "@/shared/lib/date-utils";

/**
 * Ensure quantity is within valid cart bounds
 */
const ensureQuantity = (quantity: number) =>
  Math.max(MIN_CART_QUANTITY, Math.min(MAX_CART_QUANTITY, quantity));

/**
 * Recalculate admin orders summary from customer orders
 * Takes the most recent orders and formats them for admin dashboard
 */
const recalcAdminOrders = (orders: CustomerOrder[], dispensaries: AppState["dispensaries"]) => {
  return orders.slice(0, 6).map((order) => ({
    id: order.id,
    customer: order.items[0]?.name.split(" ")[0] ?? "Guest",
    status: order.status,
    dispensary: dispensaries.find((disp) => disp.id === order.dispensaryId)?.name ?? "Verde",
    eta: `${order.etaMinutes} min`,
    basket: order.total,
  }));
};

/**
 * Calculate order totals from cart items
 * @param cart - Cart state containing rates and fees
 * @param items - Cart line items
 * @param products - Available products to look up prices
 * @returns Object with subtotal, fees, tax, and total
 */
export const calculateTotals = (
  cart: AppState["cart"],
  items: CartLineItem[],
  products: AppState["products"]
) => {
  const subtotal = items.reduce((sum, item) => {
    const product = products.find((prod) => prod.id === item.productId);
    if (!product) return sum;
    return sum + product.price * item.quantity;
  }, 0);

  const serviceFee = subtotal * cart.serviceRate;
  const tax = subtotal * cart.taxRate;
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : cart.deliveryBase;
  const total = subtotal + serviceFee + tax + deliveryFee;

  return { subtotal, serviceFee, tax, deliveryFee, total };
};


const generatorSeed = { current: 1285 };

const generateOrderId = () => {
  generatorSeed.current += 1;
  return `VD-${generatorSeed.current}`;
};

const initialState: AppState = {
  products,
  categories,
  dispensaries,
  filters: {
    categoryId: "all",
    search: "",
    sort: "featured",
  },
  cart: {
    items: [],
    taxRate: 0.095,
    serviceRate: 0.08,
    deliveryBase: 9,
  },
  orders: {
    list: mockCustomerOrder ? [mockCustomerOrder] : [],
    activeOrderId: mockCustomerOrder?.id,
  },
  driver: {
    assignments: driverAssignments.map((assignment) => ({ ...assignment })),
  },
  admin: {
    metrics: adminMetrics.map((metric) => ({ ...metric })),
    orders: adminOrders.map((order) => ({ ...order })),
    inventory: adminInventory.map((item) => ({ ...item })),
    users: [], // Assuming adminUsers is not directly used here or needs to be fetched
  },
  session: {
    role: "customer",
    selectedDispensaryId: dispensaries[0]?.id ?? "",
  },
};

interface AppStore extends AppState {
  setRole: (role: Role) => void;
  setSelectedDispensary: (dispensaryId: string) => void;
  setCategory: (categoryId: string) => void;
  setSearch: (search: string) => void;
  setSort: (sort: SortOption) => void;
  addToCart: (productId: number) => void;
  updateCartQuantity: (productId: number, quantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  checkout: (payload: CheckoutPayload) => boolean;
  advanceActiveOrderStatus: () => void;
  updateDriverAssignment: (assignmentId: string) => void;
}

export const useAppStore = create<AppStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      setRole: (role) =>
        set((state) => ({
          session: { ...state.session, role },
        })),
      setSelectedDispensary: (dispensaryId) =>
        set((state) => ({
          session: { ...state.session, selectedDispensaryId: dispensaryId },
        })),
      setCategory: (categoryId) =>
        set((state) => ({
          filters: { ...state.filters, categoryId },
        })),
      setSearch: (search) =>
        set((state) => ({
          filters: { ...state.filters, search },
        })),
      setSort: (sort) =>
        set((state) => ({
          filters: { ...state.filters, sort },
        })),
      addToCart: (productId) =>
        set((state) => {
          const existing = state.cart.items.find((item) => item.productId === productId);
          const updatedItems = existing
            ? state.cart.items.map((item) =>
                item.productId === productId
                  ? { ...item, quantity: ensureQuantity(item.quantity + 1) }
                  : item,
              )
            : [...state.cart.items, { productId, quantity: 1 }];

          return {
            cart: { ...state.cart, items: updatedItems },
          };
        }),
      updateCartQuantity: (productId, quantity) =>
        set((state) => {
          const normalized = ensureQuantity(quantity);
          const updatedItems = state.cart.items
            .map((item) =>
              item.productId === productId ? { ...item, quantity: normalized } : item,
            )
            .filter((item) => item.quantity > 0);

          return {
            cart: { ...state.cart, items: updatedItems },
          };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: {
            ...state.cart,
            items: state.cart.items.filter((item) => item.productId !== productId),
          },
        })),
      clearCart: () =>
        set((state) => ({
          cart: { ...state.cart, items: [] },
        })),
      checkout: (payload) => {
        const state = get();

        // Validate cart is not empty
        if (state.cart.items.length === 0) {
          return false;
        }

        // Find selected dispensary
        const selectedDispensary = state.dispensaries.find(
          (disp) => disp.id === state.session.selectedDispensaryId,
        );

        // Calculate order totals
        const { total } = calculateTotals(state.cart, state.cart.items, state.products);

        // Map cart items to order items
        const orderItems = state.cart.items
          .map((item) => {
            const product = state.products.find((prod) => prod.id === item.productId);
            if (!product) return null;
            return {
              id: product.id,
              name: product.name,
              quantity: item.quantity,
              price: product.price,
            };
          })
          .filter((item): item is NonNullable<typeof item> => Boolean(item));

        // Calculate ETA
        const etaMinutes = selectedDispensary
          ? Math.round((selectedDispensary.etaRange[0] + selectedDispensary.etaRange[1]) / 2)
          : 35;

        // Create new order
        const now = new Date();
        const newOrder: CustomerOrder = {
          id: generateOrderId(),
          dispensaryId: selectedDispensary?.id ?? state.dispensaries[0]?.id ?? "",
          status: "preparing",
          placedAt: now.toISOString(),
          etaMinutes,
          driverName: mockCustomerOrder.driverName,
          driverAvatar: mockCustomerOrder.driverAvatar,
          vehicle: mockCustomerOrder.vehicle,
          address: payload.address,
          timeline: buildOrderTimeline("preparing", now),
          items: orderItems,
          total,
        };

        // Update state
        set((state) => {
          const orders = [newOrder, ...state.orders.list];
          const updatedAdminOrders = recalcAdminOrders(orders, state.dispensaries);

          return {
            orders: {
              list: orders,
              activeOrderId: newOrder.id,
            },
            cart: {
              ...state.cart,
              items: [],
            },
            admin: {
              ...state.admin,
              orders: updatedAdminOrders,
            },
          };
        });

        return true;
      },
      advanceActiveOrderStatus: () =>
        set((state) => {
          if (!state.orders.activeOrderId) return state;

          const orders = state.orders.list.map((order) => {
            // Only update the active order
            if (order.id !== state.orders.activeOrderId) {
              return order;
            }

            const nextStatus = getNextOrderStatus(order.status);
            const now = new Date();

            // Update timeline to reflect new status
            const nextTimeline = buildOrderTimeline(nextStatus, now);

            return {
              ...order,
              status: nextStatus,
              timeline: nextTimeline,
            } satisfies CustomerOrder;
          });

          return {
            orders: {
              ...state.orders,
              list: orders,
            },
            admin: {
              ...state.admin,
              orders: recalcAdminOrders(orders, state.dispensaries),
            },
          };
        }),
      updateDriverAssignment: (assignmentId) =>
        set((state) => {
          const updatedAssignments = state.driver.assignments.map((assignment) => {
            if (assignment.id !== assignmentId) {
              return assignment;
            }

            const nextStatus = getNextDriverStatus(assignment.status);

            return {
              ...assignment,
              status: nextStatus,
            } satisfies DriverAssignment;
          });

          return {
            driver: {
              assignments: updatedAssignments,
            },
          };
        }),
    }),
  ),
);
