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
        <router-link
          to="/admin/contact"
          class="menu-item"
          :class="{ active: isActive('/admin/contact') }"
        >
          <span class="icon">📍</span>
          <div class="items-name">Contact</div>
        </router-link>

        <router-link
          to="/admin/profile"
          class="menu-item"
          :class="{ active: isActive('/admin/profile') }"
        >
          <span class="icon">👤</span>
          <div class="items-name">Profile</div>
        </router-link>

      </nav>
    </aside>

    <!-- RIGHT CONTENT -->
    <section class="content">
      <!-- TOP BAR -->
      <!-- <div class="top-bar"> -->
        <!-- <h1 class="page-title">Dashboard</h1> -->
        <!-- <div class="search-bar">
          <input type="text" placeholder="Search..." v-model="searchQuery" />
          <i class="fa-solid fa-magnifying-glass"></i>
        </div> -->
      <!-- </div> -->

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
/* ===============================
   Dashboard Container
================================ */
.dashboard-container {
  min-height: 100vh;
  width: 100%;
  background-color: #e6e6e6;
  font-family: 'Baloo Tammudu 2', sans-serif;
  overflow-x: hidden;


  /* IMPORTANT: reserve space for fixed sidebar */
  padding-left: 260px;
}

/* ===============================
   Sidebar
================================ */
.sidebar {
  width: 260px;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;

  background-color: #53b400;
  padding: 40px 20px;
  overflow-y: auto;
  z-index: 1000;
   /* Hide scrollbar (Firefox) */
  scrollbar-width: none;

  /* Hide scrollbar (IE / Edge old) */
  -ms-overflow-style: none;
}

.sidebar::-webkit-scrollbar {
  width: 8px;
}

.sidebar::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.25);
  border-radius: 4px;
}

/* ===============================
   Welcome Section
================================ */
.welcome-box {
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.25);
  color: white;
}

.welcome-title {
  font-size: 28px;
  font-weight: 300;
  margin: 0;
}

.welcome-subtitle {
  font-size: 32px;
  font-weight: 700;
  margin: 0;
}

/* ===============================
   Menu
================================ */
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

  padding: 18px 15px;
  border-radius: 10px;

  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  color: white;

  transition: all 0.3s ease;
}

.menu-item .icon {
  font-size: 28px;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.18);
  transform: translateX(6px);
}

.menu-item.active {
  background-color: #ffffff;
  color: #53b400;
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.25);
}

/* ===============================
   Content Area
================================ */
.content {
  padding: 15px 20px;
  min-height: 100vh;
  overflow-y: auto;
}

/* ===============================
   Top Bar
================================ */
.top-bar {
  display: flex;
  align-items: center;
  gap: 20px;

  background-color: #b6db7b;
  padding: 16px 22px;
  border-radius: 10px;
  margin-bottom: 30px;

  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

/* ===============================
   Search Bar (Optional)
================================ */
.search-bar {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-bar input {
  padding: 10px 16px;
  border-radius: 20px;
  border: none;
  outline: none;
  font-size: 14px;
  width: 220px;
}

.search-bar i {
  cursor: pointer;
  color: #2c3e50;
}

/* ===============================
   Scrollbar for Content
================================ */
.content::-webkit-scrollbar {
  width: 8px;
}

.content::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.25);
  border-radius: 4px;
}

/* ===============================
   Responsive (optional safety)
================================ */
@media (max-width: 900px) {
  .dashboard-container {
    padding-left: 0;
  }

  .sidebar {
    transform: translateX(-100%);
  }
}

</style>
