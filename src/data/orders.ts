export type OrderStatus =
  | "placed"
  | "confirmed"
  | "preparing"
  | "enroute"
  | "arriving"
  | "delivered";

export type OrderTimelineStep = {
  id: OrderStatus;
  label: string;
  at: string;
  complete: boolean;
};

export type OrderItem = {
  id: number;
  name: string;
  quantity: number;
  price: number;
};

export type CustomerOrder = {
  id: string;
  dispensaryId: string;
  status: OrderStatus;
  placedAt: string;
  etaMinutes: number;
  driverName: string;
  driverAvatar: string;
  vehicle: string;
  timeline: OrderTimelineStep[];
  items: OrderItem[];
  total: number;
  address: string;
};

export type DriverAssignmentStatus =
  | "assigned"
  | "accepted"
  | "enroute"
  | "arrived"
  | "delivered";

export type DriverAssignment = {
  id: string;
  customer: string;
  address: string;
  distanceMiles: number;
  payout: number;
  pickupWindow: string;
  status: DriverAssignmentStatus;
  notes?: string;
  items: OrderItem[];
};

export type AdminSnapshot = {
  metric: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "neutral";
};

export const mockCustomerOrder: CustomerOrder = {
  id: "TD-1284",
  dispensaryId: "td-studios-premier",
  status: "preparing",
  placedAt: "2025-02-08T18:34:00Z",
  etaMinutes: 32,
  driverName: "Maya Chen",
  driverAvatar: "/images/driver-maya.png",
  vehicle: "Lucid Air - Pearl Chrome",
  address: "525 Luxe Tower, Unit 3204, Los Angeles, CA",
  timeline: [
    { id: "placed", label: "Order Placed", at: "6:34 PM", complete: true },
    { id: "confirmed", label: "Dispensary Confirmed", at: "6:36 PM", complete: true },
    { id: "preparing", label: "Curating Your Order", at: "6:44 PM", complete: true },
    { id: "enroute", label: "Driver En Route", at: "--", complete: false },
    { id: "arriving", label: "Arriving", at: "--", complete: false },
    { id: "delivered", label: "Delivered", at: "--", complete: false },
  ],
  items: [
    { id: 1, name: "Purple Sunset OG", quantity: 2, price: 52 },
    { id: 23, name: "Moonlit Lychee Gummies", quantity: 1, price: 28 },
    { id: 40, name: "Rare Air Live Rosin", quantity: 1, price: 74 },
  ],
  total: 206,
};

export const driverAssignments: DriverAssignment[] = [
  {
    id: "RUN-8842",
    customer: "D. Mitchell",
    address: "1270 Horizon Blvd, Penthouse 18",
    distanceMiles: 5.2,
    payout: 24,
    pickupWindow: "Ready in 4 min",
    status: "assigned",
    notes: "Client requested discreet handoff at valet.",
    items: [
      { id: 8, name: "Gelato Mint #33", quantity: 1, price: 58 },
      { id: 51, name: "Midnight Drift Disposable", quantity: 2, price: 38 },
    ],
  },
  {
    id: "RUN-8837",
    customer: "S. Alvarez",
    address: "900 Pier Ave, Unit 9B",
    distanceMiles: 11.4,
    payout: 32,
    pickupWindow: "Ready for pickup",
    status: "enroute",
    items: [
      { id: 5, name: "Blue Dream Classic", quantity: 1, price: 45 },
      { id: 90, name: "Seabreeze Bath Soak", quantity: 1, price: 30 },
    ],
  },
  {
    id: "RUN-8825",
    customer: "C. Nguyen",
    address: "44 Oceanfront Walk, Villa 2",
    distanceMiles: 16.8,
    payout: 41,
    pickupWindow: "Scheduled 8:15 PM",
    status: "assigned",
    notes: "Sunset coastal drop, parking code 8841",
    items: [
      { id: 11, name: "Lemon Haze Select", quantity: 2, price: 38 },
      { id: 67, name: "Euphoric Sea Salt Caramels", quantity: 1, price: 32 },
    ],
  },
];

export const adminMetrics: AdminSnapshot[] = [
  { metric: "Live Orders", value: "42", delta: "+8 vs last hour", trend: "up" },
  { metric: "Avg Delivery", value: "36 min", delta: "-4 min vs target", trend: "up" },
  { metric: "Driver On Shift", value: "18", delta: "3 on break", trend: "neutral" },
  { metric: "Inventory Risk", value: "Low", delta: "2 SKUs flagged", trend: "down" },
];

export const adminOrders = [
  {
    id: "TD-1284",
    customer: "A. Porter",
    status: "preparing",
    dispensary: "TD Studios Premier Lounge",
    eta: "32 min",
    basket: 206,
  },
  {
    id: "TD-1281",
    customer: "S. Lau",
    status: "enroute",
    dispensary: "Highland Botanica",
    eta: "22 min",
    basket: 164,
  },
  {
    id: "TD-1279",
    customer: "B. Vaughn",
    status: "confirmed",
    dispensary: "Sunset Coastal Collective",
    eta: "Awaiting",
    basket: 118,
  },
  {
    id: "TD-1278",
    customer: "L. Mendez",
    status: "placed",
    dispensary: "TD Studios Premier Lounge",
    eta: "TBD",
    basket: 96,
  },
];

export const adminInventory = [
  { sku: "Purple Sunset OG", stock: 45, threshold: 25 },
  { sku: "Midnight Drift Disposable", stock: 22, threshold: 15 },
  { sku: "Rare Air Live Rosin", stock: 9, threshold: 12 },
  { sku: "Euphoric Sea Salt Caramels", stock: 63, threshold: 40 },
];

export const adminUsers = [
  { id: "driver-002", name: "Maya Chen", role: "Driver", status: "Active" },
  { id: "driver-009", name: "Theo Ramirez", role: "Driver", status: "On break" },
  { id: "admin-001", name: "Elena James", role: "Admin", status: "Monitoring" },
  { id: "support-004", name: "Priya Patel", role: "Support", status: "Chat queue" },
];
