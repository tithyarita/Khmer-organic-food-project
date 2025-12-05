import { defineStore } from 'pinia';

export const useFavoriteStore = defineStore('favorite', {
  state: () => ({
    items: [] as any[]
  }),
  actions: {
  addFavorite(product: any, source: string) {
    const exists = this.items.find(p => p.id === product.id);
    if (!exists) {
      this.items.push({
        ...product,
        source: source   // ⭐ Store where it came from
      });
    }
  },
    removeFavorite(id: number) {
      this.items = this.items.filter(p => p.id !== id);
    }
  }
});