<template>
  <div class="category-section">
    
    <!-- Category Title -->
    <h2 class="category-title">{{ title }}</h2>

    <!-- Product Row -->
    <div class="product-row">
      <div 
        v-for="item in items" 
        :key="item.id" 
        class="product-card"
        :class="{ 'out-of-stock': item.stock === 0 }"

      >
        <img 
          :src="item.image" 
          :alt="item.name" 
          class="product-img"
          
        />

        <p class="product-name">{{ item.name }}</p>

        <div class="bottom-row">
          <p class="price">${{ item.price }}</p>

          <button
            class="add-btn"
            :disabled="item.stock === 0"
            @click="goToDetail(item.id)"
          >
            <i class="fa-solid fa-arrow-right"></i>
          </button>

        </div>
      </div>
    </div>

    <!-- Pagination Dots -->
    <div class="pagination-dots">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>

  </div>
</template>


<script setup lang="ts">
import CategorySection from './CategorySection.vue'
import { useRouter } from "vue-router";

const router = useRouter();

defineProps({
  product: Object,
  title: String,
  items: Array     // [{ id, name, price, image }]
});
function goToDetail(id) {
  router.push({
    name: 'ProductDetail',
    params: { id }
  });
}

</script>

<style scoped>

/* OUT OF STOCK EFFECT (FOLLOWING YOUR STYLE) */
.product-card.out-of-stock {
  position: relative;
}

.product-card.out-of-stock::after {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(225, 223, 223, 0.523);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 700;
  border-radius: 0.8rem;
}

.category-section {
  margin-bottom: 2rem;
}

.category-title {
  font-size: 1.6rem;
  font-weight: 700;
  color: #548D0C;
  font-family: 'Baloo Da', cursive;
  background: #CCDEB6;
  padding: 10px 16px;
  display: inline-block;
  width: 100%;
  margin-bottom: 2rem;
}

/* Horizontal scroll row */
.product-row {
  display: flex;
  gap: 5rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  scroll-behavior: smooth;
  justify-content: center;
}

/* Product card */
.product-card {
  background: white;
  border-radius: 0.8rem;
  padding: 1rem;
  width: 13rem;
  box-shadow: 0 0.25rem 0.6rem rgba(102, 225, 106, 0.15);
  flex-shrink: 0;
  text-align: center;
}

.product-img {
  width: 100%;
  height: 15rem;
  object-fit: contain;
  border-radius: 0.5rem;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0.8rem 0;
}

/* Price + button row */
.bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.price {
  color: #6EC007;
  font-size: 1.1rem;
  font-weight: 700;
}

.add-btn {
  width: 2.2rem;
  height: 2.2rem;
  background: #6EC007;
  color: white;
  border: none;
  border-radius: 50%;
  font-size: 1rem;
  cursor: pointer;
}

/* Pagination dots */
.pagination-dots {
  display: flex;
  justify-content: center;
  margin-top: 0.5rem;
  gap: 0.4rem;
}

.dot {
  width: 0.45rem;
  height: 0.45rem;
  background: #ccc;
  border-radius: 50%;
}
</style>
