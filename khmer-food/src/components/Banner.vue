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
  font-size: 4.2rem;
  font-weight: 700;
  font-family: 'Roboto', sans-serif;
}

/* Image fits container with zoom animation */
.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(90%);
  animation: zoomIn 10s ease-in-out infinite alternate;
}

/* Text overlays image with fade/slide animation */
.banner-content {
  position: absolute;
  top: 50%;
  left: 4rem;
  transform: translateY(-50%);
  color: white;
  animation: fadeSlideIn 1.5s ease-out forwards;
}


/* Keyframes */
@keyframes zoomIn {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(1.1);
  }
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(-60%) translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
}

</style>
