import { defineStore } from 'pinia'

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [] as any[]
  }),

  actions: {
    async fetchProducts() {
      const res = await fetch('http://localhost:8000/api/products')
      this.products = await res.json()
    },

    getProductById(id: string) {
      return this.products.find(p => String(p.id) === String(id))
    }
  }
})
