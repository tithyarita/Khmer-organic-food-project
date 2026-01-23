<template>
  <div class="admin-sales">
    <h2>Admin Sales Dashboard</h2>

    <!-- Date Filter -->
    <div class="date-filter">
      <label>Filter by Date:</label>
      <select v-model="selectedRange" @change="filterOrders">
        <option value="all">All Time</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
        <option value="year">This Year</option>
        <option value="custom">Custom Range</option>
      </select>

      <input
        v-if="selectedRange === 'custom'"
        type="date"
        v-model="customStart"
        @change="filterOrders"
      />
      <input
        v-if="selectedRange === 'custom'"
        type="date"
        v-model="customEnd"
        @change="filterOrders"
      />
    </div>

    <div v-if="loading" class="loading">Loading orders…</div>

    <div v-else>
      <!-- KPI Cards -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-content">
            <h3>Total Sales</h3>
            <p class="stat-value">{{ formatCurrency(filteredTotalSales) }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-content">
            <h3>Orders</h3>
            <p class="stat-value">{{ filteredOrders.length }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">💵</div>
          <div class="stat-content">
            <h3>Avg Order</h3>
            <p class="stat-value">{{ formatCurrency(filteredAvgOrder) }}</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <h3>Customers</h3>
            <p class="stat-value">{{ filteredCustomers.length }}</p>
            <small>Repeat rate: {{ filteredRepeatRate }}%</small>
          </div>
        </div>
      </div>

      <!-- Revenue Trend Chart -->
      <div class="section">
        <h2>Revenue Trend</h2>
        <div class="chart-container">
          <canvas ref="revenueTrendChart"></canvas>
        </div>
      </div>

      <!-- Combined KPI Pie Chart -->
      <div class="section">
        <h2>Combined KPIs</h2>
        <div class="chart-container">
          <canvas ref="combinedChart"></canvas>
        </div>
      </div>

      <!-- Sales by Category -->
      <div class="section">
        <h2>Sales by Category</h2>
        <div class="chart-container">
          <div class="charts-row">
            <div class="chart-col">
              <canvas ref="categoryChart"></canvas>
            </div>
            <div class="chart-col">
              <canvas ref="pieChart"></canvas>
            </div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="c in filteredPieCategories" :key="c.name">
              <td>{{ c.name }}</td>
              <td>{{ formatCurrency(c.revenue) }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Top Products -->
      <div class="section">
        <h2>Top Products</h2>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Units</th>
              <th>Revenue</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in filteredTopProducts" :key="p.id">
              <td>{{ p.name }}</td>
              <td>{{ p.qty }}</td>
              <td>{{ formatCurrency(p.revenue) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { getAllOrders } from '../../services/orderService'
import Chart from 'chart.js/auto'

const orders = ref<any[]>([])
const filteredOrders = ref<any[]>([])
const loading = ref(true)

// Date filter
const selectedRange = ref('today')
const customStart = ref('')
const customEnd = ref('')

// Chart Refs
const combinedChart = ref<HTMLCanvasElement | null>(null)
const categoryChart = ref<HTMLCanvasElement | null>(null)
const pieChart = ref<HTMLCanvasElement | null>(null)
const revenueTrendChart = ref<HTMLCanvasElement | null>(null)

let combinedChartInstance: Chart | null = null
let categoryChartInstance: Chart | null = null
let pieChartInstance: Chart | null = null
let revenueTrendChartInstance: Chart | null = null

/* ---------------- Helpers ---------------- */
const formatCurrency = (n: number) => '$' + n.toFixed(2)

const filterOrders = () => {
  const now = new Date()
  let start: Date | null = null
  let end: Date | null = null

  switch (selectedRange.value) {
    case 'today':
      start = new Date(now.setHours(0, 0, 0, 0))
      end = new Date(now.setHours(23, 59, 59, 999))
      break
    case 'week':
      start = new Date(now)
      start.setDate(now.getDate() - now.getDay())
      start.setHours(0, 0, 0, 0)
      end = new Date()
      break
    case 'month':
      start = new Date(now.getFullYear(), now.getMonth(), 1)
      end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
      break
    case 'year':
      start = new Date(now.getFullYear(), 0, 1)
      end = new Date(now.getFullYear(), 11, 31, 23, 59, 59)
      break
    case 'custom':
      if (customStart.value && customEnd.value) {
        start = new Date(customStart.value)
        end = new Date(customEnd.value)
        end.setHours(23, 59, 59)
      }
      break
    default:
      start = null
      end = null
  }

  filteredOrders.value = orders.value.filter(o => {
    if (!start || !end) return true
    const date = new Date(o.createdAt)
    return date >= start && date <= end
  })

  drawCombinedChart()
  drawCategoryChart()
  drawPieChart()
  drawRevenueTrendChart()
}

/* ---------------- Computed KPIs ---------------- */
const filteredTotalSales = computed(() =>
  filteredOrders.value.reduce((sum, o) => sum + (o.total || 0), 0)
)
const filteredAvgOrder = computed(() =>
  filteredOrders.value.length ? filteredTotalSales.value / filteredOrders.value.length : 0
)
const filteredCustomers = computed(() => {
  const map = new Map()
  filteredOrders.value.forEach(o => map.set(o.user?.email || o.user?.uid || 'guest', true))
  return [...map.keys()]
})
const filteredRepeatRate = computed(() => {
  const counts: any = {}
  filteredOrders.value.forEach(o => {
    const u = o.user?.email || o.user?.uid || 'guest'
    counts[u] = (counts[u] || 0) + 1
  })
  const repeat = Object.values(counts).filter(v => v > 1).length
  return Math.round((repeat / Object.keys(counts).length) * 100)
})
const filteredTopProducts = computed(() => {
  const map: any = {}
  filteredOrders.value.forEach(o => {
    o.items?.forEach((i: any) => {
      map[i.id] ??= { id: i.id, name: i.name, qty: 0, revenue: 0 }
      map[i.id].qty += i.qty
      map[i.id].revenue += i.qty * i.price
    })
  })
  return Object.values(map)
    .sort((a: any, b: any) => b.qty - a.qty)
    .slice(0, 10)
})
const filteredPieCategories = computed(() => {
  const map: any = { Vegetable: 0, Meat: 0, Set: 0 }
  filteredOrders.value.forEach(o => {
    o.items?.forEach((i: any) => {
      const cat = (i.category || '').toLowerCase()
      if (cat.includes('vegetable')) map.Vegetable += i.qty * i.price
      else if (cat.includes('meat')) map.Meat += i.qty * i.price
      else if (cat.includes('set')) map.Set += i.qty * i.price
    })
  })
  return Object.keys(map).map(k => ({ name: k, revenue: map[k] }))
})

/* ---------------- Charts ---------------- */
const drawCombinedChart = () => {
  if (!combinedChart.value) return
  if (combinedChartInstance) combinedChartInstance.destroy()
  const data = [
    { label: 'Total Sales', value: filteredTotalSales.value, color: '#53b400' },
    { label: 'Orders', value: filteredOrders.value.length, color: '#3498db' },
    { label: 'Avg Order', value: filteredAvgOrder.value, color: '#f39c12' },
    { label: 'Customers', value: filteredCustomers.value.length, color: '#9b59b6' }
  ]
  const ctx = combinedChart.value.getContext('2d')
  if (!ctx) return
  combinedChartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: data.map(d => d.label),
      datasets: [{ data: data.map(d => d.value), backgroundColor: data.map(d => d.color) }]
    },
    options: { responsive: true, plugins: { legend: { position: 'right' } } }
  })
}

const drawCategoryChart = () => {
  if (!categoryChart.value) return
  if (categoryChartInstance) categoryChartInstance.destroy()
  const ctx = categoryChart.value.getContext('2d')
  if (!ctx) return
  categoryChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: filteredPieCategories.value.map(c => c.name),
      datasets: [{
        label: 'Revenue',
        data: filteredPieCategories.value.map(c => c.revenue),
        backgroundColor: ['#53b400', '#e74c3c', '#f1c40f'],
        borderRadius: 6
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { callback: (v: any) => '$' + v } } } }
  })
}

const drawPieChart = () => {
  if (!pieChart.value) return
  if (pieChartInstance) pieChartInstance.destroy()
  const ctx = pieChart.value.getContext('2d')
  if (!ctx) return
  pieChartInstance = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: filteredPieCategories.value.map(c => c.name),
      datasets: [{ data: filteredPieCategories.value.map(c => c.revenue), backgroundColor: ['#53b400', '#e74c3c', '#f1c40f'] }]
    },
    options: { responsive: true, plugins: { legend: { position: 'right' } } }
  })
}

// ---------------- Revenue Trend Chart ----------------
const drawRevenueTrendChart = () => {
  if (!revenueTrendChart.value) return
  if (revenueTrendChartInstance) revenueTrendChartInstance.destroy()
  const ctx = revenueTrendChart.value.getContext('2d')
  if (!ctx) return

  // Prepare data grouped by day/week/month
  const groupMap: Record<string, number> = {}
  filteredOrders.value.forEach(o => {
    const date = new Date(o.createdAt)
    let label = ''
    if (selectedRange.value === 'week' || selectedRange.value === 'today') {
      label = date.toLocaleDateString()
    } else if (selectedRange.value === 'month') {
      label = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`
    } else if (selectedRange.value === 'year') {
      label = `${date.getFullYear()}-${date.getMonth()+1}`
    } else {
      label = date.toLocaleDateString()
    }
    groupMap[label] = (groupMap[label] || 0) + (o.total || 0)
  })

  const sortedLabels = Object.keys(groupMap).sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
  const data = sortedLabels.map(l => groupMap[l])

  revenueTrendChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: sortedLabels,
      datasets: [{
        label: 'Revenue',
        data,
        fill: true,
        borderColor: '#27ae60',
        backgroundColor: 'rgba(39, 174, 96, 0.2)',
        tension: 0.3
      }]
    },
    options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { callback: (v: any) => '$' + v } } } }
  })
}

/* ---------------- Fetch Orders ---------------- */
onMounted(async () => {
  orders.value = await getAllOrders()
  loading.value = false
  filterOrders()
  await nextTick()
})
</script>

<style scoped>
.admin-sales { padding: 30px; background: #f9f9f9; border-radius: 8px; }
h2 { margin-bottom: 20px; }
.date-filter { margin-bottom: 20px; display:flex; gap:10px; align-items:center; }
.stats-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:20px; margin-bottom:40px; }
.stat-card { background:white; border-radius:12px; padding:20px; display:flex; align-items:center; box-shadow:0 4px 12px rgba(0,0,0,0.05); }
.stat-icon { font-size:32px; margin-right:15px; }
.stat-content h3 { margin:0 0 5px; font-size:16px; color:#2c3e50; }
.stat-value { font-size:20px; font-weight:bold; color:#53b400; }
.section { margin-top:40px; }
.chart-container { width:100%; height:300px; margin-bottom:20px; gap: 40px; margin-left: 40px; }
.charts-row { display:flex; gap:20px; }
.chart-col { width: 500px; margin-left: 20px;}
table { width:100%; border-collapse:collapse; background:white; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05); margin-top:20px; }
th,td{padding:15px;text-align:left;border-bottom:1px solid #ecf0f1;}
th{background:#f5f5f5;font-weight:600;}
tr:hover{background:#f9f9f9;}
.loading{text-align:center;padding:40px 0;font-size:1.2rem;color:#666;}
</style>
