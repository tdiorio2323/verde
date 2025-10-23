/**
 * User role constants for Verde Cannabis Marketplace.
 * Centralized role definitions to prevent duplication.
 */
export const ROLES = {
  CUSTOMER: "customer",
  ADMIN: "admin",
  BRAND: "brand",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/**
 * Derives the user role based on their profile data.
 * Priority: Admin > Brand > Customer
 */
export function deriveRole(me: { isAdmin?: boolean; brandIds?: string[] }): Role {
  if (me.isAdmin) return ROLES.ADMIN;
  if (me.brandIds && me.brandIds.length > 0) return ROLES.BRAND;
  return ROLES.CUSTOMER;
}
