<template>
  <div class="orders-page">

    <!-- Page Header -->
    <header class="page-header">
      <h1>🧾 My Orders</h1>
      <p>Manage payments, delivery & order history</p>
    </header>

    <!-- Tabs -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
        <span v-if="tabCount(tab.key)" class="badge">
          {{ tabCount(tab.key) }}
        </span>
      </button>
    </div>

    <!-- Content -->
    <section class="content">

      <!-- PAID -->
      <OrderList
        v-if="activeTab === 'paid'"
        :orders="paidOrders"
        emptyText="No paid orders yet"
        showProgress
      />

      <!-- DELIVERY -->
      <OrderList
        v-if="activeTab === 'delivery'"
        :orders="deliveryOrders"
        emptyText="No orders in delivery"
        showProgress
      />

      <!-- COMPLETED -->
      <OrderList
        v-if="activeTab === 'completed'"
        :orders="completedOrders"
        emptyText="No completed orders yet"
      />

      <!-- HISTORY -->
      <OrderList
        v-if="activeTab === 'history'"
        :orders="orders"
        emptyText="You haven’t placed any orders yet 🥺"
      />

    </section>

    <button class="back-btn" @click="goHome">
      ← Continue Shopping
    </button>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getOrdersByUser, autoUpdateOrderStatuses } from '../services/orderService'
import { auth } from '../firebase'
import OrderList from '../components/OrderList.vue'

const router = useRouter()
const orders = ref<any[]>([])
const loading = ref(true)
const activeTab = ref('paid')

const tabs = [
  { key: 'paid', label: '✅ Paid' },
  { key: 'delivery', label: '🚚 Delivery' },
  { key: 'completed', label: '🏁 Completed' },
  { key: 'history', label: '📦 History' }
]

onMounted(async () => {
  try {
    const user = auth.currentUser
    if (!user) return

    // Auto-update statuses based on time
    await autoUpdateOrderStatuses()

    orders.value = await getOrdersByUser(user.uid)

    orders.value.forEach(order => {
      order.items.forEach(item => {
        if (!item.image) item.image = getItemImage(item)
      })
    })
  } catch (e) {
    console.error('Failed to load orders:', e)
  } finally {
    loading.value = false
  }
})

/* =========================
   Order Filters
   ========================= */

// Paid orders (checkout completed)
const paidOrders = computed(() =>
  orders.value.filter(o =>
    (o.paymentStatus || '').toLowerCase() === 'paid' &&
    ['paid', 'preparing'].includes((o.status || '').toLowerCase())
  )
)

// Orders in delivery
const deliveryOrders = computed(() =>
  orders.value.filter(o =>
    ['delivering', 'out_for_delivery', 'on_the_way']
      .includes((o.status || '').toLowerCase())
  )
)

// Completed orders
const completedOrders = computed(() =>
  orders.value.filter(o =>
    (o.status || '').toLowerCase() === 'completed'
  )
)

const tabCount = (tabKey: string) => {
  switch (tabKey) {
    case 'paid': return paidOrders.value.length
    case 'delivery': return deliveryOrders.value.length
    case 'completed': return completedOrders.value.length
    case 'history': return orders.value.length
    default: return 0
  }
}

function goHome() {
  router.push('/')
}

function getItemImage(item: any) {
  if (item.image) return item.image
  if (item.category === 'vegetables') return '/images/vegBanner.jpeg'
  if (item.category === 'meats') return '/images/meatBanner.jpg'
  if (item.category === 'sets') return '/images/setBanner.png'
  return '/forProfile/profile.png'
}
</script>

<style scoped>
.orders-page {
  min-height: 100vh;
  background: #fff8f0;
  padding-top: 100px;
  font-family: 'Poppins', sans-serif;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}
.page-header h1 { color: #333; margin-bottom: 5px; }
.page-header p { color: #666; font-size: 1rem; }

.tabs {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}
.tabs button {
  padding: 10px 20px;
  border-radius: 25px;
  border: none;
  background: #eee;
  cursor: pointer;
  font-weight: 600;
  position: relative;
  transition: 0.2s;
}
.tabs button:hover { background: #ddd; }
.tabs button.active { background: #ff6f61; color: white; }
.tabs .badge {
  background: #333;
  color: white;
  font-size: 0.75rem;
  padding: 2px 6px;
  border-radius: 12px;
  margin-left: 6px;
}

.content {
  max-width: 1200px;
  margin: auto;
  padding: 0 1rem 3rem;
}

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

.datetime {
  font-size: 0.85rem;
  color: #888;
}

.order-total {
  font-weight: bold;
  color: #ff6f61;
  font-size: 1.1rem;
}

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
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid #ffd8c2;
}

.item-info {
  flex: 1;
}

.item-name {
  font-weight: 600;
  color: #333;
  font-size: 1rem;
}

.item-qty {
  font-size: 0.9rem;
  color: #555;
}

.item-price {
  font-weight: bold;
  color: #ff6f61;
  font-size: 1rem;
}

.order-summary {
  margin-top: 15px;
  font-size: 0.95rem;
  color: #555;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.order-summary .total {
  font-weight: bold;
  color: #ff6f61;
  margin-top: 5px;
}

.back-btn {
  margin-top: 25px;
  width: 100%;
  background: #ff6f61;
  color: white;
  border: none;
  padding: 12px 0;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: 0.2s;
}
.back-btn:hover {
  background: #ff5a48;
}

.empty {
  text-align: center;
  font-style: italic;
  color: #888;
  padding: 2rem 0;
}
</style>
