<template>
  <div class="menu">
    <div class="left-side">
      <img src="" alt="Logo" />
      <router-link to="/">Home</router-link>
      <router-link to="/category">Category</router-link>
      <router-link to="/blog">Blog</router-link>
      <router-link to="/contact">Contact</router-link>
      <router-link to="/about">About</router-link>
    </div>
    <div class="right-side">
      <router-link to="#"><i class="fa-solid fa-magnifying-glass"></i></router-link>
      <router-link to="#"><i class="fa-regular fa-heart"></i></router-link>
      <router-link to="#"><i class="fa-solid fa-cart-shopping"></i></router-link>
      <router-link to="#"><i class="fa-regular fa-user"></i></router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Menu'
})
</script>

<style scoped>
.menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #6EC007;
  padding: 20px 30px;
  /* gap: 1rem; */
  font-family: 'Baloo Da', cursive;
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
  /* font-family: 'Baloo Da', cursive; */
}

.router-link-active {
  border-bottom: 2px solid white;
  padding-bottom: 4px;
}
</style>
