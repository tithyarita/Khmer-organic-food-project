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
          <div class="items-name">Users</div>
        </router-link>

        <router-link
          to="/admin/blogs"
          class="menu-item"
          :class="{ active: isActive('/admin/blogs') }"
        >
          <span class="icon">📝</span>
          <div class="items-name">Check Blog</div>
        </router-link>
      </nav>
    </aside>

    <!-- RIGHT CONTENT -->
    <section class="content">
      <!-- TOP BAR -->
      <div class="top-bar">
        <h1 class="page-title">Dashboard</h1>
        <div class="search-bar">
          <input type="text" placeholder="Search..." v-model="searchQuery" />
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
      </div>

      <!-- Child components -->
      <router-view :search-query="searchQuery" />
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const searchQuery = ref('')

// Highlight active menu item
const isActive = (path: string) => route.path.startsWith(path)
</script>

<style scoped>
/* Dashboard Container */
.dashboard-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background-color: #e6e6e6;
  font-family: 'Baloo Tammudu 2', sans-serif;
  overflow-x: hidden;
}

/* Sidebar */
.sidebar {
  width: 260px;
  background-color: #53b400;
  color: white;
  padding: 40px 20px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.welcome-box {
  margin-bottom: 40px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 20px;
}

.welcome-title {
  font-size: 28px;
  margin: 0;
  font-weight: 300;
}

.welcome-subtitle {
  font-size: 32px;
  margin: 0;
  font-weight: 700;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
  padding: 18px 15px;
  font-size: 16px;
  border-radius: 8px;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateX(5px);
}

.menu-item.active {
  background-color: white;
  color: #53b400;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.menu-item .icon {
  font-size: 28px;
}

.items-name {
  font-weight: 600;
  font-size: 14px;
}

/* Content Area */
.content {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
}

/* Top Bar */
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

.page-title {
  margin: 0;
  font-size: 28px;
  color: #2c3e50;
  font-weight: 700;
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
  width: 220px;
  font-size: 14px;
}

.search-bar i {
  color: #2c3e50;
  cursor: pointer;
}

/* Scrollbar Styling */
.content::-webkit-scrollbar {
  width: 8px;
}

.content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
</style>
