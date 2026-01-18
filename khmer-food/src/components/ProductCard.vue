<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
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

// Discounted price computed
const discountedPrice = computed(() => {
  if (props.product.discount && props.product.discount > 0) {
    return (props.product.price - (props.product.price * props.product.discount) / 100).toFixed(2)
  }
  return props.product.price
})

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

// Add to cart with animation

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

    <!-- Discount under header -->
    <div v-if="product.discount && product.discount > 0" class="discount-label">
      -{{ product.discount }}%
    </div>

    <!-- Image -->
    <div class="card-image">
      <img :src="product.image || '/default-product.jpg'" :alt="product.name" />
    </div>

    <!-- Footer -->
    <div class="card-footer">
      <!-- Rating + Old Price -->
      <div class="footer-row">
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

        <!-- Old price (small, strike) -->
        <span v-if="product.discount && product.discount > 0" class="old-price">
          ${{ product.price }}/{{ product.unit }}
        </span>
      </div>

      <!-- Product name + New price -->
      <div class="footer-row">
        <span class="product-name">{{ product.name }}</span>
        <span class="new-price">
          <template v-if="product.discount && product.discount > 0">
            ${{ (product.price - (product.price * product.discount) / 100).toFixed(2) }}/{{ product.unit }}
          </template>
          <template v-else>
            ${{ product.price }}/{{ product.unit }}
          </template>
        </span>
      </div>

      <!-- Cart button -->
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
  width: 300px;
  height: 400px;
  box-shadow: 0 0.25rem 0.5rem rgba(133, 237, 121, 0.1);
  font-family: 'Roboto', sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 2rem;
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
  height: 130px;
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

.discount-label {
  background-color: #ff5252;
  color: white;
  font-weight: bold;
  padding: 0.2rem 0.5rem;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  text-align: center;
  width: fit-content;
  margin-left: 0rem;
  margin-top: -1.7rem;
}


.footer-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.old-price {
  text-decoration: line-through;
  color: #999;
  font-size: 0.9rem; /* smaller */
}

.new-price {
  color: #6EC007;
  font-weight: bold;
  font-size: 1.2rem; /* bigger */
}

.product-name {
  font-size: 1.1rem;
  font-weight: 600;
}


</style>
