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
          ><div class="items-name">Products</div></router-link
        >
        <br>
      </br>
        <router-link
          to="/admin/stocks"
          class="menu-item"
          :class="{ active: isActive('/admin/stocks') }"
          ><div class="items-name">Stocks</div></router-link
        >
        <br>
      </br>
        <router-link
          to="/admin/orders"
          class="menu-item"
          :class="{ active: isActive('/admin/orders') }"
          ><div class="items-name">Orders</div></router-link
        >
        <br>
      </br>
        <router-link
          to="/admin/sales"
          class="menu-item"
          :class="{ active: isActive('/admin/sales') }"
          ><div class="items-name">Sales</div></router-link
        >
        <br>
      </br>
        <router-link
          to="/admin/users"
          class="menu-item"
          :class="{ active: isActive('/admin/users') }"
          ><div class="items-name">Info User</div></router-link
        >
        <br>
      </br>
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

      <router-view />
      <!-- Nested admin pages like ProductView will render here -->
    </section>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const isActive = (path: string) => route.path === path
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
  width: 28%;
  background: #53b400;
  padding: 40px 20px;
  color: white;
}

.welcome-title {
  font-size: 32px;
  margin: 0;
}

.welcome-subtitle {
  font-size: 36px;
  margin: 0;
  font-weight: bold;
}

.menu {
  margin-top: 40px;
}

.menu-item {
  padding: 18px 0;
  text-align: center;
  font-size: 24px;
  cursor: pointer;
  color: white;
  text-decoration: none;
}

.menu-item.active {
  background: white;
  color: #53b400;
  border-radius: 5px;
}

/* Content */
.content {
  width: 72%;
  padding: 40px;
}

.top-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  background: #b6db7b;
  padding: 15px 20px;
  border-radius: 4px;
}

.top-bar h1 {
  margin: 0;
}

.search-bar {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-bar input {
  padding: 8px 15px;
  border: none;
  border-radius: 20px;
}
</style>
