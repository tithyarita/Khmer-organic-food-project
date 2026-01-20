<template>
  <div class="delivery-page">
    <div class="delivery-container">

      <h1>🚚 Delivery Orders</h1>
      <p class="subtitle">Track your orders in delivery</p>
      <div v-if="totalDelivering > 0" class="summary">
        📦 You have {{ totalDelivering }} order(s) in delivery
      </div>

      <div v-if="loading" class="loading">Loading delivery info...</div>

      <div v-else-if="orders.length === 0" class="empty">
        No orders in delivery 🚚
      </div>

      <div v-else class="orders-list">
        <div
          v-for="order in orders"
          :key="order.id"
          class="delivery-card"
        >
          <!-- Status -->
          <div class="status-box">
            <span class="status">{{ order.status }}</span>
            <p>Order #{{ order.id.slice(-8) }}</p>
          </div>

          <!-- Items -->
          <div class="section">
            <h3>🛒 Items</h3>
            <div class="items">
              <div v-for="item in order.items" :key="item.id" class="item">
                <img :src="getItemImage(item)" />
                <div class="info">
                  <p class="name">{{ item.name }}</p>
                  <span>×{{ item.qty }}</span>
                </div>
                <div class="price">${{ item.price?.toFixed(2) }}</div>
              </div>
            </div>
          </div>

          <!-- Total -->
          <div class="total">
            Total: ${{ order.total.toFixed(2) }}
          </div>

          <button class="view-btn" @click="viewOrder(order.id)">View Details</button>
        </div>
      </div>

      <button class="back-btn" @click="$router.push('/orders-center')">
        ← Back to Orders Center
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getOrdersByUser } from '../services/orderService'
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
const orders = ref<Order[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const user = auth.currentUser
    if (!user) return

    const allOrders = await getOrdersByUser(user.uid)
    orders.value = allOrders.filter(o => o.status === 'delivering')
  } catch (e) {
    console.error('Failed to load orders:', e)
  } finally {
    loading.value = false
  }
})

const totalDelivering = computed(() =>
  orders.value.length
)

function getItemImage(item: OrderItem) {
  if (item.image) return item.image
  if (item.category === 'vegetables') return '/images/vegBanner.jpeg'
  if (item.category === 'meats') return '/images/meatBanner.jpg'
  if (item.category === 'sets') return '/images/setBanner.png'
  return '/forProfile/profile.png'
}

const viewOrder = (orderId: string) => {
  router.push(`/order/${orderId}`)
}
</script>

<style scoped>
.delivery-page {
  background: #fff8f0;
  min-height: 100vh;
  padding: 2rem;
  font-family: Poppins, sans-serif;
}

.delivery-container {
  max-width: 900px;
  margin: auto;
}

.subtitle {
  color: #666;
  margin-bottom: 20px;
}

.delivery-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0,0,0,.08);
}

.status-box {
  text-align: center;
  margin-bottom: 25px;
}

.status {
  background: #6ec007;
  color: white;
  padding: 6px 20px;
  border-radius: 20px;
  font-weight: bold;
}

.section {
  margin-bottom: 20px;
}

.items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item {
  display: flex;
  align-items: center;
  gap: 15px;
  background: #fff3ea;
  padding: 12px;
  border-radius: 12px;
}

.item img {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 10px;
}

.info {
  flex: 1;
}

.name {
  font-weight: 600;
}

.price {
  font-weight: bold;
  color: #ff6f61;
}

.total {
  text-align: right;
  font-size: 1.2rem;
  font-weight: bold;
  color: #ff6f61;
  margin-top: 15px;
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 1.1rem;
}

.summary {
  background: #e8f5e8;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: bold;
}

.view-btn {
  display: block;
  margin: 1rem auto 0;
  padding: 0.5rem 1rem;
  background: #ff6f61;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.view-btn:hover {
  background: #e55a50;
}

.back-btn {
  margin-top: 25px;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 12px;
  background: #ff6f61;
  color: white;
  cursor: pointer;
}
</style>
