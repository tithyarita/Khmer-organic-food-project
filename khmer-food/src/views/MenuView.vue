<template>
  <div class="menu">
    <img src="" alt="">
    <router-link to="/">Home</router-link>
    <router-link to="/category">Category</router-link>
    <router-link to="/blog">Blog</router-link>
    <router-link to="/contact">Contact</router-link>
    <router-link to="/about">About</router-link>
  </div>
</template>

<script>
export default {
  name: "Menu"
}
</script>

<style>
.menu{
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  gap: 1rem;
  height: 10vh;
  background-color: #6EC007;
}
.menu a {
  color: white;
  font-weight: bold;
  text-decoration: none;
}
.router-link-active {
  border-bottom: 2px solid white;
  padding-bottom: 4px;
}

</style>
