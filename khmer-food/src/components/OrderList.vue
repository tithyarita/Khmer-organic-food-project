<template>
  <div class="order-list">
    <div v-if="orders.length === 0" class="empty">
      {{ emptyText }}
    </div>

    <div v-for="order in orders" :key="order.id" class="order-card">

      <!-- Header -->
      <div class="order-header">
        <div>
          <strong>Order #{{ order.id }}</strong>
          <p class="datetime">
            {{ formatDate(order.createdAt) }} • {{ formatTime(order.createdAt) }}
          </p>
        </div>
        <div class="order-total">
          ${{ formatPrice(order.total) }}
        </div>
      </div>

      <!-- Status (TEXT ONLY) -->
      <p class="order-status">
        Status: <strong>{{ order.status }}</strong>
      </p>

      <!-- Items -->
      <div class="order-items">
        <div v-for="item in order.items" :key="item.id" class="order-item">
          <img :src="getItemImage(item)" class="item-image" />
          <div class="item-info">
            <p class="item-name">{{ item.name }}</p>
            <p class="item-qty">×{{ item.qty }}</p>
          </div>
          <div class="item-price">${{ formatPrice(item.price) }}</div>
        </div>
      </div>

      <!-- Summary -->
      <div class="order-summary">
        <div>Subtotal: ${{ formatPrice(order.subtotal) }}</div>
        <div>Delivery: ${{ formatPrice(order.delivery) }}</div>
        <div>Discount: -${{ formatPrice(order.discount) }}</div>
        <div class="total">Total Paid: ${{ formatPrice(order.total) }}</div>
      </div>

      <!-- Rate Button for Completed Orders -->
      <div v-if="order.status === 'completed'" class="rate-section">
        <button @click="rateOrder(order)" class="rate-btn">Rate Order</button>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

defineProps<{
  orders: any[]
  emptyText?: string
}>()

const router = useRouter()

function getItemImage(item: any) {
  if (item.image) return item.image
  if (item.category === 'vegetables') return '/images/vegBanner.jpeg'
  if (item.category === 'meats') return '/images/meatBanner.jpg'
  if (item.category === 'sets') return '/images/setBanner.png'
  return '/forProfile/profile.png'
}

const formatDate = (d: any) =>
  new Date(d?.toDate ? d.toDate() : d).toLocaleDateString()

const formatTime = (d: any) =>
  new Date(d?.toDate ? d.toDate() : d).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  })

const formatPrice = (v: any) =>
  Number(v || 0).toFixed(2)

function rateOrder(order: any) {
  router.push(`/review/${order.id}`)
}
</script>

<style scoped>
/* ===== LIST LAYOUT ===== */
.order-list {
  display: flex;
  flex-direction: column;
  gap: 28px;
  font-family:  'quicksand', sans-serif;
}

/* ===== ORDER CARD ===== */
.order-card {
  background: #ffffff;
  padding: 22px;
  border-radius: 18px;
  border: 1px solid rgba(109, 192, 7, 0.25);
  box-shadow: 0 6px 22px rgba(0, 0, 0, 0.05);
  font-family:  'quicksand', sans-serif;
}

/* ===== HEADER ===== */
.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.order-header strong {
  font-size: 1.05rem;
  font-weight: 600;
  color: #2d2d2d;
}

.datetime {
  font-size: 0.8rem;
  color: #8a8a8a;
  margin-top: 2px;
}

.order-total {
  font-size: 1.05rem;
  font-weight: 700;
  color: #6dc007;
}

/* ===== STATUS ===== */
.order-status {
  margin: 10px 0 14px;
  font-size: 0.85rem;
  color: #4e7d0b;
  background: rgba(109, 192, 7, 0.12);
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
}

/* ===== ITEMS ===== */
.order-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-item {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #f7fde9;
  padding: 12px;
  border-radius: 14px;
}

.item-image {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 14px;
  border: 1px solid #d9f0b9;
}

.item-info {
  flex: 1;
}

.item-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: #333;
}

.item-qty {
  font-size: 0.8rem;
  color: #666;
  margin-top: 2px;
}

.item-price {
  font-weight: 600;
  font-size: 0.95rem;
  color: #6dc007;
}

/* ===== SUMMARY ===== */
.order-summary {
  margin-top: 14px;
  padding-top: 10px;
  border-top: 1px dashed #cde6a5;
  font-size: 0.85rem;
  color: #555;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-summary .total {
  font-weight: 700;
  font-size: 0.95rem;
  color: #6dc007;
  margin-top: 4px;
}

/* ===== EMPTY ===== */
.empty {
  text-align: center;
  font-style: italic;
  color: #888;
  padding: 2.5rem 0;
  font-size: 0.95rem;
}

/* ===== RATE SECTION ===== */
.rate-section {
  text-align: center;
  margin-top: 14px;
  padding-top: 10px;
  font-family: 'Quicksand', sans-serif;
  border-top: 1px dashed #cde6a5;
}

.rate-btn {
  background: #6dc007;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.rate-btn:hover {
  background: #5aa006;
}

</style>
