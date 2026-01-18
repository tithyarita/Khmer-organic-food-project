<template>
  <div class="customer-orders">
    <h2>Customer Orders</h2>

    <!-- Customers Table -->
    <div class="orders-table">
      <div v-if="loading" class="loading">Loading orders…</div>
      <div v-else>
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Total Orders</th>
              <th>Total Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in customers" :key="customer.key">
              <td>{{ customerName(customer.user) }}</td>
              <td>{{ customer.orders.length }}</td>
              <td>{{ formatCurrency(totalAmount(customer.orders)) }}</td>
              <td>
                <button class="btn-view" @click="viewCustomerOrders(customer)">View Orders</button>
              </td>
            </tr>
            <tr v-if="customers.length === 0">
              <td colspan="4" class="no-orders">No customer orders found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Customer Orders Modal -->
    <div v-if="selectedCustomer" class="modal-overlay" @click.self="closeModal">
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
            <div v-for="ord in selectedCustomer.orders" :key="ord.id" class="order-card">
              <div class="order-header">
                <div><strong>Order ID:</strong> {{ ord.id }}</div>
                <div class="muted">{{ formatDate(ord.createdAt) }}</div>
              </div>
              <div class="order-total"><strong>Total:</strong> {{ formatCurrency(ord.total || 0) }}</div>
              <div class="order-items">
                <div v-for="it in ord.items || []" :key="it.id" class="order-item">
                  <img v-if="it.image" :src="it.image.startsWith('http') ? it.image : `http://localhost:3000/uploads/${it.image}`" alt="it.name" class="item-image" />
                  <span class="item-name">{{ it.name }}</span>
                  <span class="item-qty">×{{ it.qty }}</span>
                  <span class="item-price">{{ formatCurrency((it.price||0) * it.qty) }}</span>
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
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, onMounted } from 'vue'
import { getAllOrders } from '../../services/orderService'

const orders = ref<any[]>([])
const customers = ref<{ key: string, user: any, orders: any[] }[]>([])
const loading = ref(true)
const error = ref<any>(null)
const selectedCustomer = ref<{ user: any, orders: any[] } | null>(null)

onMounted(async () => {
  loading.value = true
  try {
    orders.value = await getAllOrders()

    // Group orders by customer
    const map: Record<string, { user: any, orders: any[] }> = {}
    orders.value.forEach(o => {
      const key = o.user?.uid || o.user?.email || `guest-${o.id}`
      if (!map[key]) map[key] = { user: o.user || null, orders: [] }
      map[key].orders.push(o)
    })

    customers.value = Object.entries(map).map(([key, val]) => ({ key, ...val }))
  } catch (e) {
    console.error('Failed to load orders', e)
    error.value = e
  } finally {
    loading.value = false
  }
})

function customerName(user: any) {
  return (user && (user.name || user.displayName)) || user?.email || 'Guest'
}

function formatCurrency(n: number) {
  return '$' + n.toFixed(2)
}

function formatDate(d: any) {
  if (!d) return '-'
  const dt = d instanceof Date ? d : new Date(d)
  return dt.toLocaleString()
}

function totalAmount(orders: any[]) {
  return orders.reduce((sum, o) => sum + (o.total || 0), 0)
}

function viewCustomerOrders(customer: any) {
  selectedCustomer.value = customer
}

function closeModal() {
  selectedCustomer.value = null
}
</script>

<style scoped>
.customer-orders {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

h2 {
  margin-bottom: 20px;
}

.orders-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background-color: #f5f5f5;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #e0e0e0;
}

td {
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
}

tr:hover {
  background-color: #f9f9f9;
}

.no-orders {
  text-align: center;
  padding: 20px;
  color: #666;
}

.btn-view {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: #3498db;
  color: white;
  cursor: pointer;
}

.btn-view:hover {
  background-color: #2980b9;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.45);
  z-index: 2000;
  padding: 1.5rem;
  overflow-y: auto;
}

.modal-card {
  background: #fff;
  padding: 1.6rem;
  border-radius: 10px;
  width: 95%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  margin-bottom: 16px;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
}

.order-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.order-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 12px 16px;
  background: #fafafa;
  box-shadow: 0 1px 4px rgba(0,0,0,0.05);
}

.order-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-weight: 600;
}

.order-total {
  margin-bottom: 8px;
  font-weight: 500;
}

.order-items {
  border-top: 1px dashed #ccc;
  padding-top: 8px;
}

.order-item {
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
}

.item-name { flex: 2; }
.item-qty { flex: 1; text-align: center; }
.item-price { flex: 1; text-align: right; }

.modal-actions {
  margin-top: 12px;
  text-align: right;
}

.btn-edit {
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  background-color: #f39c12;
  color: white;
  cursor: pointer;
}

.btn-edit:hover {
  background-color: #e67e22;
}

.item-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 8px;
}

.muted { color: #666; font-size: 0.9rem; }

.loading {
  text-align: center;
  padding: 40px 0;
  font-size: 1.2rem;
  color: #666;
}
</style>
