<template>
  <div class="receipt-page">
    <div class="receipt">

      <!-- Receipt Header -->
      <div class="receipt-header">
        <h1>🧾 Fresh Market</h1>
        <p class="subtitle">Vegetables & Meat Shop</p>
        <div class="success">✔ PAYMENT SUCCESSFUL</div>
      </div>

      <!-- Receipt Info -->
      <div class="receipt-info">
        <div>
          <span>Order ID</span>
          <span>{{ orderId }}</span>
        </div>
        <div>
          <span>Date</span>
          <span>{{ orderDate }}</span>
        </div>
        <div>
          <span>Time</span>
          <span>{{ orderTime }}</span>
        </div>
      </div>

      <div class="divider"></div>

      <!-- Items -->
      <div v-if="order" class="receipt-items">
        <div class="item-header">
          <span>Item</span>
          <span>Qty</span>
          <span>Price</span>
        </div>

        <div
          class="item-row"
          v-for="item in order.items"
          :key="item.id"
        >
          <span>{{ item.name }}</span>
          <span>x{{ item.qty }}</span>
          <span>${{ item.price?.toFixed(2) }}</span>
        </div>
      </div>

      <div v-else class="loading">
        Loading receipt...
      </div>

      <div class="divider"></div>

      <!-- Totals -->
      <div v-if="order" class="totals">
        <div>
          <span>Subtotal</span>
          <span>${{ order.subtotal?.toFixed(2) }}</span>
        </div>
        <div>
          <span>Delivery</span>
          <span>${{ order.delivery?.toFixed(2) }}</span>
        </div>
        <div>
          <span>Discount</span>
          <span>- ${{ order.discount?.toFixed(2) }}</span>
        </div>
        <div class="total">
          <span>Total Paid</span>
          <span>${{ order.total?.toFixed(2) }}</span>
        </div>
      </div>

      <div class="divider dashed"></div>

      <!-- Footer -->
      <div class="receipt-footer">
        <p>Thank you for shopping with us 🥬🥩</p>
        <p class="small">Fresh food • Fast delivery • Fair price</p>
      </div>

      <!-- Actions -->
      <div class="actions">
        <button @click="goHome">Continue Shopping</button>
        <button class="secondary" @click="goToOrders">My Orders</button>
      </div>

    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOrderById } from '../services/orderService'

const route = useRoute()
const router = useRouter()

const orderId = route.params.orderId as string
const order = ref<any>(null)

onMounted(async () => {
  if (orderId) {
    order.value = await getOrderById(orderId)
  }
})

const orderDate = computed(() => {
  if (!order.value?.createdAt) return '-'
  return new Date(order.value.createdAt).toLocaleDateString()
})

const orderTime = computed(() => {
  if (!order.value?.createdAt) return '-'
  return new Date(order.value.createdAt).toLocaleTimeString()
})

function goHome() {
  router.push('/')
}

function goToOrders() {
  router.push('/orders')
}
</script>
<style scoped>
  .receipt-page {
  min-height: 100vh;
  background: #f3f3f3;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  font-family: 'Courier New', monospace;
}

.receipt {
  width: 380px;
  background: #fff;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,.15);
}

.receipt-header {
  text-align: center;
}

.receipt-header h1 {
  margin: 0;
  font-size: 1.6rem;
}

.subtitle {
  font-size: 0.8rem;
  color: #777;
}

.success {
  margin-top: 0.6rem;
  color: #4caf50;
  font-weight: bold;
}

.receipt-info div,
.totals div {
  display: flex;
  justify-content: space-between;
  margin: 0.4rem 0;
  font-size: 0.85rem;
}

.divider {
  border-top: 1px solid #ddd;
  margin: 1rem 0;
}

.divider.dashed {
  border-top: 1px dashed #bbb;
}

.item-header,
.item-row {
  display: grid;
  grid-template-columns: 1fr 40px 70px;
  font-size: 0.85rem;
  margin-bottom: 0.4rem;
}

.item-header {
  font-weight: bold;
  border-bottom: 1px dashed #ccc;
  padding-bottom: 0.3rem;
}

.item-row span:last-child {
  text-align: right;
}

.totals {
  font-size: 0.85rem;
}

.total {
  font-weight: bold;
  font-size: 1rem;
}

.receipt-footer {
  text-align: center;
  font-size: 0.8rem;
  color: #555;
}

.small {
  font-size: 0.7rem;
  color: #888;
}

.actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.actions button {
  flex: 1;
  padding: 0.6rem;
  border: none;
  border-radius: 6px;
  background: #4caf50;
  color: white;
  cursor: pointer;
}

.actions button.secondary {
  background: #ccc;
  color: #333;
}
.actions button:hover {
  opacity: 0.9;
}
</style>
