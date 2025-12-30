<template>
  <header class="menu">
    <!-- LEFT -->
    <div class="left-side">
      <router-link to="/admin" class="logo-link">
        <img src="/images/Logo.png" alt="Logo" />
      </router-link>

      <router-link to="/" class="nav-link">Home</router-link>

      <!-- Category Dropdown -->
      <div class="dropdown">
        <span class="nav-link">Category</span>
        <div class="dropdown-content">
          <router-link to="/category/vegetables">Vegetables</router-link>
          <router-link to="/category/meats">Meats</router-link>
          <router-link to="/category/sets">Sets</router-link>
        </div>
      </div>

      <router-link to="/blog" class="nav-link">Blog</router-link>
      <router-link to="/contact" class="nav-link">Contact</router-link>
      <router-link to="/about" class="nav-link">About</router-link>
    </div>

    <!-- RIGHT -->
    <div class="right-side">
      <router-link to="#" class="icon-link">
        <i class="fa-solid fa-magnifying-glass"></i>
      </router-link>
      <router-link to="/favorite" class="icon-link">
        <i class="fa-regular fa-heart"></i>
      </router-link>

      <router-link to="/cart"><i class="fa-solid fa-cart-shopping"></i></router-link>
      <router-link to="/profile"><i class="fa-regular fa-user"></i></router-link>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Menu',
})
</script>

<style scoped>
/* ================= HEADER ================= */
.menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #6ec007;
  padding: 1.2rem 3rem;
  font-family: 'Baloo Da', cursive;
}

/* ================= LOGO ================= */
.logo-link img {
  width: 3.2rem;
  height: auto;
}

/* ================= NAV ================= */
.left-side,
.right-side {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  font-size: 1.3rem;
  font-weight: 600;
  position: relative;
  cursor: pointer;
}

/* Active & Hover underline */
.nav-link::after,
.router-link-active::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -0.3rem;
  width: 0;
  height: 2px;
  background: white;
  transition: width 0.3s ease;
}

.nav-link:hover::after,
.router-link-active::after {
  width: 100%;
}

/* ================= ICONS ================= */
.icon-link {
  color: white;
  font-size: 1.4rem;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.icon-link:hover {
  transform: scale(1.15);
  opacity: 0.9;
}

/* ================= DROPDOWN ================= */
.dropdown {
  position: relative;
}

.dropdown-content {
  position: absolute;
  top: 130%;
  left: 0;
  background: white;
  min-width: 10rem;
  border-radius: 0.6rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  opacity: 0;
  transform: translateY(10px);
  pointer-events: none;
  transition: all 0.25s ease;
  z-index: 100;
}

.dropdown-content a {
  color: #333;
  padding: 0.8rem 1.2rem;
  font-size: 1.2rem;
  display: block;
  text-decoration: none;
}

.dropdown-content a:hover {
  background: #f4f4f4;
}

/* Show dropdown */
.dropdown:hover .dropdown-content {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

/* ================= MOBILE ================= */
@media (max-width: 768px) {
  .menu {
    padding: 1rem 1.5rem;
  }

  .left-side {
    gap: 1.2rem;
  }

  .nav-link {
    font-size: 1.1rem;
  }

  .icon-link {
    font-size: 1.2rem;
  }
}
</style>
