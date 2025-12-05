<template>
  <div class="menu">
    <div class="left-side">
      <router-link to="/admin"><img src="\images\Logo.png" alt="Logo" /> </router-link>
      <router-link to="/">Home</router-link>

      <!-- Category with dropdown -->
      <div class="dropdown">
        <!-- <router-link to="/category">Category</router-link> -->
        <a href="#">Category</a>
        <div class="dropdown-content">
          <router-link to="/category/vegetables">Vegetables</router-link>
          <router-link to="/category/meats">Meats</router-link>
          <router-link to="/category/sets">Sets</router-link>
        </div>
      </div>

      <router-link to="/blog">Blog</router-link>
      <router-link to="/contact">Contact</router-link>
      <router-link to="/about">About</router-link>
    </div>

    <div class="right-side">
      <router-link to="#"><i class="fa-solid fa-magnifying-glass"></i></router-link>
      <router-link to="/favorites">
        <i class="fa-regular fa-heart"></i>
      </router-link>

      <router-link to="/cart"><i class="fa-solid fa-cart-shopping"></i></router-link>
      <router-link to="#"><i class="fa-regular fa-user"></i></router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Menu',
})
</script>

<style scoped>
.menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #6ec007;
  padding: 1.25rem 1.875rem; /* 20px 30px */
  font-family: 'Baloo Da', cursive;
}
.left-side img {
  width: 3rem; /* 100px */
  height: 3rem; /* 100px */
}

.left-side,
.right-side {
  display: flex;
  align-items: center;
  gap: 2rem; /* already rem */
  font-family: 'Baloo Da', cursive;
}

.menu a {
  color: white;
  text-decoration: none;
  font-size: 1.3rem; /* already rem */
}

.router-link-active {
  border-bottom: 0.125rem solid white; /* 2px */
  padding-bottom: 0.25rem; /* 4px */
}

/* Dropdown styles */
.dropdown {
  position: relative;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #6ec007;
  min-width: 5rem; /* 150px */
  top: 100%;
  left: 0;
  flex-direction: column;
  padding: 0.625rem 0; /* 10px */
}

.dropdown-content a {
  padding: 0.5rem 1rem; /* 8px 16px */
  display: block;
  font-size: 1.1rem; /* already rem */
}

.dropdown:hover .dropdown-content {
  display: flex;
}
</style>
