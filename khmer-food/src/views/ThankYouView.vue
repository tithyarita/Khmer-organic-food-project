<template>
  <div class="thankyou-page">
    <div class="container">
      <div class="thankyou-header">
        <div class="check-icon">✓</div>
        <h1>Thank You for Your Order!</h1>
        <p>Your payment has been processed successfully.</p>
        <p>Order ID: {{ orderId }}</p>
      </div>

      <div class="order-summary">
        <h2>Order Summary</h2>
        <div v-if="order" class="summary-details">
          <p><strong>Total:</strong> ${{ order.total?.toFixed(2) }}</p>
          <p><strong>Items:</strong></p>
          <ul>
            <li v-for="item in order.items" :key="item.id">
              {{ item.name }} (Qty: {{ item.qty }}) - ${{ item.price?.toFixed(2) }}
              <button class="rate-btn" @click="goToRating(item)">Rate This Item</button>
            </li>
          </ul>
        </div>
        <div v-else>
          <p>Loading order details...</p>
        </div>
      </div>

      <div class="actions">
        <button class="btn-primary" @click="goHome">Continue Shopping</button>
        <button class="btn-secondary" @click="goToOrders">View My Orders</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOrderById } from '../services/orderService'

const route = useRoute()
const router = useRouter()

const orderId = route.params.orderId as string
const order = ref<any>(null)

onMounted(async () => {
  if (orderId) {
    try {
      order.value = await getOrderById(orderId)
    } catch (e) {
      console.error('Failed to load order:', e)
    }
  }
})

function goToRating(item: any) {
  // Assuming a rating page for each item, e.g., /rate/:itemId
  router.push(`/rate/${item.id}`)
}

function goHome() {
  router.push('/')
}

function goToOrders() {
  // Assuming there's an orders page, or redirect to profile
  router.push('/profile')
}
</script>

<style scoped>
.thankyou-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9f9f9;
  padding: 2rem;
}

.container {
  max-width: 800px;
  background: white;
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  text-align: center;
}

.thankyou-header {
  margin-bottom: 2rem;
}

.check-icon {
  font-size: 4rem;
  color: #4caf50;
  margin-bottom: 1rem;
}

h1 {
  color: #333;
  margin-bottom: 0.5rem;
}

p {
  color: #666;
  margin-bottom: 0.5rem;
}

.order-summary {
  margin-bottom: 2rem;
  text-align: left;
}

.summary-details ul {
  list-style: none;
  padding: 0;
}

.summary-details li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.rate-btn {
  background: #ff9800;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
}

.rate-btn:hover {
  background: #e68900;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-primary {
  background: #4caf50;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-primary:hover {
  background: #45a049;
}

.btn-secondary {
  background: #ccc;
  color: #333;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}

.btn-secondary:hover {
  background: #bbb;
}
</style>
