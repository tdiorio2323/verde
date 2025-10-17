import { create } from "zustand";
import { supabase } from "@/shared/lib/supabaseClient";
import { deriveRole, ROLES, type Role } from "@/shared/config/roles";

type SessionState = {
  isAdmin: boolean;
  brandIds: string[];
  role: Role;
  brandId: string | null;
  loading: boolean;
  refresh: () => Promise<void>;
  setActiveBrand: (id: string | null) => void;
};

export const useSession = create<SessionState>((set, get) => ({
  isAdmin: false,
  brandIds: [],
  role: ROLES.CUSTOMER,
  brandId: null,
  loading: true,
  setActiveBrand: (id) => set({ brandId: id }),
  refresh: async () => {
    set({ loading: true });
    const { data, error } = await supabase.rpc("me_roles");
    if (error) {
      console.error(error);
      set({ loading: false });
      return;
    }
    const isAdmin = !!data?.is_admin;
    const brandIds = (data?.brand_ids as string[]) ?? [];
    const role = deriveRole({ isAdmin, brandIds });
    const brandId = get().brandId ?? brandIds[0] ?? null;
    set({ isAdmin, brandIds, role, brandId, loading: false });
  },
}));

