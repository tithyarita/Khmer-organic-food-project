<template>
  <div class="order-view">
    <div class="order-container">
      <!-- Header -->
      <div class="order-header">
        <h1>📦 Order Details</h1>
        <p>Order #{{ order?.id }}</p>
      </div>

      <!-- Loading & Error States -->
      <div v-if="loading" class="loading">Loading order details...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else-if="!order" class="error">Order not found</div>

      <!-- Order Details -->
      <div v-else class="order-details">
        <div class="order-info">
          <div class="info-row">
            <span>Date:</span>
            <span>{{ formatDate(order.createdAt) }}</span>
          </div>
          <div class="info-row">
            <span>Time:</span>
            <span>{{ formatTime(order.createdAt) }}</span>
          </div>
          <div class="info-row">
            <span>Status:</span>
            <span :class="order.status">{{ order.status }}</span>
          </div>
          <div class="info-row">
            <span>Payment Status:</span>
            <span :class="order.paymentStatus">{{ order.paymentStatus || 'N/A' }}</span>
          </div>
        </div>

        <!-- Items -->
        <div class="order-items">
          <h3>Items</h3>
          <div
            class="order-item"
            v-for="item in order.items"
            :key="item.id"
          >
            <img
              :src="getItemImage(item)"
              alt="item.name"
              class="item-image"
            />
            <div class="item-info">
              <p class="item-name">{{ item.name }}</p>
              <p class="item-qty">Quantity: {{ item.qty }}</p>
              <p class="item-price">${{ item.price?.toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="order-summary">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>${{ order.subtotal?.toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span>Delivery:</span>
            <span>${{ order.delivery?.toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span>Discount:</span>
            <span>-${{ order.discount?.toFixed(2) }}</span>
          </div>
          <div class="summary-row total">
            <span>Total:</span>
            <span>${{ order.total?.toFixed(2) }}</span>
          </div>
        </div>
      </div>

      <button class="back-btn" @click="goBack">← Back to Orders</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getOrderById } from '../services/orderService'
import { auth } from '../firebase'

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
  status: string
  createdAt: Date
}

const router = useRouter()
const route = useRoute()

const order = ref<Order | null>(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const user = auth.currentUser
    if (!user) {
      error.value = 'Please login to view orders'
      return
    }

    const orderId = route.params.id as string
    if (!orderId) {
      error.value = 'Order ID is required'
      return
    }

    order.value = await getOrderById(orderId)

    if (!order.value || order.value.userId !== user.uid) {
      error.value = 'Order not found or access denied'
      return
    }

    // Ensure items have images
    order.value.items.forEach((item: OrderItem) => {
      if (!item.image) item.image = getItemImage(item)
    })
  } catch (e) {
    console.error('Failed to load order:', e)
    error.value = 'Failed to load order details'
  } finally {
    loading.value = false
  }
})

const formatDate = (date: Date) => {
  return date.toLocaleDateString()
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString()
}

const getItemImage = (item: OrderItem) => {
  // Placeholder for image logic
  return item.image || '/images/placeholder.png'
}

const goBack = () => {
  router.push('/orders-center')
}
</script>

<style scoped>
.order-view {
  max-width: 800px;
  margin: auto;
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
}

.order-container {
  background: #fff;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.order-header {
  text-align: center;
  margin-bottom: 2rem;
}

.order-info {
  margin-bottom: 2rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.order-items {
  margin-bottom: 2rem;
}

.order-items h3 {
  margin-bottom: 1rem;
}

.order-item {
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 1rem;
}

.item-info {
  flex: 1;
}

.item-name {
  font-weight: bold;
  margin: 0;
}

.item-qty, .item-price {
  margin: 0.25rem 0;
  color: #666;
}

.order-summary {
  border-top: 2px solid #eee;
  padding-top: 1rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
}

.summary-row.total {
  font-weight: bold;
  font-size: 1.2rem;
  border-top: 1px solid #eee;
}

.back-btn {
  display: block;
  margin: 0 auto 40px; /* center horizontally */
  width: 260px;       /* fixed nice width */
  background: #6dc007;
  color: white;
  border: none;
  padding: 14px 0;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  text-align: center;
}

.back-btn:hover {
  background: #e55a50;
}

.loading, .error {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.error {
  color: #d9534f;
}

.info-row span:last-child {
  font-weight: bold;
}

.info-row span.pending {
  color: #856404;
  background: #fff3cd;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.info-row span.paid {
  color: #155724;
  background: #d4edda;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.info-row span.unpaid {
  color: #721c24;
  background: #f8d7da;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.info-row span.preparing, .info-row span.delivering, .info-row span.completed {
  color: #0c5460;
  background: #d1ecf1;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}
</style>
