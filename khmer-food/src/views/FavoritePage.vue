<script setup lang="ts">
import ProductCard from '../components/ProductCard.vue';
import { useFavoriteStore } from '../stores/favorite';

const favorite = useFavoriteStore();

function removeFromFavorite(product: any) {
  favorite.removeFavorite(product.id); // Make sure this method exists in your store
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
.favorite-page {
  padding: 2rem;
  font-family: 'Baloo Da', cursive;
}
.title {
  text-align: center;
  font-size: 2.5rem;
  color: #e91e63;
  margin: 2rem 0;
}
.empty {
  text-align: center;
  font-size: 1.2rem;
  color: #666;
}
.products {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  justify-content: center;
}
.favorite-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.remove-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  color: red;
  cursor: pointer;
  z-index: 2;
}
</style>
