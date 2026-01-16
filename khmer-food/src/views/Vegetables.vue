<template>
  <div>
    <Banner />

    <h1 class="Title">Feature Products</h1>

    <div class="products">
        <ProductCard
          v-for="item in filteredProducts"
        :key="item.id"
        :product="item"
        :showCart="true"
        :showStock="true"
        :showFavorite="true"
        @add-to-cart="addToCart"
        @add-to-favorite="addToFavorite"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import Banner from '../components/Banner.vue'
import ProductCard from '../components/ProductCard.vue'
import { useCartStore } from '../stores/cart'
import { useFavoriteStore } from '../stores/favorite'
import { getProducts } from '../services/vegService'

export default {
  name: 'VegetablesView',
  components: { Banner, ProductCard },
  setup() {
    const products = ref<any[]>([])
    const route = useRoute()

    const filteredProducts = computed(() => {
      const q = String(route.query.q || '').trim().toLowerCase()
      if (!q) return products.value
      return products.value.filter((p: any) => {
        const name = (p.name || p.title || '').toString().toLowerCase()
        const desc = (p.description || '').toString().toLowerCase()
        return name.includes(q) || desc.includes(q)
      })
    })

    const cart = useCartStore()
    const favorite = useFavoriteStore()

    onMounted(async () => {
      try {
        const res = await getProducts()
        products.value = res.data
      } catch (error) {
        console.error('Failed to load products', error)
      }

      await cart.loadCart()
      await favorite.loadFavorites()
    })

    async function addToCart(product: any) {
      await cart.addItem(product)
    }

    async function addToFavorite(product: any) {
      await favorite.addFavorite(product)
    }

    return { products, filteredProducts, addToCart, addToFavorite }
  }
}
</script>


<style scoped>
.products {
  display: grid;
  grid-template-columns: repeat(4, 300px);
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 3rem;
}

.Title {
  text-align: center;
  font-family: 'Baloo Da', cursive;
  font-size: 2.5rem;
  margin-top: 2rem;
  color: #548D0C;
}
</style>
