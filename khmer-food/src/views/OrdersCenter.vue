<template>
  <div class="orders-page">

    <!-- Header -->
    <header class="page-header">
      <h1>🧾 My Orders</h1>
      <p>Track your order progress</p>
    </header>

    <!-- Progress Steps -->
    <div class="progress-steps">
      <div
        v-for="step in steps"
        :key="step.key"
        :class="['step', { active: activeTab === step.key }]"
        @click="activeTab = step.key"
      >
        <div class="circle">{{ step.icon }}</div>
        <span>{{ step.label }}</span>
      </div>
    </div>
    <!-- Loading -->
<div v-if="loading" class="loading-wrapper">
  <div class="loading-card">
    <div class="spinner"></div>
    <h3>Loading your orders…</h3>
    <p>Please wait, we’re getting things ready 🥬🥩</p>
  </div>
</div>


    <!-- Content -->
    <section v-else class="content">

      <OrderList
        v-if="activeTab === 'paid'"
        :orders="paidOrders"
        emptyText="No paid orders yet"
      />

      <OrderList
        v-if="activeTab === 'preparing'"
        :orders="preparingOrders"
        emptyText="No orders being prepared"
      />

      <OrderList
        v-if="activeTab === 'delivery'"
        :orders="deliveryOrders"
        emptyText="No orders in delivery"
      />

      <OrderList
        v-if="activeTab === 'completed'"
        :orders="completedOrders"
        emptyText="No completed orders"
      />

      <OrderList
        v-if="activeTab === 'rating'"
        :orders="ratingOrders"
        emptyText="No orders to rate"
      />

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
import { auth } from '../firebase'
import { getOrdersByUser, autoUpdateOrderStatuses } from '../services/orderService'
import OrderList from '../components/OrderList.vue'

const router = useRouter()
const orders = ref<any[]>([])
const activeTab = ref('paid')
const loading = ref(true)

onMounted(async () => {
  const user = auth.currentUser
  if (!user) return

  loading.value = true
  await autoUpdateOrderStatuses()
  orders.value = await getOrdersByUser(user.uid)
  loading.value = false
})


/* =====================
   STEPS
   ===================== */

const steps = [
  { key: 'paid', label: 'Paid', icon: '💳' },
  { key: 'preparing', label: 'Preparing', icon: '🥘' },
  { key: 'delivery', label: 'Delivery', icon: '🚚' },
  { key: 'completed', label: 'Completed', icon: '🏁' },
  { key: 'rating', label: 'Rating', icon: '⭐' },
  { key: 'history', label: 'History', icon: '📦' }
]

onMounted(async () => {
  const user = auth.currentUser
  if (!user) return

  await autoUpdateOrderStatuses()
  orders.value = await getOrdersByUser(user.uid)
})

/* =====================
   PROGRESS LOGIC
   ===================== */

// PAID (payment done, not started)
const paidOrders = computed(() =>
  orders.value.filter(o =>
    (o.paymentStatus || '').toLowerCase() === 'paid' &&
    (o.status || '').toLowerCase() === 'paid'
  )
)

// PREPARING
const preparingOrders = computed(() =>
  orders.value.filter(o =>
    (o.status || '').toLowerCase() === 'preparing'
  )
)

// DELIVERY
const deliveryOrders = computed(() =>
  orders.value.filter(o =>
    ['delivering', 'out_for_delivery', 'on_the_way']
      .includes((o.status || '').toLowerCase())
  )
)

// COMPLETED (delivered but NOT rated)
const completedOrders = computed(() =>
  orders.value.filter(o =>
    (o.status || '').toLowerCase() === 'completed' &&
    !o.rated
  )
)

// RATING (completed & rated)
const ratingOrders = computed(() =>
  orders.value.filter(o =>
    (o.status || '').toLowerCase() === 'completed' &&
    o.rated === true
  )
)

const goHome = () => router.push('/')
</script>


<style scoped>
.orders-page {
  min-height: 100vh;
  padding-top: 100px;
  font-family: 'Poppins', sans-serif;
}

/* Header */
.page-header {
  text-align: center;
  margin-bottom: 30px;
}

/* Progress Steps */
.progress-steps {
  display: flex;
  justify-content: space-between;
  max-width: 900px;
  margin: 0 auto 40px;
  padding: 0 20px;
}

.step {
  flex: 1;
  text-align: center;
  cursor: pointer;
  position: relative;
}

.step::after {
  content: '';
  position: absolute;
  top: 16px;
  right: -50%;
  width: 100%;
  height: 4px;
  background: #ddd;
}

.step:last-child::after {
  display: none;
}

.step.active::after {
  background: #6dc007;
}

.circle {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: #ddd;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.step.active .circle {
  background: #6dc007;
  color: white;
}

.step span {
  display: block;
  margin-top: 6px;
  font-size: 0.85rem;
  font-weight: 600;
}

/* Content */
.content {
  max-width: 1200px;
  margin: auto;
  padding: 0 1rem 3rem;
}

/* Back Button */
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
/* Loading */
.loading-wrapper {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-card {
  background: white;
  padding: 40px 30px;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  animation: fadeIn 0.4s ease;
}

.loading-card h3 {
  margin: 20px 0 6px;
  font-size: 1.2rem;
}

.loading-card p {
  color: #666;
  font-size: 0.9rem;
}

/* Spinner */
.spinner {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 5px solid #e6e6e6;
  border-top-color: #6dc007;
  animation: spin 1s linear infinite;
  margin: auto;
}

/* Animations */
@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}


</style>
