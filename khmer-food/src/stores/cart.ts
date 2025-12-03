import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as any[]
  }),
  actions: {
    addItem(product: any) {
      const existing = this.items.find(i => i.name === product.name && i.unit === product.unit);
      if (existing) {
        existing.qty += product.qty || 1;
      } else {
        this.items.push({ ...product, qty: product.qty || 1 });
      }
    },
    removeItem(index: number) {
      this.items.splice(index, 1);
    },
    updateQty(index: number, qty: number) {
      this.items[index].qty = qty;
    }
  }
});
