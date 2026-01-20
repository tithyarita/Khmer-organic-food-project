<template>
  <div class="order-list">
    <div v-if="orders.length === 0" class="empty">{{ emptyText }}</div>

    <div v-for="order in orders" :key="order.id" class="order-card">

      <!-- Order Header -->
      <div class="order-header">
        <div>
          <strong>Order #{{ order.id }}</strong>
          <p class="datetime">{{ formatDate(order.createdAt) }} • {{ formatTime(order.createdAt) }}</p>
        </div>
        <div class="order-total">
          Total: <span class="price">${{ formatPrice(order.total) }}</span>
        </div>
      </div>

      <!-- Items -->
      <div class="order-items">
          <div v-for="item in order.items" :key="item.id" class="order-item">
          <img :src="getItemImage(item)" alt="item.name" class="item-image" />
          <div class="item-info">
            <p class="item-name">{{ item.name }}</p>
            <p class="item-qty">×{{ item.qty }}</p>
          </div>
          <div class="item-price">${{ formatPrice(item.price) }}</div>
          <button
            v-if="order.status === 'completed'"
            class="rate-btn"
            @click="rateItem(item.id)"
          >
            ⭐ Rate
          </button>
        </div>
      </div>

      <!-- Progress Tracker -->
      <div v-if="showProgress" class="progress-tracker">
        <div
          v-for="step in progressSteps"
          :key="step.key"
          :class="['progress-step', { active: isStepActive(order.status, step.key) }]"
        >
          <div class="circle">{{ step.icon }}</div>
          <div class="label">{{ step.label }}</div>
        </div>
      </div>

      <!-- Order Summary -->
      <div class="order-summary">
        <div>Subtotal: ${{ formatPrice(order.subtotal) }}</div>
        <div>Delivery: ${{ formatPrice(order.delivery) }}</div>
        <div>Discount: -${{ formatPrice(order.discount) }}</div>
        <div class="total">Total Paid: ${{ formatPrice(order.total) }}</div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface OrderItem {
  id: number | string
  name?: string
  price: number
  qty: number
  category?: string
  image?: string
}

interface Order {
  id: string
  userId: string
  items: OrderItem[]
  subtotal: number
  delivery: number
  discount: number
  total: number
  paymentMethod?: string
  paymentStatus?: string
  status: string // 'unpaid' | 'paid' | 'preparing' | 'delivering' | 'completed'
  createdAt: Date
}

const props = defineProps<{
  orders: Order[]
  emptyText?: string
  showProgress?: boolean
}>()

const emptyText = props.emptyText || 'No orders available'
const showProgress = props.showProgress || false

// Progress steps
const progressSteps = [
  { key: 'paid', label: 'Paid', icon: '💳' },
  { key: 'preparing', label: 'Preparing', icon: '🥘' },
  { key: 'delivering', label: 'Delivering', icon: '🚚' },
  { key: 'completed', label: 'Completed', icon: '🏁' }
]

// Check if a step is active based on current status
const isStepActive = (status: string, stepKey: string) => {
  const orderStatusRank: Record<string, number> = {
    unpaid: 0,
    paid: 1,
    preparing: 2,
    delivering: 3,
    completed: 4
  }
  return orderStatusRank[status] >= orderStatusRank[stepKey]
}

const rateItem = (itemId: string | number) => {
  router.push(`/rate/${itemId}`)
}

// Utilities
function getItemImage(item: OrderItem) {
  if (item.image) return item.image
  if (item.category === 'vegetables') return '/images/vegBanner.jpeg'
  if (item.category === 'meats') return '/images/meatBanner.jpg'
  if (item.category === 'sets') return '/images/setBanner.png'
  return '/forProfile/profile.png'
}

function formatDate(date: any) {
  if (!date) return '-'
  return new Date(date?.toDate ? date.toDate() : date).toLocaleDateString()
}

function formatTime(date: any) {
  if (!date) return '-'
  return new Date(date?.toDate ? date.toDate() : date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatPrice(v: any) {
  const n = Number(v)
  if (Number.isNaN(n)) return '0.00'
  return n.toFixed(2)
}
</script>

<style scoped>
.order-list {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.order-card {
  background: #fff7f2;
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  border: 1px solid #ffe3d8;
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.datetime { font-size: 0.85rem; color: #888; }
.order-total { font-weight: bold; color: #ff6f61; font-size: 1.1rem; }

.order-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.order-item {
  display: flex;
  align-items: center;
  gap: 15px;
  background: #fff3ea;
  padding: 12px;
  border-radius: 12px;
}
.item-image {
  width: 80px; height: 80px; object-fit: cover; border-radius: 12px; border: 1px solid #ffd8c2;
}
.item-info { flex: 1; }
.item-name { font-weight: 600; color: #333; font-size: 1rem; }
.item-qty { font-size: 0.9rem; color: #555; }
.item-price { font-weight: bold; color: #ff6f61; font-size: 1rem; }

.rate-btn {
  background: #ff6f61;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.3s;
}

.rate-btn:hover {
  background: #e55a50;
}

.order-summary {
  margin-top: 15px;
  font-size: 0.95rem;
  color: #555;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.order-summary .total { font-weight: bold; color: #ff6f61; margin-top: 5px; }

.progress-tracker {
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
  position: relative;
}
.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  text-align: center;
  position: relative;
}
.progress-step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 12px;
  right: -50%;
  width: 100%;
  height: 4px;
  background: #eee;
  z-index: 0;
}
.progress-step.active:not(:last-child)::after {
  background: #ff6f61;
}
.circle {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  font-size: 16px;
}
.progress-step.active .circle {
  background: #ff6f61;
  color: white;
}
.label {
  margin-top: 5px;
  font-size: 0.8rem;
}
.empty {
  text-align: center;
  font-style: italic;
  color: #888;
  padding: 2rem 0;
}
</style>
