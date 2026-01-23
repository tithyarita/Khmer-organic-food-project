<template>
  <!-- Only render banner if images exist -->
  <div class="banner" v-if="banners.length">
    <img :src="currentBanner" class="banner-img" />

    <div class="banner-content">
      <h1 class="banner-title">{{ pageTitle }}</h1>
    </div>

    <!-- Dots only when multiple images -->
    <div class="dots" v-if="banners.length > 1">
      <span
        v-for="(_, i) in banners"
        :key="i"
        :class="{ active: i === currentIndex }"
        @click="currentIndex = i"
      ></span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const route = useRoute()

/* Page title */
const pageTitle = computed(
  () => (route.meta.title as string) || 'Welcome to Our Store'
)

/* Normalize images */
const banners = computed<string[]>(() => {
  if (Array.isArray(route.meta.images)) return route.meta.images
  if (typeof route.meta.image === 'string') return [route.meta.image]
  return []
})

const currentIndex = ref(0)
const currentBanner = computed(() => banners.value[currentIndex.value])

let intervalId: number | null = null

/* Start / reset slideshow */
const startSlider = () => {
  stopSlider()
  if (banners.value.length > 1) {
    intervalId = window.setInterval(() => {
      currentIndex.value =
        (currentIndex.value + 1) % banners.value.length
    }, 1000)
  }
}

const stopSlider = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
}

/* Restart when route changes */
watch(
  () => route.fullPath,
  () => {
    currentIndex.value = 0
    startSlider()
  }
)

onMounted(startSlider)
onUnmounted(stopSlider)
</script>

<style scoped>
.banner {
  position: relative;
  width: 100%;
  height: 30rem;
  overflow: hidden;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(90%);
  animation: zoomIn 10s ease-in-out infinite alternate;
}

.banner-content {
  position: absolute;
  top: 50%;
  left: 4rem;
  transform: translateY(-50%);
  color: white;
  animation: fadeSlideIn 1.2s ease-out forwards;
}

.banner-title {
  font-size: 3.5rem;
  font-weight: 700;
  font-family: 'Roboto', sans-serif;
}

.dots {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
}

.dots span {
  display: inline-block;
  width: 12px;
  height: 12px;
  margin: 0 5px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  cursor: pointer;
}

.dots span.active {
  background: white;
}

@keyframes zoomIn {
  from { transform: scale(1); }
  to { transform: scale(1.1); }
}

@keyframes fadeSlideIn {
  from {
    opacity: 0;
    transform: translateY(-60%) translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateY(-50%) translateX(0);
  }
}
</style>
