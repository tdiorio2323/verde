import { ROLES, type Role } from "@/constants/roles";

export function deriveRole(me: { isAdmin: boolean; brandIds: string[] }): Role {
  if (me.isAdmin) return ROLES.ADMIN;
  if (me.brandIds?.length) return ROLES.BRAND;
  return ROLES.CUSTOMER;
}

