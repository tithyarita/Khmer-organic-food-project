<template>
  <div class="dashboard-container">
    <!-- LEFT SIDEBAR -->
    <aside class="sidebar">
      <div class="welcome-box">
        <h1 class="welcome-title">Welcome to</h1>
        <h2 class="welcome-subtitle">Admin Dashboard</h2>
      </div>

      <nav class="menu">
        <router-link
          to="/admin/products"
          class="menu-item"
          :class="{ active: isActive('/admin/products') }"
        >
          📦 Products
        </router-link>
        <router-link
          to="/admin/stocks"
          class="menu-item"
          :class="{ active: isActive('/admin/stocks') }"
        >
          📊 Stocks
        </router-link>
        <router-link
          to="/admin/orders"
          class="menu-item"
          :class="{ active: isActive('/admin/orders') }"
        >
          📋 Orders
        </router-link>
        <router-link
          to="/admin/sales"
          class="menu-item"
          :class="{ active: isActive('/admin/sales') }"
        >
          💰 Sales
        </router-link>
        <router-link
          to="/admin/users"
          class="menu-item"
          :class="{ active: isActive('/admin/users') }"
        >
          👥 Users
        </router-link>
      </nav>
    </aside>

    <!-- RIGHT CONTENT -->
    <section class="content">
      <!-- Optional top bar -->
      <div class="top-bar">
        <h1>{{ currentTitle }}</h1>
      </div>

      <!-- Render child admin pages here -->
      <router-view></router-view>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const currentTitle = computed(() => {
  if (route.path.includes('products')) return 'Products'
  if (route.path.includes('stocks')) return 'Stocks'
  if (route.path.includes('orders')) return 'Orders'
  if (route.path.includes('sales')) return 'Sales'
  if (route.path.includes('users')) return 'Users'
  return 'Dashboard'
})

const isActive = (path: string) => route.path.startsWith(path)
</script>

<style scoped>
.dashboard-container {
  display: flex;
  height: 100vh;
  background-color: #f5f5f5;
}

.sidebar {
  width: 250px;
  background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
  color: white;
  padding: 30px 20px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
}

.welcome-box {
  margin-bottom: 40px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 20px;
}

.welcome-title {
  font-size: 14px;
  font-weight: 300;
  margin: 0 0 5px 0;
  color: rgba(255, 255, 255, 0.7);
}

.welcome-subtitle {
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  color: white;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  display: block;
  padding: 12px 16px;
  text-decoration: none;
  color: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 500;
  cursor: pointer;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.menu-item.active {
  background-color: #3498db;
  color: white;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.top-bar {
  background: white;
  padding: 20px 30px;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.top-bar h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 28px;
}

router-view {
  flex: 1;
  overflow-y: auto;
  padding: 30px;
}
</style>
