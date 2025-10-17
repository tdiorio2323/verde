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

const ORDER_SEQUENCE: OrderStatus[] = [
  "placed",
  "confirmed",
  "preparing",
  "enroute",
  "arriving",
  "delivered",
];

const ORDER_LABELS: Record<OrderStatus, string> = {
  placed: "Order Placed",
  confirmed: "Dispensary Confirmed",
  preparing: "Curating Order",
  enroute: "Driver En Route",
  arriving: "Arriving",
  delivered: "Delivered",
};

const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

const addMinutes = (date: Date, minutes: number) => {
  const next = new Date(date);
  next.setMinutes(next.getMinutes() + minutes);
  return next;
};

const buildTimeline = (targetStatus: OrderStatus, baseTime = new Date()): OrderTimelineStep[] => {
  const targetIndex = ORDER_SEQUENCE.indexOf(targetStatus);

  return ORDER_SEQUENCE.map((status, index) => {
    const complete = index <= targetIndex;
    return {
      id: status,
      label: ORDER_LABELS[status],
      complete,
      at: complete ? formatTime(addMinutes(baseTime, index * 4)) : "--",
    } satisfies OrderTimelineStep;
  });
};

const ensureQuantity = (quantity: number) => Math.max(0, Math.min(9, quantity));

const resolveProduct = (productId: number) =>
  products.find((product) => product.id === productId);

const recalcAdminOrders = (orders: CustomerOrder[]) => {
  return orders.slice(0, 6).map((order) => ({
    id: order.id,
    customer: order.items[0]?.name.split(" ")[0] ?? "Guest",
    status: order.status,
    dispensary:
      dispensaries.find((disp) => disp.id === order.dispensaryId)?.name ?? "Verde",
    eta: `${order.etaMinutes} min`,
    basket: order.total,
  }));
};

const calculateTotals = (cart: AppState["cart"], items: CartLineItem[]) => {
  const currentProducts = products;
  const subtotal = items.reduce((sum, item) => {
    const product = currentProducts.find((prod) => prod.id === item.productId);
    if (!product) return sum;
    return sum + product.price * item.quantity;
  }, 0);

  const serviceFee = subtotal * cart.serviceRate;
  const tax = subtotal * cart.taxRate;
  const deliveryFee = subtotal >= 150 ? 0 : cart.deliveryBase;
  const total = subtotal + serviceFee + tax + deliveryFee;

  return { subtotal, serviceFee, tax, deliveryFee, total };
};

const advanceDriverStatus = (status: DriverAssignmentStatus): DriverAssignmentStatus => {
  switch (status) {
    case "assigned":
      return "accepted";
    case "accepted":
      return "enroute";
    case "enroute":
      return "arrived";
    case "arrived":
      return "delivered";
    default:
      return status;
  }
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
        const state = get(); // Get current state for conditional logic
        if (state.cart.items.length === 0) {
          return false;
        }

        const selectedDispensary = state.dispensaries.find(
          (disp) => disp.id === state.session.selectedDispensaryId,
        );

        const { subtotal, serviceFee, tax, deliveryFee, total } = calculateTotals(
          state.cart,
          state.cart.items,
        );

        const now = new Date();
        const newOrder: CustomerOrder = {
          id: generateOrderId(),
          dispensaryId: selectedDispensary?.id ?? state.dispensaries[0]?.id ?? "",
          status: "preparing",
          placedAt: now.toISOString(),
          etaMinutes: selectedDispensary
            ? Math.round((selectedDispensary.etaRange[0] + selectedDispensary.etaRange[1]) / 2)
            : 35,
          driverName: mockCustomerOrder.driverName,
          driverAvatar: mockCustomerOrder.driverAvatar,
          vehicle: mockCustomerOrder.vehicle,
          address: payload.address,
          timeline: buildTimeline("preparing", now),
          items: state.cart.items
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
            .filter((item): item is NonNullable<typeof item> => Boolean(item)),
          total,
        };

        set((state) => {
          const orders = [newOrder, ...state.orders.list];
          const updatedAdminOrders = recalcAdminOrders(orders);

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
            if (order.id !== state.orders.activeOrderId) {
              return order;
            }

            const currentIndex = ORDER_SEQUENCE.indexOf(order.status);
            const nextStatus = ORDER_SEQUENCE[Math.min(currentIndex + 1, ORDER_SEQUENCE.length - 1)];
            const now = new Date();

            const nextTimeline = order.timeline.map((step) => {
              const stepIndex = ORDER_SEQUENCE.indexOf(step.id);
              if (stepIndex <= ORDER_SEQUENCE.indexOf(nextStatus)) {
                return {
                  ...step,
                  at: step.at === "--" ? formatTime(addMinutes(now, stepIndex * 3)) : step.at,
                  complete: true,
                };
              }
              return step;
            });

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
              orders: recalcAdminOrders(orders),
            },
          };
        }),
      updateDriverAssignment: (assignmentId) =>
        set((state) => {
          const updatedAssignments = state.driver.assignments.map((assignment) => {
            if (assignment.id !== assignmentId) {
              return assignment;
            }
            const nextStatus = advanceDriverStatus(assignment.status);
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
