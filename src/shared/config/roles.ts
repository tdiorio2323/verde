/**
 * User role constants for Verde Cannabis Marketplace.
 * Centralized role definitions to prevent duplication.
 */
export const ROLES = {
  CUSTOMER: "customer",
  DRIVER: "driver",
  ADMIN: "admin",
  BRAND: "brand",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/**
 * Derives the user role based on their profile data.
 * Priority: Admin > Brand > Driver > Customer
 */
export function deriveRole(me: { isAdmin?: boolean; brandIds?: string[] }): Role {
  if (me.isAdmin) return ROLES.ADMIN;
  if (me.brandIds && me.brandIds.length > 0) return ROLES.BRAND;
  // Note: Driver role should be set in the database profile
  return ROLES.CUSTOMER;
}
