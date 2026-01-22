<template>
  <div class="bannerhome-container">

    <!-- Main banner -->
    <div v-if="!showGridOnly && !showColumnOnly && !showPopular" class="banner-image">
     <button class="shop-now" @click="handleShopNow">
      Shop Now
    </button>

    </div>

    <!-- ================= POPULAR PRODUCTS ================= -->
<section v-if="showPopular" class="popular-section">
  <h1>Popular Products</h1>

  <div class="popular-grid">
    <div
      v-for="product in products"
      :key="product.id"
      class="popular-card"
    >
      <div class="badge" :class="{ 'sale-badge': product.badge === 'SALE' }" v-if="product.badge">
        {{ product.badge }}
      </div>

      <img :src="product.image" :alt="product.name" />

      <h3>{{ product.name }}</h3>

      <div class="stars">
        <span v-for="n in 5" :key="n" class="star">&#9733;</span>
      </div>

      <p class="price">{{ product.price }} $</p>

      <button class="add-btn" @click="addToCart(product)">
        Add to cart
      </button>
    </div>
  </div>
</section>

    <!-- Grid banners -->
    <div v-if="showGridOnly" class="gridbanner">

      <!-- Banner 2 → Soup Set (center text) -->
      <router-link
        class="grid-item large abstract text-center"
        :to="{ name: 'sets', params: { category: 'soup' } }"
      >
        <img src="/images/banner2-home.png" alt="Soup Banner" />
        <div class="overlay-text black">
          Khmer Set Food<br />
        </div>
      </router-link>

      <div class="grid-column">

        <!-- Banner 3 → Vegetable (top text) -->
        <router-link
          class="grid-item abstract text-top"
          :to="{ name: 'vegetables', params: { category: 'vegetables' } }"
        >
          <img src="/images/banner3-home.png" alt="Vegetables Banner" />
          <div class="overlay-text green">
            Vegetable
          </div>
        </router-link>

        <!-- Banner 4 → Meat (bottom text) -->
        <router-link
          class="grid-item abstract text-bottom"
          :to="{ name: 'meats', params: { category: 'meat' } }"
        >
          <img src="/images/banner4-home.png" alt="Meat Banner" />
          <div class="overlay-text white">
            Meat
          </div>
        </router-link>

      </div>
    </div>

    <!-- Column banners -->
    <div v-if="showColumnOnly" class="columnbanner">
      <div class="grid-column1">
        <div class="grid-item1">
          <img src="/images/Banner5-home.png" alt="Banner 5" />
        </div>
        <div class="grid-item1">
          <img src="/images/Banner6-home.png" alt="Banner 6" />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useCartStore } from '../stores/cart'

const cart = useCartStore()

defineProps({
  showGridOnly: { type: Boolean, default: false },
  showColumnOnly: { type: Boolean, default: false },
  showPopular: { type: Boolean, default: false },
})

const products = reactive([
  { id: 1, name: "Amok", price: 11.9, badge: "BESTSELLER", image: "/images/amok.png" },
  { id: 2, name: "Beef", price: 9.89, badge: "BESTSELLER", image: "/images/beef.png" },
  { id: 3, name: "Broccoli", price: 5.89, badge: "BESTSELLER", image: "/images/broccoli.png" },
  { id: 4, name: "Stream Fish", price: 10, badge: "SALE", image: "/images/streamFish.png" },
])

function addToCart(product: any) {
  cart.addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    qty: 1,
    image: product.image
  })
}
const emit = defineEmits<{
  (e: 'shop-now'): void
}>()

function handleShopNow() {
  emit('shop-now')
}
</script>


<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Baloo+Da&family=Baloo+Bhai&display=swap');

.bannerhome-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.banner-image {
  width: 100%;
  height: 92vh;
  background: url('/images/Food-banner.png') center / cover no-repeat;
  position: relative;
}

.shop-now {
  position: absolute;
  bottom: 3.125rem;
  left: 9.375rem;
  padding: 0.75rem 1.5625rem;
  background: #6ec007;
  color: white;
  font-size: 1.25rem;
  border-radius: 1.875rem;
  border: none;
  cursor: pointer;
  font-family: 'Baloo Da', cursive;
}

.shop-now:hover {
  background-color: white;
  color: #57a600;
  transition: background-color 0.3s ease;
}

.gridbanner {
  display: grid;
  grid-template-columns: 39.6875rem 39.875rem;
  gap: 1.5rem;
  width: 90%;
  max-width: 79.6875rem;
  margin-top: 1.25rem;
}

.grid-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.grid-item {
  position: relative;
  overflow: hidden;
  border-radius: 1.875rem;
  box-shadow: inset 0 0 1.5625rem 0.3125rem rgba(0, 0, 0, 0.2);
}

.grid-item.large {
  height: 26.375rem;
  width: 39.6875rem;
}

.grid-column .grid-item {
  height: 12.5rem;
  width: 31.25rem;
}

.grid-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.grid-item.abstract::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0,0,0,0.05),
    rgba(0,0,0,0.35)
  );
}

.grid-item:hover img {
  transform: scale(1.08);
}

.overlay-text {
  position: absolute;
  left: 30%;
  transform: translateX(-50%);
  z-index: 2;
  font-family: 'Baloo Bhai', cursive;
  font-size: 3rem;
  line-height: 1.1;
  text-align: center;
}

.text-center .overlay-text {
  top: 30%;
  left: 40%;
  transform: translate(-50%, -50%);
}

.text-top .overlay-text {
  top: 3.125rem;
  transform: translateX(-50%);
}

.text-bottom .overlay-text {
  bottom: 5rem;
  left: 20%;
  transform: translateX(-50%);
}

.overlay-text.black { color: #000000; }
.overlay-text.green { color: #2C3A06; }
.overlay-text.white { color: #ffffff; }

.columnbanner {
  width: 90%;
  max-width: 79.6875rem;
}

.grid-column1 {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-bottom: 5rem;
}

.grid-item1 {
  border-radius: 1.875rem;
  overflow: hidden;
  box-shadow: inset 0 0 0 0.3125rem black;
}

.grid-item1 img {
  width: 100%;
  display: block;
}

.popular-section {
  width: 100%;
  text-align: center;
  margin-top: 0.3125rem;
}

.popular-section h1 {
  font-size: 3rem;
  font-family: 'Baloo Tamma 2', cursive;
  color: #6ec007;
  margin-bottom: 1.25rem;
}

.popular-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
  width: 90%;
  max-width: 87.5rem;
  margin: 0 auto;
}

.popular-card {
  background: white;
  border-radius: 1.375rem;
  padding: 0.9375rem;
  position: relative;
  box-shadow: 0 0.625rem 1.25rem rgba(52, 50, 50, 0.35);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.popular-card:hover {
  transform: translateY(-0.5rem);
}

.badge {
  position: absolute;
  top: 0.75rem;
  left: -0.5rem;
  background: #2c5f2d;
  color: white;
  font-size: 0.75rem;
  padding: 0.375rem 0.8125rem;
  border-radius: 1.25rem 0 1.25rem 0;
  transform: rotate(-45deg);
}

.popular-card img {
  width: 100%;
  height: 11.25rem;
  object-fit: contain;
  background: #f8efd8;
  border-radius: 0.75rem;
  padding: 0.625rem;
}

.stars {
  color: #f5a623;
}

.price {
  color: red;
  font-weight: bold;
}

.add-btn {
  background: #6ec007;
  color: white;
  border: none;
  border-radius: 0.875rem;
  padding: 0.5rem 0.875rem;
  cursor: pointer;
}

</style>
