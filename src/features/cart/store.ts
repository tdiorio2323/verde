import { create } from "zustand";

export type CartItem = {
  id: string;
  slug: string;
  title: string;
  price_cents: number;
  quantity: number;
  image_url?: string;
};

type State = {
  items: CartItem[];
};

type Actions = {
  add: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  totalCents: () => number;
};

export const useCart = create<State & Actions>((set, get) => ({
  items: [],

  add: (item, quantity = 1) =>
    set((state) => {
      const existingItemIndex = state.items.findIndex(
        (cartItem) => cartItem.id === item.id
      );

      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        const existingItem = updatedItems[existingItemIndex];
        updatedItems[existingItemIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + quantity,
        };
        return { items: updatedItems };
      }

      return { items: [...state.items, { ...item, quantity }] };
    }),

  remove: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  setQuantity: (id, quantity) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    })),

  clear: () => set({ items: [] }),

  totalCents: () =>
    get().items.reduce(
      (total, item) => total + item.price_cents * item.quantity,
      0
    ),
}));
