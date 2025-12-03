<template>
  <div class="banner" :style="{ backgroundColor }">
    <h1 class="banner-title">{{ pageTitle }}</h1>
    <img :src="bannerImage" alt="Category Banner" class="banner-img" />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const pageTitle = route.meta.title || 'Welcome to Our Store'
const bannerImage = route.meta.image || '/default-banner.jpg'
const backgroundColor = route.meta.bg || '#f5f5f5'
</script>

<style scoped>
.banner {
  padding: 1.25rem;           /* 20px */
  text-align: center;
}

.banner-title {
  font-size: 2rem;            /* 32px */
  font-weight: 600;
  margin-bottom: 1rem;        /* 16px */
  color: #548D0C;
  font-family: 'Baloo Da', cursive;
}

.banner-img {
  max-width: 100%;
  height: 15rem;
  margin-top: 0.9375rem;      /* 15px */
  border-radius: 0.5rem;      /* 8px */
  box-shadow: 0 0.25rem 0.5rem rgba(0, 0, 0, 0.1);
  /* margin-left: 30rem; */
}
</style>