<template>
  <div>
    <Banner />

    <h1 class="Title">Feature Products</h1>

    <div class="products">
      <ProductCard
        v-for="item in products"
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

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Banner from '../components/Banner.vue'
import ProductCard from '../components/ProductCard.vue'
import { useCartStore } from '../stores/cart'
import { useFavoriteStore } from '../stores/favorite'
import { getProducts } from '../services/vegService'

const products = ref<any[]>([])

const cart = useCartStore()
const favorite = useFavoriteStore()

// ✅ load products from backend
onMounted(async () => {
  try {
    const res = await getProducts()
    products.value = res.data
  } catch (error) {
    console.error('Failed to load products', error)
  }
})

function addToCart(product: any) {
  cart.addItem(product)
}

function addToFavorite(product: any) {
  favorite.addFavorite(product)
}
</script>

<style scoped>
.products {
  display: grid;
  grid-template-columns: repeat(3, 350px);
  gap: 2rem;
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
