import { useCallback, useRef, useSyncExternalStore } from "react";
import products, { type Product } from "@/data/products";
import { categories } from "@/data/categories";
import { dispensaries, type Dispensary } from "@/data/dispensaries";
import {
  adminInventory,
  adminMetrics,
  adminOrders,
  adminUsers,
  driverAssignments,
  mockCustomerOrder,
  type AdminSnapshot,
  type CustomerOrder,
  type DriverAssignment,
  type DriverAssignmentStatus,
  type OrderStatus,
  type OrderTimelineStep,
} from "@/data/orders";

export type Role = "customer" | "driver" | "admin";
export type SortOption = "featured" | "price-asc" | "price-desc" | "thc-desc";

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

/**
 * Formats a Date object to a localized time string (e.g., "2:30 PM").
 *
 * @param date - The date to format
 * @returns Formatted time string in 12-hour format with AM/PM
 */
const formatTime = (date: Date) =>
  date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

/**
 * Adds a specified number of minutes to a Date object.
 *
 * @param date - The base date
 * @param minutes - Number of minutes to add (can be negative)
 * @returns New Date object with added minutes
 */
const addMinutes = (date: Date, minutes: number) => {
  const next = new Date(date);
  next.setMinutes(next.getMinutes() + minutes);
  return next;
};

/**
 * Builds a complete order timeline with completion status for each step.
 * Creates a timeline showing all order statuses from "placed" to "delivered",
 * marking steps as complete up to and including the target status.
 *
 * @param targetStatus - The current order status (determines which steps are complete)
 * @param baseTime - Base time for calculating step timestamps (defaults to now)
 * @returns Array of timeline steps with completion status and timestamps
 */
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

export type CartLineItem = {
  productId: number;
  quantity: number;
};

export type CheckoutPayload = {
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
};

export type FiltersState = {
  categoryId: string;
  search: string;
  sort: SortOption;
};

export type CartState = {
  items: CartLineItem[];
  taxRate: number;
  serviceRate: number;
  deliveryBase: number;
};

export type OrdersState = {
  list: CustomerOrder[];
  activeOrderId?: string;
};

export type DriverState = {
  assignments: DriverAssignment[];
};

export type AdminState = {
  metrics: AdminSnapshot[];
  orders: typeof adminOrders;
  inventory: typeof adminInventory;
  users: typeof adminUsers;
};

export type SessionState = {
  role: Role;
  selectedDispensaryId: string;
};

export type AppState = {
  products: Product[];
  categories: typeof categories;
  dispensaries: Dispensary[];
  filters: FiltersState;
  cart: CartState;
  orders: OrdersState;
  driver: DriverState;
  admin: AdminState;
  session: SessionState;
};

type Listener = () => void;

type StoreImpl = {
  getState: () => AppState;
  setState: (updater: (state: AppState) => AppState) => void;
  subscribe: (listener: Listener) => () => void;
};

type EqualityFn<T> = (next: T, prev: T) => boolean;

const isObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

/**
 * Performs shallow equality comparison for objects and arrays.
 * Compares first-level properties/elements using Object.is.
 * Used by selectors to prevent unnecessary re-renders when data hasn't changed.
 *
 * @template T - Object or array type to compare
 * @param next - New value to compare
 * @param prev - Previous value to compare
 * @returns true if values are shallowly equal, false otherwise
 */
export const shallowEqual = <T extends Record<string, unknown> | unknown[]>(
  next: T,
  prev: T
): boolean => {
  if (Object.is(next, prev)) return true;

  if (Array.isArray(next) && Array.isArray(prev)) {
    if (next.length !== prev.length) return false;
    for (let index = 0; index < next.length; index += 1) {
      if (!Object.is(next[index], prev[index])) {
        return false;
      }
    }
    return true;
  }

  if (isObject(next) && isObject(prev)) {
    const keys = Object.keys(next);
    if (keys.length !== Object.keys(prev).length) {
      return false;
    }
    for (const key of keys) {
      if (!(key in prev)) {
        return false;
      }
      if (!Object.is(next[key], prev[key as keyof typeof prev])) {
        return false;
      }
    }
    return true;
  }

  return false;
};

/**
 * Creates a memoized derived selector with custom equality checking.
 * Caches the selector result and only recomputes when the state reference changes
 * or when the computed value is not equal (according to the equality function).
 * Critical for preventing infinite re-renders in useSyncExternalStore.
 *
 * @template T - The type of value returned by the selector
 * @param selector - Function that derives a value from AppState
 * @param equality - Optional equality function (defaults to Object.is)
 * @returns Memoized selector function that returns stable references
 *
 * @example
 * ```ts
 * const selectCartItems = createDerivedSelector(
 *   (state) => state.cart.items.map(item => ({ ...item })),
 *   shallowEqual
 * );
 * ```
 */
const createDerivedSelector = <T,>(
  selector: (state: AppState) => T,
  equality: EqualityFn<T> = Object.is
) => {
  let cacheState: AppState | null = null;
  let cacheValue: T;
  let hasCache = false;

  return (state: AppState) => {
    if (hasCache && cacheState === state) {
      return cacheValue;
    }

    const nextValue = selector(state);

    if (hasCache && equality(nextValue, cacheValue)) {
      cacheState = state;
      return cacheValue;
    }

    cacheState = state;
    cacheValue = nextValue;
    hasCache = true;
    return cacheValue;
  };
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
    users: adminUsers.map((user) => ({ ...user })),
  },
  session: {
    role: "customer",
    selectedDispensaryId: dispensaries[0]?.id ?? "",
  },
};

const store: StoreImpl = (() => {
  let state = initialState;
  const listeners = new Set<Listener>();

  return {
    getState: () => state,
    setState: (updater) => {
      state = updater(state);
      listeners.forEach((listener) => listener());
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
})();

export const useAppStore = <T,>(
  selector: (state: AppState) => T,
  equality: EqualityFn<T> = Object.is
) => {
  const cacheRef = useRef<{ state: AppState; value: T }>();

  const getSnapshot = useCallback(() => {
    const currentState = store.getState();
    const cached = cacheRef.current;

    if (cached && cached.state === currentState) {
      return cached.value;
    }

    const nextValue = selector(currentState);

    if (cached && equality(nextValue, cached.value)) {
      cacheRef.current = { state: currentState, value: cached.value };
      return cached.value;
    }

    cacheRef.current = { state: currentState, value: nextValue };
    return nextValue;
  }, [selector, equality]);

  const getServerSnapshot = useCallback(() => {
    const cached = cacheRef.current;

    if (cached && cached.state === initialState) {
      return cached.value;
    }

    const nextValue = selector(initialState);

    if (cached && equality(nextValue, cached.value)) {
      cacheRef.current = { state: initialState, value: cached.value };
      return cached.value;
    }

    cacheRef.current = { state: initialState, value: nextValue };
    return nextValue;
  }, [selector, equality]);

  return useSyncExternalStore(store.subscribe, getSnapshot, getServerSnapshot);
};

const nextState = (partial: Partial<AppState>, state: AppState): AppState => ({
  ...state,
  ...partial,
});

const updateNested = <T extends keyof AppState>(
  state: AppState,
  key: T,
  value: AppState[T]
) => ({
  ...state,
  [key]: value,
});

const ensureQuantity = (quantity: number) => Math.max(0, Math.min(9, quantity));

const resolveProduct = (productId: number) =>
  store.getState().products.find((product) => product.id === productId);

const recalcAdminOrders = (orders: CustomerOrder[]) => {
  return orders.slice(0, 6).map((order) => ({
    id: order.id,
    customer: order.items[0]?.name.split(" ")[0] ?? "Guest",
    status: order.status,
    dispensary:
      store
        .getState()
        .dispensaries.find((disp) => disp.id === order.dispensaryId)?.name ?? "TD Studios",
    eta: `${order.etaMinutes} min`,
    basket: order.total,
  }));
};

/**
 * Calculates all cart totals including subtotal, fees, taxes, and final total.
 * Applies free delivery for orders over $150.
 *
 * @param cart - Current cart state with tax/service rates and delivery base fee
 * @param items - Array of cart line items (productId and quantity)
 * @returns Object containing subtotal, serviceFee, tax, deliveryFee, and total
 */
const calculateTotals = (cart: CartState, items: CartLineItem[]) => {
  const currentProducts = store.getState().products;
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

type CartTotals = ReturnType<typeof calculateTotals>;

const areCartTotalsEqual: EqualityFn<CartTotals> = (next, prev) =>
  next.subtotal === prev.subtotal &&
  next.serviceFee === prev.serviceFee &&
  next.tax === prev.tax &&
  next.deliveryFee === prev.deliveryFee &&
  next.total === prev.total;

type CartItemDetailed = {
  product: Product;
  quantity: number;
  lineTotal: number;
};

const areCartItemsDetailedEqual: EqualityFn<CartItemDetailed[]> = (next, prev) => {
  if (next === prev) return true;
  if (next.length !== prev.length) return false;
  for (let index = 0; index < next.length; index += 1) {
    const nextItem = next[index];
    const prevItem = prev[index];
    if (
      nextItem.product !== prevItem.product ||
      nextItem.quantity !== prevItem.quantity ||
      nextItem.lineTotal !== prevItem.lineTotal
    ) {
      return false;
    }
  }
  return true;
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
  return `TD-${generatorSeed.current}`;
};

export const appActions = {
  setRole(role: Role) {
    store.setState((state) =>
      updateNested(state, "session", {
        ...state.session,
        role,
      })
    );
  },
  setSelectedDispensary(dispensaryId: string) {
    store.setState((state) =>
      updateNested(state, "session", {
        ...state.session,
        selectedDispensaryId: dispensaryId,
      })
    );
  },
  setCategory(categoryId: string) {
    store.setState((state) =>
      updateNested(state, "filters", {
        ...state.filters,
        categoryId,
      })
    );
  },
  setSearch(search: string) {
    store.setState((state) =>
      updateNested(state, "filters", {
        ...state.filters,
        search,
      })
    );
  },
  setSort(sort: SortOption) {
    store.setState((state) =>
      updateNested(state, "filters", {
        ...state.filters,
        sort,
      })
    );
  },
  addToCart(productId: number) {
    store.setState((state) => {
      const existing = state.cart.items.find((item) => item.productId === productId);
      const updatedItems = existing
        ? state.cart.items.map((item) =>
            item.productId === productId
              ? { ...item, quantity: ensureQuantity(item.quantity + 1) }
              : item
          )
        : [...state.cart.items, { productId, quantity: 1 }];

      return updateNested(state, "cart", {
        ...state.cart,
        items: updatedItems,
      });
    });
  },
  updateCartQuantity(productId: number, quantity: number) {
    store.setState((state) => {
      const normalized = ensureQuantity(quantity);
      const updatedItems = state.cart.items
        .map((item) =>
          item.productId === productId ? { ...item, quantity: normalized } : item
        )
        .filter((item) => item.quantity > 0);

      return updateNested(state, "cart", {
        ...state.cart,
        items: updatedItems,
      });
    });
  },
  removeFromCart(productId: number) {
    store.setState((state) =>
      updateNested(state, "cart", {
        ...state.cart,
        items: state.cart.items.filter((item) => item.productId !== productId),
      })
    );
  },
  clearCart() {
    store.setState((state) =>
      updateNested(state, "cart", {
        ...state.cart,
        items: [],
      })
    );
  },
  /**
   * Processes checkout and creates a new order from the current cart.
   * Clears the cart and sets the new order as active after creation.
   *
   * @param payload - Customer information including name, phone, address, and optional notes
   * @returns boolean - true if checkout succeeded, false if cart was empty
   */
  checkout(payload: CheckoutPayload): boolean {
    // Check if cart is empty before attempting state update
    if (store.getState().cart.items.length === 0) {
      return false;
    }

    store.setState((state) => {

      const selectedDispensary = state.dispensaries.find(
        (disp) => disp.id === state.session.selectedDispensaryId
      );

      const { subtotal, serviceFee, tax, deliveryFee, total } = calculateTotals(
        state.cart,
        state.cart.items
      );

      const now = new Date();
      const newOrder: CustomerOrder = {
        id: generateOrderId(),
        dispensaryId: selectedDispensary?.id ?? state.dispensaries[0]?.id ?? "",
        status: "preparing",
        placedAt: now.toISOString(),
        etaMinutes: selectedDispensary
          ? Math.round(
              (selectedDispensary.etaRange[0] + selectedDispensary.etaRange[1]) / 2
            )
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

      const orders = [newOrder, ...state.orders.list];
      const updatedAdminOrders = recalcAdminOrders(orders);

      return {
        ...state,
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
  advanceActiveOrderStatus() {
    store.setState((state) => {
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
        ...state,
        orders: {
          ...state.orders,
          list: orders,
        },
        admin: {
          ...state.admin,
          orders: recalcAdminOrders(orders),
        },
      };
    });
  },
  updateDriverAssignment(assignmentId: string) {
    store.setState((state) => {
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
        ...state,
        driver: {
          assignments: updatedAssignments,
        },
      };
    });
  },
};

const selectCartItemsDetailed = createDerivedSelector<CartItemDetailed[]>(
  (state) =>
    state.cart.items
      .map((item) => {
        const product = state.products.find((prod) => prod.id === item.productId);
        if (!product) return null;
        return {
          product,
          quantity: item.quantity,
          lineTotal: product.price * item.quantity,
        } satisfies CartItemDetailed;
      })
      .filter((entry): entry is NonNullable<typeof entry> => Boolean(entry)),
  areCartItemsDetailedEqual
);

const selectCartTotals = createDerivedSelector<CartTotals>(
  (state) => calculateTotals(state.cart, state.cart.items),
  areCartTotalsEqual
);

export const selectors = {
  products: (state: AppState) => state.products,
  categories: (state: AppState) => state.categories,
  dispensaries: (state: AppState) => state.dispensaries,
  filters: (state: AppState) => state.filters,
  cart: (state: AppState) => state.cart,
  cartItemsDetailed: selectCartItemsDetailed,
  cartTotals: selectCartTotals,
  orders: (state: AppState) => state.orders,
  activeOrder: (state: AppState) =>
    state.orders.list.find((order) => order.id === state.orders.activeOrderId) ?? null,
  driverAssignments: (state: AppState) => state.driver.assignments,
  admin: (state: AppState) => state.admin,
  session: (state: AppState) => state.session,
};
