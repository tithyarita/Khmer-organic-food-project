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
          to="/admin/sales"
          class="menu-item"
          :class="{ active: isActive('/admin/sales') }"
        >
          <span class="icon">💰</span>
          <div class="items-name">Sales</div>
        </router-link>
        <router-link
          to="/admin/products"
          class="menu-item"
          :class="{ active: isActive('/admin/products') }"
        >
          <span class="icon">📊</span>
          <div class="items-name">Products</div>
        </router-link>

        <router-link
          to="/admin/orders"
          class="menu-item"
          :class="{ active: isActive('/admin/orders') }"
        >
          <span class="icon">📋</span>
          <div class="items-name">Orders</div>
        </router-link>

        <router-link
          to="/admin/users"
          class="menu-item"
          :class="{ active: isActive('/admin/users') }"
        >
          <span class="icon">👥</span>
          <div class="items-name">Info User</div>
        </router-link>
      </nav>
    </aside>

    <!-- RIGHT CONTENT -->
    <section class="content">
      <div class="top-bar">
        <h1>Dashboard</h1>
        <div class="search-bar">
          <input type="text" placeholder="Search" />
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
      </div>

      <!-- Child routes render here -->
      <router-view />
    </section>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const isActive = (path: string) => route.path.startsWith(path)
</script>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: #e6e6e6;
  overflow-x: hidden;

  font-family: 'Baloo Tamma 2', sans-serif;
}

/* Sidebar */
.sidebar {
  width: 25%;
  background: #53b400;
  padding: 40px 20px;
  color: white;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.welcome-box {
  margin-bottom: 40px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 20px;
}

.welcome-title {
  font-size: 32px;
  margin: 0;
  font-weight: 300;
}

.welcome-subtitle {
  font-size: 36px;
  margin: 0;
  font-weight: bold;
}

.menu {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.menu-item {
  padding: 18px 15px;
  text-align: center;
  font-size: 18px;
  cursor: pointer;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(5px);
}

.menu-item.active {
  background: white;
  color: #53b400;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.menu-item .icon {
  font-size: 28px;
}

.items-name {
  font-size: 16px;
  font-weight: 600;
}

/* Content */
.content {
  width: 100%;
  padding: 40px;
  overflow-y: auto;
}

.top-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  background: #b6db7b;
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.top-bar h1 {
  margin: 0;
  color: #2c3e50;
  font-size: 28px;
}

.search-bar {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-bar input {
  padding: 10px 15px;
  border: none;
  border-radius: 20px;
  width: 200px;
}

.search-bar i {
  color: #2c3e50;
  cursor: pointer;
}
</style>
