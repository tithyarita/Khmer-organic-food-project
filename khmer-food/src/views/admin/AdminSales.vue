<template>
  <div class="admin-sales">
    <div v-if="loading" class="loading">Loading orders…</div>
    <div v-else>
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <h3>Total Sales</h3>
            <p class="stat-value">{{ formatCurrency(totalSales) }}</p>
            <span class="stat-change positive">{{ salesChangeText }}</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <h3>Orders Count</h3>
            <p class="stat-value">{{ ordersCount }}</p>
            <span class="stat-change positive">{{ ordersChangeText }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💵</div>
          <div class="stat-content">
            <h3>Avg Order Value</h3>
            <p class="stat-value">{{ formatCurrency(avgOrderValue) }}</p>
            <span class="stat-change positive">{{ avgChangeText }}</span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>Unique Customers</h3>
            <p class="stat-value">{{ ordersByUser.length }}</p>
            <span class="stat-change positive">Repeat rate: {{ repeatRate }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Sales by Category -->
    <div class="sales-section">
      <h2>Sales by Category</h2>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Units Sold</th>
            <th>Revenue</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cat in salesByCategory" :key="cat.category">
            <td>{{ cat.category }}</td>
            <td>{{ cat.units }}</td>
            <td>{{ formatCurrency(cat.revenue) }}</td>
            <td>{{ ((cat.revenue / (totalSales || 1)) * 100).toFixed(1) }}%</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Top Products -->
    <div class="sales-section">
      <h2>Top Products</h2>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Units Sold</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in topProducts" :key="p.id">
            <td>{{ p.name }}</td>
            <td>{{ p.qty }}</td>
            <td>{{ formatCurrency(p.revenue) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Orders by User -->
    <!-- <div class="sales-section">
      <h2>Customer Order History</h2>
      <div v-if="ordersByUser.length === 0">No orders yet.</div>
      <div v-for="u in ordersByUser" :key="u.user.uid || u.user.email || u.user" class="user-card">
        <div class="user-header">
          <div>
            <strong>{{ u.user.name || u.user.email || 'Guest' }}</strong>
            <div class="muted">{{ u.user.uid ? ('UID: ' + u.user.uid) : '' }}</div>
          </div>
          <div class="user-stats">Orders: {{ u.orders.length }} — {{ formatCurrency(u.orders.reduce((s,o)=>s+(o.total||0),0)) }}</div>
        </div>
        <table class="user-orders">
          <thead>
            <tr><th>Order ID</th><th>Date</th><th>Items</th><th>Total</th></tr>
          </thead>
          <tbody>
            <tr v-for="o in u.orders" :key="o.id">
              <td>{{ o.id }}</td>
              <td>{{ (o.createdAt && new Date(o.createdAt)).toLocaleString() }}</td>
              <td>
                <div v-for="it in o.items" :key="it.id">{{ it.name }} x{{ it.qty }}</div>
              </td>
              <td>{{ formatCurrency(o.total || 0) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div> -->
  </div>
</template>

<script setup lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, onMounted, computed } from 'vue'
import { getAllOrders } from '../../services/orderService'

const orders = ref<any[]>([])
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
  try {
    orders.value = await getAllOrders()
  } catch (e) {
    console.error('Failed to load orders', e)
    error.value = e
  } finally {
    loading.value = false
  }
})

const totalSales = computed(() => orders.value.reduce((s, o) => s + (o.total || 0), 0))
const ordersCount = computed(() => orders.value.length)
const avgOrderValue = computed(() => (ordersCount.value ? totalSales.value / ordersCount.value : 0))

const topProducts = computed(() => {
  const map = new Map<string, any>()
  orders.value.forEach((o: any) => {
    ;(o.items || []).forEach((it: any) => {
      const key = `${it.id}:${it.name || ''}`
      const existing = map.get(key) || { id: it.id, name: it.name || 'Unknown', qty: 0, revenue: 0 }
      existing.qty += it.qty
      existing.revenue += (it.price || 0) * it.qty
      map.set(key, existing)
    })
  })
  return Array.from(map.values()).sort((a: any, b: any) => b.qty - a.qty).slice(0, 10)
})

const salesByCategory = computed(() => {
  const map: Record<string, { units: number; revenue: number }> = {}
  orders.value.forEach((o: any) => {
    ;(o.items || []).forEach((it: any) => {
      const cat = it.category || 'Uncategorized'
      if (!map[cat]) map[cat] = { units: 0, revenue: 0 }
      map[cat].units += it.qty
      map[cat].revenue += (it.price || 0) * it.qty
    })
  })
  return Object.entries(map).map(([category, v]) => ({ category, units: v.units, revenue: v.revenue }))
})

const ordersByUser = computed(() => {
  const map: Record<string, any> = {}
  orders.value.forEach((o: any) => {
    const uid = (o.user && (o.user.uid || o.user.email)) || 'guest'
    if (!map[uid]) map[uid] = { user: o.user || { uid }, orders: [] }
    map[uid].orders.push(o)
  })
  return Object.values(map)
})

// Simple additional metrics
const repeatRate = computed(() => {
  const users = ordersByUser.value
  if (!users.length) return 0
  const repeat = users.filter((u:any) => u.orders.length > 1).length
  return Math.round((repeat / users.length) * 100)
})

const salesChangeText = '—'
const ordersChangeText = '—'
const avgChangeText = '—'

function formatCurrency(n: number) {
  return '$' + n.toFixed(2)
}

// (no unused helpers)
</script>

<style scoped>
.admin-sales {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
  padding: 25px;
  border-radius: 8px;
  display: flex;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 40px;
}

.stat-content {
  flex: 1;
}

.stat-content h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 14px;
  text-transform: uppercase;
  font-weight: 600;
}

.stat-value {
  margin: 0 0 8px 0;
  color: #53b400;
  font-size: 28px;
  font-weight: bold;
}

.stat-change {
  font-size: 12px;
  font-weight: 600;
}

.stat-change.positive {
  color: #27ae60;
}

.stat-change.negative {
  color: #e74c3c;
}

.sales-section {
  margin-bottom: 40px;
}

.sales-section h2 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 20px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 15px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background-color: #f5f5f5;
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e0e0e0;
}

td {
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
}

tr:hover {
  background-color: #f9f9f9;
}

.trend {
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 12px;
}

.trend.up {
  background-color: #d4edda;
  color: #155724;
}

.trend.down {
  background-color: #f8d7da;
  color: #721c24;
}
</style>
