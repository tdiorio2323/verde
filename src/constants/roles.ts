export const ROLES = {
  CUSTOMER: "customer",
  DRIVER: "driver",
  ADMIN: "admin",
  BRAND: "brand",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

