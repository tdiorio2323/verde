import { create } from "zustand";

export type CartItem = {
  id: string;
  slug: string;
  title: string;
  price_cents: number;
  qty: number;
  image_url?: string;
};

type State = {
  items: CartItem[];
};

type Actions = {
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  totalCents: () => number;
};

export const useCart = create<State & Actions>((set, get) => ({
  items: [],

  add: (i, qty = 1) =>
    set((s) => {
      const idx = s.items.findIndex((x) => x.id === i.id);
      if (idx >= 0) {
        const copy = [...s.items];
        copy[idx] = { ...copy[idx], qty: copy[idx].qty + qty };
        return { items: copy };
      }
      return { items: [...s.items, { ...i, qty }] };
    }),

  remove: (id) => set((s) => ({ items: s.items.filter((x) => x.id !== id) })),

  setQty: (id, qty) =>
    set((s) => ({
      items: s.items.map((x) => (x.id === id ? { ...x, qty } : x)),
    })),

  clear: () => set({ items: [] }),

  totalCents: () => get().items.reduce((t, x) => t + x.price_cents * x.qty, 0),
}));
