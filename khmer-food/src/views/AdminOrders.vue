<template>
  <div class="customer-dashboard">
    <h2>Customer Dashboard</h2>

    <!-- Summary Cards -->
    <div class="summary-cards">
      <div class="card">
        <h3>Total Customers</h3>
        <p>{{ customers.length }}</p>
      </div>
      <div class="card">
        <h3>Total Orders</h3>
        <p>{{ orders.length }}</p>
      </div>
      <div class="card">
        <h3>Total Revenue</h3>
        <p>{{ formatCurrency(totalRevenue) }}</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters">
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

      <div class="search-filter">
        <input type="text" v-model="searchTerm" placeholder="Search customer..." @input="filterOrders" />
      </div>
    </div>

    <!-- Charts -->
    <div class="charts-container">
      <div class="chart-card">
        <h3>Top Buyers (Most Orders)</h3>
        <canvas id="topOrdersChart"></canvas>
      </div>
      <div class="chart-card">
        <h3>Top Customers (Highest Spending)</h3>
        <canvas id="topRevenueChart"></canvas>
      </div>
    </div>

    <!-- Customers Table -->
    <div class="orders-table">
      <h3>All Customers</h3>
      <div v-if="loading" class="loading">Loading orders…</div>
      <div v-else>
        <table>
          <thead>
            <tr>
              <th @click="sortBy('name')">Customer</th>
              <th @click="sortBy('orders')">Total Orders</th>
              <th @click="sortBy('revenue')">Total Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in paginatedCustomers" :key="customer.key">
              <td>{{ customerName(customer.user) }}</td>
              <td>{{ customer.orders.length }}</td>
              <td>{{ formatCurrency(totalAmount(customer.orders)) }}</td>
              <td>
                <button class="btn-view" @click="viewCustomerOrders(customer)">
                  View Orders
                </button>
              </td>
            </tr>
            <tr v-if="paginatedCustomers.length === 0">
              <td colspan="4" class="no-orders">No customer orders found.</td>
            </tr>
          </tbody>
        </table>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination">
          <button :disabled="page === 1" @click="page--">Prev</button>
          <span>Page {{ page }} of {{ totalPages }}</span>
          <button :disabled="page === totalPages" @click="page++">Next</button>
        </div>

        <!-- Export CSV -->
        <button class="btn-export" @click="exportCSV">Export CSV</button>
      </div>
    </div>

    <!-- Customer Orders Modal -->
    <div
      v-if="selectedCustomer"
      class="modal-overlay"
      @click.self="closeModal"
    >
      <div class="modal-card">
        <div class="modal-header">
          <h3>{{ customerName(selectedCustomer.user) }}</h3>
          <div class="muted">
            Total Orders: {{ selectedCustomer.orders.length }} —
            Total: {{ formatCurrency(totalAmount(selectedCustomer.orders)) }}
          </div>
        </div>

        <div class="modal-body">
          <h4>Order History</h4>
          <div class="order-list">
            <div
              v-for="ord in selectedCustomer.orders"
              :key="ord.id"
              class="order-card"
            >
              <div class="order-header">
                <div><strong>Order ID:</strong> {{ ord.id }}</div>
                <div class="muted">{{ formatDate(ord.createdAt) }}</div>
              </div>
              <div class="order-total">
                <strong>Total:</strong> {{ formatCurrency(ord.total || 0) }}
              </div>
              <div class="order-items">
                <div
                  v-for="it in ord.items || []"
                  :key="it.id"
                  class="order-item"
                >
                  <span class="item-name">{{ it.name }}</span>
                  <span class="item-qty">×{{ it.qty }}</span>
                  <span class="item-price">{{
                    formatCurrency((it.price || 0) * it.qty)
                  }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button class="btn-edit" @click="closeModal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import { getAllOrders } from '../../services/orderService'
import Chart from 'chart.js/auto'
import { saveAs } from 'file-saver'

// ----- State -----
const orders = ref<any[]>([])
const customers = ref<{ key: string; user: any; orders: any[] }[]>([])
const filteredCustomers = ref<{ key: string; user: any; orders: any[] }[]>([])
const loading = ref(true)
const selectedCustomer = ref<{ user: any; orders: any[] } | null>(null)

// Filters
const selectedRange = ref('all')
const customStart = ref('')
const customEnd = ref('')
const searchTerm = ref('')

// Pagination
const page = ref(1)
const perPage = 10

// Sorting
const sortKey = ref('')
const sortAsc = ref(true)

// Charts
let topOrdersChart: Chart | null = null
let topRevenueChart: Chart | null = null

// ----- Fetch Orders -----
onMounted(async () => {
  loading.value = true
  try {
    orders.value = await getAllOrders()

    const map: Record<string, { user: any; orders: any[] }> = {}
    orders.value.forEach(o => {
      const key = o.user?.uid || o.user?.email || `guest-${o.id}`
      if (!map[key]) map[key] = { user: o.user || null, orders: [] }
      map[key].orders.push(o)
    })

    customers.value = Object.entries(map).map(([key, val]) => ({ key, ...val }))
    filteredCustomers.value = [...customers.value]
    await nextTick()
    filterOrders()
  } catch (err) { console.error(err) }
  finally { loading.value = false }
})

// ----- Utilities -----
function customerName(user: any) {
  return (user && (user.name || user.displayName)) || user?.email || 'Guest'
}
function formatCurrency(n: number) { return '$' + n.toFixed(2) }
function formatDate(d: any) { const dt = new Date(d); return dt.toLocaleString() }
function totalAmount(orders: any[]) { return orders.reduce((sum, o) => sum + (o.total || 0), 0) }
function viewCustomerOrders(customer: any) { selectedCustomer.value = customer }
function closeModal() { selectedCustomer.value = null }

// ----- Filter & Sort -----
const totalRevenue = computed(() => filteredCustomers.value.reduce((sum, c) => sum + totalAmount(c.orders), 0))

function filterOrders() {
  let start: Date | null = null
  let end: Date | null = null
  const now = new Date()

  if (selectedRange.value === 'today') {
    start = new Date(now.setHours(0,0,0,0))
    end = new Date(now.setHours(23,59,59,999))
  } else if (selectedRange.value === 'week') {
    const day = now.getDay()
    start = new Date(now)
    start.setDate(now.getDate() - day)
    start.setHours(0,0,0,0)
    end = new Date()
  } else if (selectedRange.value === 'month') {
    start = new Date(now.getFullYear(), now.getMonth(),1)
    end = new Date(now.getFullYear(), now.getMonth()+1,0,23,59,59)
  } else if (selectedRange.value === 'year') {
    start = new Date(now.getFullYear(),0,1)
    end = new Date(now.getFullYear(),11,31,23,59,59)
  } else if (selectedRange.value === 'custom' && customStart.value && customEnd.value) {
    start = new Date(customStart.value)
    end = new Date(customEnd.value)
    end.setHours(23,59,59)
  }

  filteredCustomers.value = customers.value
    .map(c => ({
      ...c,
      orders: c.orders.filter(o => {
        if (!start || !end) return true
        const d = new Date(o.createdAt)
        return d >= start && d <= end
      })
    }))
    .filter(c => c.orders.length > 0)
    .filter(c => c.user?.name?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
                 c.user?.email?.toLowerCase().includes(searchTerm.value.toLowerCase()))

  sortCustomers()
  createCharts()
}

function sortBy(key: string) {
  if (sortKey.value === key) sortAsc.value = !sortAsc.value
  else { sortKey.value = key; sortAsc.value = true }
  sortCustomers()
}
function sortCustomers() {
  if (!sortKey.value) return
  filteredCustomers.value.sort((a,b) => {
    let valA:any, valB:any
    if (sortKey.value === 'name') { valA = customerName(a.user); valB = customerName(b.user) }
    else if (sortKey.value === 'orders') { valA = a.orders.length; valB = b.orders.length }
    else if (sortKey.value === 'revenue') { valA = totalAmount(a.orders); valB = totalAmount(b.orders) }
    if (valA < valB) return sortAsc.value ? -1 : 1
    if (valA > valB) return sortAsc.value ? 1 : -1
    return 0
  })
}

// ----- Pagination -----
const totalPages = computed(() => Math.ceil(filteredCustomers.value.length / perPage))
const paginatedCustomers = computed(() => filteredCustomers.value.slice((page.value-1)*perPage, page.value*perPage))

// ----- Charts -----
function createCharts() {
  const topBuyers = [...filteredCustomers.value].sort((a,b)=> b.orders.length - a.orders.length).slice(0,5)
  const topRevenue = [...filteredCustomers.value].sort((a,b)=> totalAmount(b.orders)-totalAmount(a.orders)).slice(0,5)

  const ordersCtx = (document.getElementById('topOrdersChart') as HTMLCanvasElement)?.getContext('2d')
  const revenueCtx = (document.getElementById('topRevenueChart') as HTMLCanvasElement)?.getContext('2d')

  if(topOrdersChart) topOrdersChart.destroy()
  if(topRevenueChart) topRevenueChart.destroy()

  if(ordersCtx) topOrdersChart = new Chart(ordersCtx, {
    type:'bar',
    data:{ labels: topBuyers.map(c=>customerName(c.user)), datasets:[{label:'Orders', data:topBuyers.map(c=>c.orders.length), backgroundColor:'#3498db'}]},
    options:{ responsive:true, plugins:{legend:{display:false}}}
  })
  if(revenueCtx) topRevenueChart = new Chart(revenueCtx, {
    type:'bar',
    data:{ labels: topRevenue.map(c=>customerName(c.user)), datasets:[{label:'Revenue', data:topRevenue.map(c=>totalAmount(c.orders)), backgroundColor:'#27ae60'}]},
    options:{ responsive:true, plugins:{legend:{display:false}}}
  })
}

// ----- Export CSV -----
function exportCSV() {
  const headers = ['Customer','Email','Total Orders','Total Amount']
  const rows = filteredCustomers.value.map(c=> [
    customerName(c.user),
    c.user?.email||'Guest',
    c.orders.length,
    totalAmount(c.orders)
  ])
  const csvContent = [headers, ...rows].map(e=>e.join(',')).join('\n')
  const blob = new Blob([csvContent], {type:'text/csv;charset=utf-8'})
  saveAs(blob, `customer_orders_${Date.now()}.csv`)
}
</script>

<style scoped>
/* Similar styling as before */
.customer-dashboard { max-width: 1200px; margin:0 auto; padding:30px; background:white; border-radius:8px; box-shadow:0 2px 12px rgba(0,0,0,0.1); }
h2{margin-bottom:20px;}
.summary-cards{display:flex;gap:20px;margin-bottom:20px;}
.card{flex:1;background:#f7f7f7;padding:15px;border-radius:6px;text-align:center;}
.filters{display:flex;gap:20px;margin-bottom:20px;flex-wrap:wrap;}
.date-filter, .search-filter{display:flex;align-items:center;gap:10px;}
.charts-container{display:flex;flex-wrap:wrap;gap:20px;margin-bottom:30px;}
.chart-card{flex:1 1 45%;background:#f7f7f7;padding:20px;border-radius:8px;}
.orders-table{overflow-x:auto;}
table{width:100%;border-collapse:collapse;margin-bottom:20px;}
th{background:#f5f5f5;padding:12px;font-weight:600;cursor:pointer;border-bottom:2px solid #e0e0e0;}
td{padding:12px;border-bottom:1px solid #e0e0e0;}
tr:hover{background:#f9f9f9;}
.no-orders{text-align:center;padding:20px;color:#666;}
.btn-view{padding:6px 12px;border:none;border-radius:4px;background:#3498db;color:white;cursor:pointer;}
.btn-view:hover{background:#2980b9;}
.pagination{display:flex;justify-content:center;align-items:center;gap:10px;margin-bottom:15px;}
.btn-export{padding:6px 12px;background:#27ae60;color:white;border:none;border-radius:4px;cursor:pointer;}
.btn-export:hover{background:#1e8449;}
</style>
