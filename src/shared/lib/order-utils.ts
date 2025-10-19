/**
 * Order processing utilities.
 * Provides functions for order timeline generation and calculations.
 */

import { ORDER_STATUSES, ORDER_STATUS_LABELS, TIMELINE_STEP_INTERVAL_MINUTES } from "@/lib/constants";
import type { OrderStatus } from "@/lib/constants";
import { formatTime, addMinutes } from "./date-utils";

export interface OrderTimelineStep {
  id: OrderStatus;
  label: string;
  complete: boolean;
  at: string;
}

/**
 * Build a timeline for an order based on its current status
 * @param targetStatus - The current or target status of the order
 * @param baseTime - The base time to calculate estimates from (defaults to now)
 * @returns Array of timeline steps with completion status and estimated times
 */
export function buildOrderTimeline(
  targetStatus: OrderStatus,
  baseTime = new Date()
): OrderTimelineStep[] {
  const targetIndex = ORDER_STATUSES.indexOf(targetStatus);

  return ORDER_STATUSES.map((status, index) => {
    const isComplete = index <= targetIndex;
    const estimatedTime = isComplete
      ? formatTime(addMinutes(baseTime, index * TIMELINE_STEP_INTERVAL_MINUTES))
      : "--";

    return {
      id: status,
      label: ORDER_STATUS_LABELS[status],
      complete: isComplete,
      at: estimatedTime,
    };
  });
}

/**
 * Get the next status in the order progression
 * @param currentStatus - The current order status
 * @returns The next status, or the same status if already at the end
 */
export function getNextOrderStatus(currentStatus: OrderStatus): OrderStatus {
  const currentIndex = ORDER_STATUSES.indexOf(currentStatus);
  const nextIndex = Math.min(currentIndex + 1, ORDER_STATUSES.length - 1);
  return ORDER_STATUSES[nextIndex];
}

/**
 * Check if an order status is terminal (last in sequence)
 */
export function isTerminalStatus(status: OrderStatus): boolean {
  return status === ORDER_STATUSES[ORDER_STATUSES.length - 1];
}

/**
 * Get the progress percentage of an order (0-100)
 */
export function getOrderProgressPercentage(status: OrderStatus): number {
  const currentIndex = ORDER_STATUSES.indexOf(status);
  const totalSteps = ORDER_STATUSES.length - 1;
  return Math.round((currentIndex / totalSteps) * 100);
}
