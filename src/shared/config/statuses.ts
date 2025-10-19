/**
 * Centralized status configuration for orders and drivers.
 * Provides mappings for colors, labels, and status sequences.
 */

import type { OrderStatus } from "@/lib/constants";
import type { DriverAssignmentStatus } from "@/data/orders";

// ========================================
// ORDER STATUS STYLING
// ========================================

/**
 * Tailwind CSS classes for order status badges
 * Uses chrome silver glass morphism design system
 */
export const ORDER_STATUS_STYLES: Record<OrderStatus, string> = {
  placed: "bg-white/20 text-white",
  confirmed: "bg-purple-400/30 text-purple-100",
  preparing: "bg-amber-300/30 text-amber-100",
  enroute: "bg-sky-400/40 text-sky-100",
  arriving: "bg-emerald-400/30 text-emerald-100",
  delivered: "bg-emerald-400/20 text-emerald-100",
} as const;

// ========================================
// DRIVER STATUS STYLING
// ========================================

/**
 * Tailwind CSS classes for driver assignment status badges
 */
export const DRIVER_STATUS_STYLES: Record<DriverAssignmentStatus, string> = {
  assigned: "bg-white/15 text-white",
  accepted: "bg-amber-300/30 text-amber-100",
  enroute: "bg-sky-400/40 text-sky-50",
  arrived: "bg-emerald-400/40 text-emerald-50",
  delivered: "bg-white/20 text-white",
} as const;

/**
 * Human-readable labels for driver assignment statuses
 */
export const DRIVER_STATUS_LABELS: Record<DriverAssignmentStatus, string> = {
  assigned: "Assigned",
  accepted: "Accepted",
  enroute: "En Route",
  arrived: "Arrived",
  delivered: "Delivered",
} as const;

// ========================================
// STATUS PROGRESSION
// ========================================

/**
 * Get the next status in the driver assignment progression
 */
export function getNextDriverStatus(
  currentStatus: DriverAssignmentStatus
): DriverAssignmentStatus {
  const statusMap: Record<DriverAssignmentStatus, DriverAssignmentStatus> = {
    assigned: "accepted",
    accepted: "enroute",
    enroute: "arrived",
    arrived: "delivered",
    delivered: "delivered", // Terminal state
  };

  return statusMap[currentStatus];
}
