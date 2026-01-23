<template>
  <div class="category-section">
    <!-- Category Title -->
    <h2 class="category-title">{{ title }}</h2>

    <!-- Product Row -->
    <div class="product-row" ref="row">
      <div
        v-for="item in items"
        :key="item.id"
        class="card"
        :class="{ 'out-of-stock': item.stock === 0 }"
      >
        <!-- Header -->
        <div class="card-header">
          <!-- Stock -->
          <div class="stock-status">
            <i :class="item.stock ? 'fa-solid fa-check-circle' : 'fa-solid fa-times-circle'"></i>
            <span>{{ item.stock ? 'In Stock' : 'Out of Stock' }}</span>
          </div>

          <!-- Favorite -->
          <button class="favorite-btn" @click="addToFavorite(item)">
            <i :class="isFavorite(item) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
          </button>
        </div>

        <!-- Discount under header -->
        <div v-if="item.discount && item.discount > 0" class="discount-label">
          -{{ item.discount }}%
        </div>

        <!-- Image -->
        <div class="card-image">
          <img :src="item.image || '/default-product.jpg'" :alt="item.name" />
        </div>

        <!-- Footer -->
        <div class="card-footer">
          <!-- ⭐ Rating + Old Price -->
          <div class="footer-row">
            <div class="rating">
              <i
                v-for="n in 5"
                :key="n"
                :class="{
                  'fa-solid fa-star': n <= Math.round(item.avgRating || 0),
                  'fa-regular fa-star': n > Math.round(item.avgRating || 0)
                }"
              ></i>
              <small>({{ item.reviewCount || 0 }})</small>
            </div>

            <!-- Old price -->
            <span v-if="item.discount && item.discount > 0" class="old-price">
              ${{ item.price }}/{{ item.unit }}
            </span>
          </div>

          <!-- Product name + New price -->
          <div class="footer-row">
            <span class="product-name">{{ item.name }}</span>
            <span class="product-price">
              <template v-if="item.discount && item.discount > 0">
                <div class="price-stack">
                  <span class="new-price">
                    ${{ (item.price - (item.price * item.discount) / 100).toFixed(2) }}/{{ item.unit }}
                  </span>
                </div>
              </template>

              <template v-else>
                ${{ item.price }}/{{ item.unit }}
              </template>
            </span>
          </div>

          <!-- Action buttons -->
          <div class="action-row">
            <button
              class="icon-btn cart-btn"
              :disabled="!item.stock"
              @click="addToCart(item)"
              :class="{ 'clicked': isCartClicked }"
            >
              <i class="fa-solid fa-cart-shopping"></i>
            </button>

            <button
              class="icon-btn detail-btn"
              @click="goToDetail(item.id)"
            >
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination Dots -->
    <div class="pagination-dots">
      <span
        v-for="n in totalPages"
        :key="n"
        class="dot"
        :class="{ active: activePage === n - 1 }"
        @click="scrollToPage(n - 1)"
      ></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useFavoriteStore } from '../stores/favorite'
import { getUserStorage } from '../loginstorage.js'
import { getProductRatingStats } from '@/services/reviewService'

const router = useRouter()
const cart = useCartStore()
const favorite = useFavoriteStore()

const props = defineProps({
  title: String,
  items: Array // [{ id, name, price, image, stock, unit }]
})

const isCartClicked = ref(false)

function goToDetail(id: number) {
  router.push({ name: 'ProductDetail', params: { id } })
}

function addToCart(product: any) {
  const user = getUserStorage()
  if (!user) {
    const goLogin = confirm('Please login first. Go to login page?')
    if (goLogin) router.push('/loginSignup')
    return
  }
  cart.addItem(product)

  isCartClicked.value = true
  setTimeout(() => {
    isCartClicked.value = false
  }, 600)
}

function addToFavorite(product: any) {
  const user = getUserStorage()
  if (!user) {
    const goLogin = confirm('Please login first. Go to login page?')
    if (goLogin) router.push('/loginSignup')
    return
  }
  favorite.addFavorite({ ...product })
}

function isFavorite(product: any) {
  return favorite.items.some(p => p.id === product.id)
}

// ⭐ Load ratings for each product in the category
onMounted(async () => {
  for (const item of props.items) {
    const stats = await getProductRatingStats(String(item.id))
    item.avgRating = stats.average
    item.reviewCount = stats.count
  }
})

const row = ref<HTMLDivElement | null>(null)
const activePage = ref(0)
const totalPages = ref(0)

onMounted(() => {
  if (row.value) {
    totalPages.value = Math.ceil(props.items.length / 4)
    row.value.addEventListener('scroll', () => {
      const cardWidth = row.value.scrollWidth / props.items.length
      // const currentIndex = Math.round(row.value.scrollLeft / (cardWidth * 4))
      // activePage.value = currentIndex
    })
  }
})

function scrollToPage(page: number) {
  if (row.value) {
    const cardWidth = row.value.scrollWidth / props.items.length
    const scrollLeft = page * cardWidth * 4
    row.value.scrollTo({ left: scrollLeft, behavior: 'smooth' })
  }
}
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  padding: 1rem;
  width: 300px;
  height: 400px;
  box-shadow: 0 0.25rem 0.5rem rgba(133, 237, 121, 0.1);
  font-family: 'Quicksand', sans-serif;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
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

.action-row {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.icon-btn {
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cart-btn {
  background-color: #6EC007;
  color: white;
}

.cart-btn:disabled {
  background-color: #cbddb9;
  cursor: not-allowed;
}

.detail-btn {
  background-color: #6EC007;
  color: white;
}

.category-section {
  margin-bottom: 2rem;
}

.category-title {
  font-size: 1.6rem;
  font-weight: 750;
  color: #548D0C;
  font-family: 'Quicksand', sans-serif;
  background: #CCDEB6;
  padding: 10px 16px;
  display: inline-block;
  width: 100%;
  margin-bottom: 2rem;
}
.product-row {
  display: flex;
  gap: 2rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  scroll-behavior: smooth;
  justify-content: flex-start; /* align items left */
  flex-wrap: nowrap;           /* keep in one row */
  margin-left: 6rem;
  margin-right: 6rem;
}

.card {
  flex-shrink: 0; /* prevent shrinking so cards stay full size */
}

.product-row {
  overflow-x: auto;
  scrollbar-width: none;       /* Firefox */
  -ms-overflow-style: none;    /* IE/Edge */
}
.product-row::-webkit-scrollbar {
  display: none;               /* Chrome/Safari */
}

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

.dot.active {
  background: #6EC007; /* highlight active page */
}

.product-price {
  color: #6EC007;   /* green tone */
  font-weight: 700;
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

/* .old-price {
  text-decoration: line-through;
  color: #999;
  font-size: 0.9rem;
}

.new-price {
  color: #6EC007;
  font-weight: bold;
  font-size: 1.2rem;
} */

.old-price {
  text-decoration: line-through;
  color: #999;
  font-size: 0.9rem;
}

.new-price {
  color: #6EC007;
  font-weight: bold;
  font-size: 1.2rem;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 600;
}

</style>
