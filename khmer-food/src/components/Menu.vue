<template>
  <div class="menu">
    <div class="left-side">
      <router-link to="/admin" class="logo-link">
        <img src="/images/Logo.png" alt="Logo" />
      </router-link>
      <router-link to="/">Home</router-link>

      <!-- Category with dropdown -->
      <div class="dropdown">
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
      <!-- Search Box -->
      <input
        type="text"
        placeholder="Search..."
        class="search-box"
        v-model="searchText"
        @input="emitSearch"
      />

      <router-link to="#" class="icon-link">
        <i class="fa-solid fa-magnifying-glass"></i>
      </router-link>


      <router-link to="/favorite" class="icon-link">
        <i class="fa-regular fa-heart"></i>
      </router-link>
      <router-link to="/cart" class="icon-link">
        <i class="fa-solid fa-cart-shopping"></i>
      </router-link>
      <router-link to="/ProfileUser" class="icon-link">
        <i class="fa-regular fa-user"></i>
      </router-link>
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
  padding: 1.25rem 1.875rem;
  font-family: 'Baloo Da', cursive;
}

.logo-link {
  display: flex;
  align-items: center;
}

.logo-link img {
  width: 3rem;
  height: 3rem;
  cursor: pointer;
}

.left-side,
.right-side {
  display: flex;
  align-items: center;
  gap: 2rem;
  font-family: 'Baloo Da', cursive;
}

.menu a {
  color: white;
  text-decoration: none;
  font-size: 1.3rem;
}

.router-link-active {
  border-bottom: 0.125rem solid white;
  padding-bottom: 0.25rem;
}

.dropdown {
  position: relative;
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #6ec007;
  min-width: 5rem;
  top: 100%;
  left: 0;
  flex-direction: column;
  padding: 0.625rem 0;
  z-index: 10;
}

.dropdown-content a {
  padding: 0.5rem 1rem;
  display: block;
  font-size: 1.1rem;
}

.dropdown:hover .dropdown-content {
  display: flex;
}
</style>
