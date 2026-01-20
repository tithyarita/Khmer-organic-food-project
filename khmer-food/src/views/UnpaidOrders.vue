<template>
  <div class="orders-page">
    <div class="orders-container">

      <!-- Header -->
      <div class="orders-header">
        <h1>💳 Unpaid Orders</h1>
        <p class="subtitle">Orders awaiting card-to-card payment</p>
        <div v-if="orders.length > 0" class="total-summary">
          💰 Total Pending: <span>${{ totalPending.toFixed(2) }}</span>
        </div>
      </div>

      <!-- Loading & Empty States -->
      <div v-if="loading" class="loading">Loading your unpaid orders...</div>
      <div v-else-if="orders.length === 0" class="empty">
        You don’t have any unpaid orders 🎉
      </div>

      <!-- Orders List -->
      <div v-else class="order-list">
        <div
          class="order-card"
          v-for="order in orders"
          :key="order.id"
        >
          <div class="order-header">
            <div>
              <strong>Order #{{ order.id }}</strong>
              <p class="datetime">{{ formatDate(order.createdAt) }} • {{ formatTime(order.createdAt) }}</p>
            </div>
            <div class="order-total">
              Pending: <span class="price">${{ order.total.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Items -->
          <div class="order-items">
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
                <p class="item-qty">×{{ item.qty }}</p>
              </div>
              <div class="item-price">${{ item.price.toFixed(2) }}</div>
            </div>
          </div>

          <!-- Summary -->
          <div class="order-summary">
            <div>Subtotal: ${{ order.subtotal.toFixed(2) }}</div>
            <div>Delivery: ${{ order.delivery.toFixed(2) }}</div>
            <div>Discount: -${{ order.discount.toFixed(2) }}</div>
            <div class="total">Total Pending: ${{ order.total.toFixed(2) }}</div>
          </div>

          <!-- Payment Button -->
          <button class="pay-btn" @click="payOrder(order.id)">
            Proceed to Payment
          </button>
        </div>
      </div>

      <button class="back-btn" @click="goHome">← Continue Shopping</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getOrdersByUser } from '../services/orderService'
import { auth } from '../firebase'

const router = useRouter()
const orders = ref<any[]>([])
const loading = ref(true)

// Load unpaid orders
onMounted(async () => {
  try {
    const user = auth.currentUser
    if (!user) return

    let allOrders = await getOrdersByUser(user.uid)
    // Filter for unpaid orders with card-to-card payment
    orders.value = allOrders.filter(
      o => o.paymentStatus === 'unpaid' && o.paymentMethod === 'card-to-card'
    )

    orders.value.forEach(order => {
      order.items.forEach(item => {
        if (!item.image) item.image = getItemImage(item)
      })
    })
  } catch (e) {
    console.error('Failed to load unpaid orders:', e)
  } finally {
    loading.value = false
  }
})

const totalPending = computed(() =>
  orders.value.reduce((sum, order) => sum + (order.total || 0), 0)
)

function goHome() {
  router.push('/')
}

function payOrder(orderId: string) {
  // Redirect to your payment page
  router.push(`/payment/${orderId}`)
}

function getItemImage(item: any) {
  if (item.image) return item.image
  if (item.category === 'vegetables') return '/images/vegBanner.jpeg'
  if (item.category === 'meats') return '/images/meatBanner.jpg'
  if (item.category === 'sets') return '/images/setBanner.png'
  return '/forProfile/profile.png'
}

function formatDate(date: any) {
  if (!date) return '-'
  return new Date(date.toDate ? date.toDate() : date).toLocaleDateString()
}

function formatTime(date: any) {
  if (!date) return '-'
  return new Date(date.toDate ? date.toDate() : date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
}
</script>

<style scoped>
.orders-page { min-height: 100vh; background: #fff8f0; font-family: 'Poppins', sans-serif; padding: 2rem; }
.orders-container { max-width: 1200px; margin: auto; }
.orders-header { text-align: center; margin-bottom: 30px; }
.orders-header h1 { color: #ff6f61; margin-bottom: 5px; }
.subtitle { color: #555; font-size: 1rem; margin-bottom: 10px; }
.total-summary { font-size: 1.2rem; font-weight: bold; color: #ff6f61; }

.loading, .empty { text-align: center; font-style: italic; color: #888; padding: 2rem 0; }

.order-list { display: flex; flex-direction: column; gap: 25px; }
.order-card { background: #fff7f2; border-radius: 15px; padding: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #ffe3d8; }
.order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.datetime { font-size: 0.85rem; color: #888; }
.order-total { font-weight: bold; color: #ff6f61; font-size: 1.1rem; }

.order-items { display: flex; flex-direction: column; gap: 12px; }
.order-item { display: flex; align-items: center; gap: 15px; background: #fff3ea; padding: 12px; border-radius: 12px; }
.item-image { width: 80px; height: 80px; object-fit: cover; border-radius: 12px; border: 1px solid #ffd8c2; }
.item-info { flex: 1; }
.item-name { font-weight: 600; color: #333; font-size: 1rem; }
.item-qty { font-size: 0.9rem; color: #555; }
.item-price { font-weight: bold; color: #ff6f61; font-size: 1rem; }

.order-summary { margin-top: 15px; font-size: 0.95rem; color: #555; display: flex; flex-direction: column; gap: 4px; }
.order-summary .total { font-weight: bold; color: #ff6f61; margin-top: 5px; }

.pay-btn { margin-top: 10px; width: 100%; background: #ff6f61; color: white; border: none; padding: 12px 0; border-radius: 12px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: 0.2s; }
.pay-btn:hover { background: #ff5a48; }

.back-btn { margin-top: 25px; width: 100%; background: #eee; color: #333; border: none; padding: 12px 0; border-radius: 12px; font-weight: 600; font-size: 1rem; cursor: pointer; transition: 0.2s; }
.back-btn:hover { background: #ddd; }
</style>
