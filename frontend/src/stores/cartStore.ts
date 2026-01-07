import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from '../types';

interface CartState {
  items: CartItem[];
  customerName: string;
  tableNumber: number | null;
  addItem: (item: CartItem) => void;
  removeItem: (menuId: number) => void;
  updateQuantity: (menuId: number, quantity: number) => void;
  updateNote: (menuId: number, note: string) => void;
  setCustomerName: (name: string) => void;
  setTableNumber: (tableNumber: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      customerName: '',
      tableNumber: null,

      addItem: (item) => {
        const { items } = get();
        const existingItem = items.find((i) => i.menu_id === item.menu_id);

        if (existingItem) {
          set({
            items: items.map((i) =>
              i.menu_id === item.menu_id
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
          });
        } else {
          set({ items: [...items, item] });
        }
      },

      removeItem: (menuId) => {
        set({ items: get().items.filter((i) => i.menu_id !== menuId) });
      },

      updateQuantity: (menuId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(menuId);
          return;
        }
        set({
          items: get().items.map((i) =>
            i.menu_id === menuId ? { ...i, quantity } : i
          ),
        });
      },

      updateNote: (menuId, note) => {
        set({
          items: get().items.map((i) =>
            i.menu_id === menuId ? { ...i, note } : i
          ),
        });
      },

      setCustomerName: (name) => set({ customerName: name }),

      setTableNumber: (tableNumber) => set({ tableNumber }),

      clearCart: () => set({ items: [], customerName: '', tableNumber: null }),

      getTotalPrice: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },

      getTotalItems: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
    }),
    {
      name: 'coffee-cart',
    }
  )
);
