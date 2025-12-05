import { defineStore } from 'pinia';

export const useFavoriteStore = defineStore('favorite', {
  state: () => ({
    items: [] as any[]
  }),
  actions: {
    addFavorite(product: any) {
      const exists = this.items.find(p => p.id === product.id);
      if (!exists) this.items.push(product);
    },
    removeFavorite(id: number) {
      this.items = this.items.filter(p => p.id !== id);
    }
  }
});