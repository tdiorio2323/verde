export type Role = "customer" | "driver" | "admin";

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

export type DriverAssignmentStatus = "assigned" | "accepted" | "enroute" | "arrived" | "delivered";

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