<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useCartStore } from '../stores/cart'
import { useFavoriteStore } from '../stores/favorite'
import { useRouter } from 'vue-router'
import { getUserStorage } from '../loginstorage.js'

import { getProductRatingStats } from '@/services/reviewService'

// Props
const props = defineProps<{
  product: any
  showCart?: boolean
  showStock?: boolean
  showFavorite?: boolean
}>()

const emit = defineEmits(['add-to-cart', 'add-to-favorite'])

const cart = useCartStore()
const favorite = useFavoriteStore()
const router = useRouter()

// Favorite state
const isFavorite = ref(false)

// Rating state
const avgRating = ref(0)
const reviewCount = ref(0)



// Watch favorite store
watch(
  () => favorite.items,
  () => {
    isFavorite.value = favorite.items.some(p => p.id === props.product.id)
  },
  { immediate: true }
)

// Load rating stats
onMounted(async () => {
  const stats = await getProductRatingStats(props.product.id)
  avgRating.value = stats.average
  reviewCount.value = stats.count
})

// Add to cart
// function addToCart(product: any) {
//   const user = getUserStorage()
//   if (!user) {
//     const goLogin = confirm('Please login first. Go to login page?')
//     if (goLogin) router.push('/loginSignup')
//     return
//   }

//   cart.addItem(product)
//   emit('add-to-cart', product)
// }


const isCartClicked = ref(false)

function addToCart(product: any) {
  const user = getUserStorage()
  if (!user) {
    const goLogin = confirm('Please login first. Go to login page?')
    if (goLogin) router.push('/loginSignup')
    return
  }

  cart.addItem(product)
  emit('add-to-cart', product)

  // Trigger animation
  isCartClicked.value = true
  setTimeout(() => {
    isCartClicked.value = false
  }, 600) // match CSS animation duration
}

// Add to favorite
function addToFavorite(product: any) {
  const user = getUserStorage()
  if (!user) {
    const goLogin = confirm('Please login first. Go to login page?')
    if (goLogin) router.push('/loginSignup')
    return
  }

  favorite.addFavorite({ ...product })
  isFavorite.value = true
  emit('add-to-favorite', product)
}
</script>

<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
  />

  <div class="card" :class="{ 'out-of-stock': product.stock === 0 }">
    <!-- Header -->
    <div class="card-header">
      <div v-if="showStock" class="stock-status">
        <i :class="product.stock ? 'fa-solid fa-check-circle' : 'fa-solid fa-times-circle'"></i>
        <span>{{ product.stock ? 'In Stock' : 'Out of Stock' }}</span>
      </div>

      <button v-if="showFavorite" class="favorite-btn" @click="addToFavorite(product)">
        <i :class="isFavorite ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
      </button>
    </div>

    <!-- Image -->
    <div class="card-image">
      <img :src="product.image || '/default-product.jpg'" :alt="product.name" />
    </div>

    <!-- Footer -->
    <div class="card-footer">
      <!-- ⭐ Rating (READ ONLY) -->
      <div class="rating">
        <i
          v-for="n in 5"
          :key="n"
          :class="{
            'fa-solid fa-star': n <= Math.round(avgRating),
            'fa-regular fa-star': n > Math.round(avgRating)
          }"
        ></i>
        <small v-if="reviewCount">({{ reviewCount }})</small>
        <small v-else>(0)</small>
      </div>

      <div class="info-row">
        <span class="product-name">{{ product.name }}</span>
        <span class="product-price">
          ${{ product.price }}/{{ product.unit }}
        </span>
      </div>

      <!-- <button
        v-if="showCart"
        class="add-to-cart"
        :disabled="!product.stock"
        @click="addToCart(product)"
      >
        <i class="fa-solid fa-cart-shopping"></i>
        {{ product.stock ? 'Add to Cart' : 'Unavailable' }}
      </button> -->

      <button
      v-if="showCart"
      class="add-to-cart"
      :disabled="!product.stock"
      @click="addToCart(product)"
      :class="{ 'clicked': isCartClicked }"
    >
      <i class="fa-solid fa-cart-shopping"></i>
      {{ product.stock ? 'Add to Cart' : 'Unavailable' }}
    </button>
    </div>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  padding: 1rem;
  width: 350px;
  height: 470px;
  box-shadow: 0 0.25rem 0.5rem rgba(133, 237, 121, 0.1);
  font-family: 'Baloo Da', cursive;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 3rem;
  background: #fff;
  transition: 0.3s ease;
}

.add-to-cart.clicked {
  animation: bounce 0.6s ease;
}

@keyframes bounce {
  0%   { transform: scale(1); }
  30%  { transform: scale(1.15); }
  50%  { transform: scale(0.95); }
  70%  { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.out-of-stock {
  background: #e5e5e5 !important;
  filter: grayscale(70%);
  opacity: 0.6;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stock-status {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  color: #2e7d32;
}

.favorite-btn {
  background: transparent;
  border: none;
  cursor: pointer;
}

.favorite-btn i {
  font-size: 1.2rem;
  color: #e91e63;
}

.card-image {
  text-align: center;
}

.card-image img {
  max-width: 250px;
  height: 180px;
  border-radius: 0.25rem;
}

.card-footer {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.rating {
  color: #FFD700;
  font-size: 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: 600;
}

.add-to-cart {
  background-color: #6EC007;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: bold;
  width: 100%;
  height: 3rem;
}

.add-to-cart:hover {
  background-color: #4CAF50;
}

.add-to-cart:disabled {
  background-color: #cbddb9;
  cursor: not-allowed;
}

.product-price {
  color: #6EC007;
}
</style>
