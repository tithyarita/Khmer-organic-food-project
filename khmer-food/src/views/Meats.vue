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

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, onMounted, computed } from 'vue'
import Banner from '../components/Banner.vue'
import ProductCard from '../components/ProductCard.vue'
import { useCartStore } from '../stores/cart'
import { useFavoriteStore } from '../stores/favorite'
import { getProducts } from '../services/meatService'


const products = ref<any[]>([])

import { useRoute } from 'vue-router'
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
  grid-template-columns: repeat(4, 300px);
  gap: 1rem;
  flex-wrap: wrap;
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
