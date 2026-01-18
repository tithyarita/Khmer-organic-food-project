<script setup lang="ts">
import ProductCard from '../components/ProductCard.vue'
import { useFavoriteStore } from '../stores/favorite'

const favorite = useFavoriteStore()

function removeFromFavorite(product: any) {
  favorite.removeFavorite(product.id)
}
</script>

<template>
  <div class="favorite-page">
    <h1 class="title">Our Favorite Products</h1>

    <div v-if="favorite.items.length === 0" class="empty">
      <p>No favorite products yet. Click the heart icon to add some!</p>
    </div>

    <div v-else class="products">
      <div
        v-for="item in favorite.items"
        :key="item.id"
        class="favorite-card"
      >
        <ProductCard
          :product="item"
          :showCart="false"
          :showStock="false"
          :showFavorite="false"
        />

        <button class="remove-btn" @click="removeFromFavorite(item)">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Page */
.favorite-page {
  padding: 2rem 1rem;
  font-family: 'Roboto', sans-serif;
  overflow-x: hidden; /* 🔥 prevent side scroll */
}

/* Title */
.title {
  text-align: center;
  font-size: 2.5rem;
  color: #e91e63;
  margin: 2rem 0;
}

/* Empty */
.empty {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
}

/* 🔥 GRID SYSTEM (NO OVERFLOW) */
.products {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.2rem;
  max-width: 1200px;
  margin: auto;
  align-items: start;
}

/* Card wrapper */
.favorite-card {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
}

/* 🔥 MAKE ProductCard SMALL (REAL SIZE, NOT SCALE) */
.favorite-card :deep(.product-card) {
  width: 100%;
  max-width: 230px;
  height: auto;
  padding: 0.8rem;
}

/* Smaller image */
.favorite-card :deep(img) {
  height: 140px;
  object-fit: contain;
}

/* Smaller text */
.favorite-card :deep(.product-name) {
  font-size: 1rem;
}

.favorite-card :deep(.price) {
  font-size: 1rem;
}

/* Remove button */
.remove-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: white;
  color: red;
  font-size: 14px;
  cursor: pointer;
  
  display: flex;              /* ✅ IMPORTANT */
  align-items: center;        /* ✅ vertical center */
  justify-content: center; 
  z-index: 10;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

/* Desktop: EXACTLY 4 columns */
@media (min-width: 1200px) {
  .products {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
