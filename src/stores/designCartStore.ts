import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DesignAsset } from '@/lib/designs';

export interface DesignCartItem {
  asset: DesignAsset;
  addedAt: string;
}

interface DesignCartStore {
  items: DesignCartItem[];
  addItem: (asset: DesignAsset) => void;
  removeItem: (assetPath: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  isInCart: (assetPath: string) => boolean;
}

export const useDesignCartStore = create<DesignCartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (asset: DesignAsset) => {
        const currentItems = get().items;
        const exists = currentItems.some(item => item.asset.path === asset.path);
        
        if (!exists) {
          set({
            items: [
              ...currentItems,
              {
                asset,
                addedAt: new Date().toISOString(),
              },
            ],
          });
        }
      },
      
      removeItem: (assetPath: string) => {
        set({
          items: get().items.filter(item => item.asset.path !== assetPath),
        });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getItemCount: () => {
        return get().items.length;
      },
      
      isInCart: (assetPath: string) => {
        return get().items.some(item => item.asset.path === assetPath);
      },
    }),
    {
      name: 'design-cart-storage',
    }
  )
);