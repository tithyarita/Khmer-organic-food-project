import { defineStore } from 'pinia'

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as any[]
  }),
  actions: {
    addItem(product: any) {
      this.items.push(product)
    }
  }
})