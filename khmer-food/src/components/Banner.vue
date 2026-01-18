<template>
  <div class="banner">
    <!-- Background Image -->
     
    <img :src="bannerImage" alt=" " class="banner-img" />

    <!-- Text Content -->
    <div class="banner-content">
      <h1 class="banner-title">{{ pageTitle }}</h1>
    </div>
  </div>
</template>

<script setup>
// import { useRoute } from 'vue-router'

import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()
const pageTitle = computed(() => route.meta.title || 'Welcome to Our Store')
const bannerImage = computed(() => route.meta.image || '/default-banner.jpg')
</script>

<style scoped>
.banner {
  position: relative;            /* allow absolute elements */
  width: 100%;
  height: 30rem;
  overflow: hidden;
  border-radius: 0.5rem;
 
}

/* Image fits container */
.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(90%);        /* optional: darker for text visibility */
}

/* Text overlays image */
.banner-content {
  position: absolute;
  top: 50%;
  left: 4rem;
  transform: translateY(-50%);
  color: white;
}

/* Title style */
.banner-title {
  font-size: 3.2rem;
  font-weight: 700;
  font-family: 'Roboto', sans-serif;
}
</style>
