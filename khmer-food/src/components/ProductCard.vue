<script setup lang="ts">
import { ref, watch } from 'vue'
import { useCartStore } from '../stores/cart'
import { useFavoriteStore } from '../stores/favorite'
import { useRouter } from 'vue-router'
import { getUserStorage, isLoggedIn } from '../loginstorage.js'


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

// Track whether this product is in favorites
const isFavorite = ref(false)

// Watch favorite store to update heart icon
watch(
  () => favorite.items,
  () => {
    isFavorite.value = favorite.items.some(p => p.id === props.product.id)
  },
  { immediate: true }
)

// Add to cart
function addToCart(product: any) {
  const user = getUserStorage()
  if (!user) {
    const goLogin = confirm('Please login first. Go to login page?')
    if (goLogin) router.push('/loginSignup')
    return
  }

  cart.addItem(product)
  emit('add-to-cart', product)
}

// Add to favorite
function addToFavorite(product: any) {
  const user = getUserStorage()

  if (!user) {
    const goLogin = confirm('Please login first. Go to login page?')
    if (goLogin) router.push('/loginSignup')
    return
  }

  // If already logged in, save favorite automatically
  favorite.addFavorite({ ...product })
  isFavorite.value = true
  emit('add-to-favorite', product)
}

</script>

<template>
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
      <div class="rating">
        <i v-for="n in 5" :key="n" :class="n <= product.rating ? 'fa-solid fa-star' : 'fa-regular fa-star'"></i>
      </div>

      <div class="info-row">
        <span class="product-name">{{ product.name }}</span>
        <span class="product-price">${{ product.price }}/{{ product.unit }}</span>
      </div>

      <button v-if="showCart" class="add-to-cart" :disabled="!product.stock" @click="addToCart(product)">
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

.out-of-stock {
  background: #e5e5e5 !important;
  filter: grayscale(70%);
  opacity: 0.6;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
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
  padding: 0;
}

.favorite-btn i {
  font-size: 1.2rem;
  color: #e91e63;
  transition: transform 0.2s ease;
}

.favorite-btn i:hover {
  transform: scale(1.2);
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
  gap: 0.5rem;
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
  font-size: 1rem;
  transition: 0.3s ease;
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
