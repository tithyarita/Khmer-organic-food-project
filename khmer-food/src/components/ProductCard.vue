<script setup lang="ts">
import { ref } from 'vue';
import { useCartStore } from '../stores/cart';
import { useFavoriteStore } from '../stores/favorite';
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

onMounted(async () => {
  const res = await fetch(`/api/reviews/${props.product.id}`);
  const data = await res.json();
  // keep decimals for half stars
  props.product.rating = parseFloat(data.avg);
});

async function submitRating(value: number) {
  // Send rating to backend (JSON file API)
  await fetch('/api/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productId: props.product.id, rating: value })
  });

  // Reload average rating
  const res = await fetch(`/api/reviews/${props.product.id}`);
  const data = await res.json();
  props.product.rating = parseFloat(data.avg);
}


const props = defineProps<{
  product: any;
  showCart?: boolean;     // control Add to Cart
  showStock?: boolean;    // control In Stock text
  showFavorite?: boolean; // control heart icon
}>();

const emit = defineEmits(['add-to-cart', 'add-to-favorite']);

const cart = useCartStore();
const favorite = useFavoriteStore();
const router = useRouter();

const isFavorite = ref(false);

function addToCart(product: any) {
  cart.addItem(product);
  emit('add-to-cart', product);
  router.push('/cart');
}

function addToFavorite(product: any) {
  if (!favorite.items.find(p => p.id === product.id)) {
    favorite.addFavorite({ ...product });
  }
  isFavorite.value = true;
  emit('add-to-favorite', product);
  router.push('/favorite');
}


</script>

<template>

  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</link>
  <div class="card" :class="{ 'out-of-stock': product.stock === 0 }">
    <!-- Header -->
    <div class="card-header">
      <!-- Stock status -->
      <div v-if="showStock" class="stock-status">
        <i :class="product.stock ? 'fa-solid fa-check-circle' : 'fa-solid fa-times-circle'"></i>
        <span>{{ product.stock ? 'In Stock' : 'Out of Stock' }}</span>
      </div>

      <!-- Favorite button -->
      <button
        v-if="showFavorite"
        class="favorite-btn"
        type="button"
        @click="addToFavorite(product)"
      >
        <i :class="isFavorite ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
      </button>
    </div>

    <!-- Image -->
    <div class="card-image">
      <img :src="product.image || '/default-product.jpg'" :alt="product.name" />
    </div>

    <!-- Footer -->
    <div class="card-footer">
      <!-- Rating -->
      <div class="rating">
        <i
          v-for="n in 5"
          :key="n"
          :class="{
            'fa-solid fa-star': n <= Math.floor(product.rating),
            'fa-regular fa-star': n > product.rating
          }"

          @click="submitRating(n)"
          style="cursor: pointer;"
        ></i>
      </div>


      <div class="info-row">
        <span class="product-name">{{ product.name }}</span>
        <span class="product-price">${{ product.price }}/{{ product.unit }}</span>
      </div>

      <!-- Add to Cart -->
      <button
        v-if="showCart"
        class="add-to-cart"
        :disabled="!product.stock"
        @click="addToCart(product)"
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

/* Out of stock mode */
.out-of-stock {
  background: #e5e5e5 !important;
  filter: grayscale(70%);
  opacity: 0.6;
}

/* Header */
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

.stock-status i {
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

/* Image */
.card-image {
  position: relative;
  text-align: center;
}

.card-image img {
  max-width: 250px;
  height: 180px;
  border-radius: 0.25rem;
}

/* Footer */
.card-footer {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rating {
  color: #FFD700;
  font-size: 1rem;
}

.rating i {
  transition: transform 0.2s ease;
}
.rating i:hover {
  transform: scale(1.2);
  color: #ff9800;
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
