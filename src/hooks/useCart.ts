import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// O Item do carrinho agora é leve
export interface CartItem {
	productId: string;
	quantity: number;
}

interface CartState {
	items: CartItem[];
	addItem: (productId: string) => void;
	removeItem: (productId: string) => void;
	updateQuantity: (productId: string, action: 'increase' | 'decrease') => void;
	clearCart: () => void;
	count: () => number;
	// Removemos 'total' daqui, pois o store não sabe mais o preço
}

export const useCart = create<CartState>()(
	persist(
		(set, get) => ({
			items: [],

			addItem: (productId) => {
				const currentItems = get().items;
				const existingItem = currentItems.find(
					(item) => item.productId === productId
				);

				if (existingItem) {
					set({
						items: currentItems.map((item) =>
							item.productId === productId
								? { ...item, quantity: item.quantity + 1 }
								: item
						),
					});
				} else {
					set({ items: [...currentItems, { productId, quantity: 1 }] });
				}
			},

			removeItem: (productId) => {
				set({
					items: get().items.filter((item) => item.productId !== productId),
				});
			},

			updateQuantity: (productId, action) => {
				const currentItems = get().items;
				const targetItem = currentItems.find(
					(item) => item.productId === productId
				);

				if (!targetItem) return;

				if (action === 'decrease' && targetItem.quantity === 1) {
					get().removeItem(productId);
				} else {
					set({
						items: currentItems.map((item) =>
							item.productId === productId
								? {
										...item,
										quantity:
											action === 'increase'
												? item.quantity + 1
												: item.quantity - 1,
								  }
								: item
						),
					});
				}
			},

			clearCart: () => set({ items: [] }),

			count: () => {
				return get().items.reduce((acc, item) => acc + item.quantity, 0);
			},
		}),
		{
			name: 'sabor-rondonia-cart-v2', // Mudei o nome para resetar caches antigos
			storage: createJSONStorage(() => localStorage),
		}
	)
);
