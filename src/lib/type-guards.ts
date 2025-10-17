/**
 * Type guard utility functions for runtime type checking.
 * These functions help ensure type safety when working with data from external sources
 * or when TypeScript's static analysis needs runtime validation.
 */

import type { Product } from "@/data/products";
import type { CustomerOrder, DriverAssignment } from "@/data/orders";
import type { Dispensary } from "@/data/dispensaries";
import type { CartLineItem } from "@/data/store";

/**
 * Type guard to check if a value is a valid Product.
 *
 * @param value - Value to check
 * @returns true if value is a Product
 */
export function isProduct(value: unknown): value is Product {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const product = value as Record<string, unknown>;

  return (
    typeof product.id === "number" &&
    typeof product.name === "string" &&
    typeof product.description === "string" &&
    typeof product.image === "string" &&
    typeof product.price === "number" &&
    typeof product.category === "string" &&
    typeof product.stock === "number" &&
    typeof product.rating === "number"
  );
}

/**
 * Type guard to check if a value is a valid CustomerOrder.
 *
 * @param value - Value to check
 * @returns true if value is a CustomerOrder
 */
export function isCustomerOrder(value: unknown): value is CustomerOrder {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const order = value as Record<string, unknown>;

  return (
    typeof order.id === "string" &&
    typeof order.dispensaryId === "string" &&
    typeof order.status === "string" &&
    typeof order.placedAt === "string" &&
    typeof order.etaMinutes === "number" &&
    Array.isArray(order.items) &&
    Array.isArray(order.timeline)
  );
}

/**
 * Type guard to check if a value is a valid DriverAssignment.
 *
 * @param value - Value to check
 * @returns true if value is a DriverAssignment
 */
export function isDriverAssignment(value: unknown): value is DriverAssignment {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const assignment = value as Record<string, unknown>;

  return (
    typeof assignment.id === "string" &&
    typeof assignment.customer === "string" &&
    typeof assignment.status === "string" &&
    typeof assignment.address === "string" &&
    typeof assignment.distanceMiles === "number" &&
    typeof assignment.payout === "number" &&
    typeof assignment.pickupWindow === "string" &&
    Array.isArray(assignment.items)
  );
}

/**
 * Type guard to check if a value is a valid Dispensary.
 *
 * @param value - Value to check
 * @returns true if value is a Dispensary
 */
export function isDispensary(value: unknown): value is Dispensary {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const dispensary = value as Record<string, unknown>;

  return (
    typeof dispensary.id === "string" &&
    typeof dispensary.name === "string" &&
    typeof dispensary.address === "string" &&
    Array.isArray(dispensary.etaRange) &&
    dispensary.etaRange.length === 2
  );
}

/**
 * Type guard to check if a value is a valid CartLineItem.
 *
 * @param value - Value to check
 * @returns true if value is a CartLineItem
 */
export function isCartLineItem(value: unknown): value is CartLineItem {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Record<string, unknown>;

  return (
    typeof item.productId === "number" &&
    typeof item.quantity === "number" &&
    item.quantity >= 0 &&
    item.quantity <= 9
  );
}

/**
 * Type guard to check if a value is a non-null object.
 * Useful as a base check before more specific type guards.
 *
 * @param value - Value to check
 * @returns true if value is a non-null object
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/**
 * Type guard to check if a value is a valid array of Products.
 *
 * @param value - Value to check
 * @returns true if value is an array of Products
 */
export function isProductArray(value: unknown): value is Product[] {
  return Array.isArray(value) && value.every(isProduct);
}

/**
 * Type guard to check if a value is a valid array of CartLineItems.
 *
 * @param value - Value to check
 * @returns true if value is an array of CartLineItems
 */
export function isCartLineItemArray(value: unknown): value is CartLineItem[] {
  return Array.isArray(value) && value.every(isCartLineItem);
}

/**
 * Type guard to check if a string is a valid order status.
 *
 * @param value - Value to check
 * @returns true if value is a valid order status
 */
export function isOrderStatus(
  value: unknown,
): value is "placed" | "confirmed" | "preparing" | "enroute" | "arriving" | "delivered" {
  return (
    typeof value === "string" &&
    ["placed", "confirmed", "preparing", "enroute", "arriving", "delivered"].includes(value)
  );
}

/**
 * Type guard to check if a string is a valid role.
 *
 * @param value - Value to check
 * @returns true if value is a valid role
 */
export function isRole(value: unknown): value is "customer" | "driver" | "admin" {
  return typeof value === "string" && ["customer", "driver", "admin"].includes(value);
}
