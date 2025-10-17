import type { Session } from "@supabase/supabase-js";
import type { Product } from "@/data/products";
import type { Category } from "@/data/categories";
import type { Dispensary } from "@/data/dispensaries";
import type {
  AdminSnapshot,
  CustomerOrder,
  DriverAssignment,
  DriverAssignmentStatus,
  OrderStatus,
  OrderTimelineStep,
} from "@/data/orders";

export type Role = "customer" | "driver" | "admin";

export type AuthUser = {
  id: string;
  phone: string;
  fullName: string | null;
  ageVerified: boolean;
  role: Role;
};

export type AuthContextType = {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signInWithOtp: (phone: string) => Promise<{ error: Error | null }>;
  verifyOtp: (phone: string, token: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<AuthUser>) => Promise<{ error: Error | null }>;
  refreshUser: () => Promise<void>;
};

export type SortOption = "featured" | "price-asc" | "price-desc" | "thc-desc";

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

export type AdminInventoryItem = {
  sku: string;
  stock: number;
  threshold: number;
};

export type AdminUser = {
  id: string;
  name: string;
  role: string;
  status: string;
};

export type AdminState = {
  metrics: AdminSnapshot[];
  orders: CustomerOrder[];
  inventory: AdminInventoryItem[];
  users: AdminUser[];
};

export type SessionState = {
  role: Role;
  selectedDispensaryId: string;
};

export type AppState = {
  products: Product[];
  categories: Category[];
  dispensaries: Dispensary[];
  filters: FiltersState;
  cart: CartState;
  orders: OrdersState;
  driver: DriverState;
  admin: AdminState;
  session: SessionState;
};
