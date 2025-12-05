<script setup lang="ts">
import { useCartStore } from '../stores/cart';
import { useRouter } from 'vue-router';

defineProps<{ product: any }>();
defineEmits(['add-to-cart']);

const cart = useCartStore();
const router = useRouter();

function addToCart(product: any) {
  cart.addItem(product);
  router.push('/cart');
}
</script>

<template>
  <div class="card" :class="{ 'out-of-stock': !product.inStock }">
    <!-- Header -->
    <div class="card-header">
      <div class="stock-status">
        <i :class="product.inStock ? 'fa-solid fa-check-circle' : 'fa-solid fa-times-circle'"></i>
        <span>{{ product.inStock ? 'In Stock' : 'Out of Stock' }}</span>
      </div>

      <div class="favorite" @click.stop="isFavorite = !isFavorite">
        <i :class="isFavorite ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
      </div>
    </div>

    <!-- Center Image -->
    <div class="card-image">
      <img :src="product.image || '/default-product.jpg'" :alt="product.name" />
    </div>

    <!-- Footer -->
    <div class="card-footer">
      <div class="rating">
        <i v-for="n in 5" :key="n"
           :class="n <= product.rating ? 'fa-solid fa-star' : 'fa-regular fa-star'"></i>
      </div>

      <div class="info-row">
        <span class="product-name">{{ product.name }}</span>
        <span class="product-price">${{ product.price }}/Kg</span>
      </div>

      <!-- Add to Cart -->
      <button
        class="add-to-cart"
        :disabled="!product.inStock"
        @click="addToCart(product)"
      >
        <i class="fa-solid fa-cart-shopping"></i>
        {{ product.inStock ? 'Add to Cart' : 'Unavailable' }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  data() {
    return {
      isFavorite: false
    };
  }
};
</script>

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

/* ⭐ OUT OF STOCK MODE */
.out-of-stock {
  background: #e5e5e5 !important;   /* gray */
  filter: grayscale(70%);          /* no color */
  opacity: 0.6;                      /* dim */
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

.favorite i {
  font-size: 1.2rem;
  color: #e91e63;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.favorite i:hover {
  transform: scale(1.2);
}

/* Image */
.card-image {
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

/* Disabled button */
.add-to-cart:disabled {
  background-color: #cbddb9;
  cursor: not-allowed;
}

.product-price {
  color: #6EC007;
}
</style>
