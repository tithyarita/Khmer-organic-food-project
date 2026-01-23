<template>
  <div class="homepage-container">
    <section ref="mainBanner" class="content-section main-banner-wrapper">
      <BannerHomePage class="main-banner" @shop-now="goToProducts" />
    </section>

    <section ref="popularSection" class="content-section popular-section">
      <BannerHomePage :showPopular="true" />
    </section>

    <section ref="gridSection" class="content-section grid-section">
      <h1>Our Product</h1>
      <div class="grid-banner-wrapper">
        <BannerHomePage :showGridOnly="true" />
      </div>
    </section>

    <section ref="columnSection" class="content-section column-section">
      <h1>Promotion</h1>
      <div class="column-banner-wrapper">
        <BannerHomePage :showColumnOnly="true" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import BannerHomePage from '@/components/Homepage-banner.vue'
import { ref, onMounted } from 'vue'

const mainBanner = ref<HTMLElement | null>(null)
const gridSection = ref<HTMLElement | null>(null)
const columnSection = ref<HTMLElement | null>(null)
const popularSection = ref<HTMLElement | null>(null)

function goToProducts() {
  if (gridSection.value) {
    const offset = 6.25 * 16
    const top = gridSection.value.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top, behavior: 'smooth' })
  }
}

onMounted(() => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('animate')
      })
    },
    { threshold: 0.3 }
  )

  observer.observe(mainBanner.value!)
  observer.observe(popularSection.value!)
  observer.observe(gridSection.value!)
  observer.observe(columnSection.value!)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Baloo+Da&family=Baloo+Tamma+2&display=swap');

.homepage-container {
  font-family: 'Baloo Da', cursive;
}

.content-section {
  text-align: center;
  margin: 0;
  opacity: 1;
}

.main-banner-wrapper {
  margin-top: 0;
}

.content-section h1 {
  font-size: 3rem;
  font-family: 'Baloo Tamma 2', cursive;
  color: #6ec007;
  margin-bottom: 1rem;
  opacity: 0;
  transform: translateY(1.875rem);
}

.main-banner-wrapper.animate .main-banner {
  animation: floatFade 1.5s ease-out forwards;
}

.popular-section.animate {
  animation: floatFade 1.5s ease-out forwards;
  animation-delay: 0.1s;
}

.grid-section.animate h1 {
  animation: floatFade 1.3s ease-out forwards;
  animation-delay: 0.2s;
}
.grid-section.animate .grid-banner-wrapper {
  animation: floatFade 1.5s ease-out forwards;
  animation-delay: 0.35s;
}

.column-section.animate h1 {
  animation: floatFade 1.3s ease-out forwards;
  animation-delay: 0.2s;
}
.column-section.animate .column-banner-wrapper {
  animation: floatFade 1.5s ease-out forwards;
  animation-delay: 0.35s;
}

@keyframes floatFade {
  0% {
    opacity: 0;
    transform: translateY(1.875rem) scale(0.95);
  }
  50% {
    transform: translateY(-0.625rem) scale(1.02);
    opacity: 0.8;
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.bannerhome-container .grid-item img,
.bannerhome-container .grid-item1 img {
  transition: transform 0.5s ease, box-shadow 0.5s ease;
}

.bannerhome-container .grid-item:hover img,
.bannerhome-container .grid-item1:hover img {
  transform: scale(1.05);
  box-shadow: 0 0.9375rem 1.5625rem rgba(0,0,0,0.15);
}

.shop-now {
  position: absolute;
  bottom: 3.125rem;
  left: 9.375rem;
  padding: 0.75rem 1.5625rem;
  background: #6ec007;
  color: white;
  font-size: 1.25rem;
  border-radius: 1.875rem;
  border: none;
  cursor: pointer;
  font-family: 'Baloo Da', cursive;
  transition: all 0.3s ease;
}

.shop-now:hover {
  background-color: white;
  color: #57a600;
  transform: scale(1.05);
}
</style>
