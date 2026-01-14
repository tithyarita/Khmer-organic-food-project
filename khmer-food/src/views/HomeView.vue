<template>
  <div class="homepage-container">

    <!-- Main banner -->
    <section ref="mainBanner" class="content-section main-banner-wrapper">
      <BannerHomePage class="main-banner" />
    </section>

    <!-- Grid banners section -->
    <section ref="gridSection" class="content-section grid-section">
      <h1>Our Product</h1>
      <div class="grid-banner-wrapper">
        <BannerHomePage :showGridOnly="true" />
      </div>
    </section>

    <!-- Column banners section -->
    <section ref="columnSection" class="content-section column-section">
      <h1>Promotion</h1>
      <div class="column-banner-wrapper">
        <BannerHomePage :showColumnOnly="true" />
      </div>
    </section>

  </div>
</template>

<script setup>
import BannerHomePage from '@/components/Homepage-banner.vue'
import { ref, onMounted } from 'vue'

const mainBanner = ref(null)
const gridSection = ref(null)
const columnSection = ref(null)

onMounted(() => {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('animate')
      })
    },
    { threshold: 0.3 }
  )

  observer.observe(mainBanner.value)
  observer.observe(gridSection.value)
  observer.observe(columnSection.value)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Baloo+Da&family=Baloo+Tamma+2&display=swap');

.homepage-container {
  font-family: 'Baloo Da', cursive;
}

/* ================= CONTENT SECTIONS ================= */
.content-section {
  text-align: center;
  margin: 80px 0;
  opacity: 1;
}
.main-banner-wrapper{
  margin-top: 0;
}

.content-section h1 {
  font-size: 64px;
  font-family: 'Baloo Tamma 2', cursive;
  color: #6ec007;
  margin-bottom: 20px;
  opacity: 0;
  transform: translateY(30px);
}

/* ================= SIMPLE ABSTRACT ANIMATIONS ================= */
/* Main banner */
.main-banner-wrapper.animate .main-banner {
  animation: floatFade 1.5s ease-out forwards;
}

/* Grid section */
.grid-section.animate h1 {
  animation: floatFade 1.3s ease-out forwards;
  animation-delay: 0.2s;
}
.grid-section.animate .grid-banner-wrapper {
  animation: floatFade 1.5s ease-out forwards;
  animation-delay: 0.35s;
}

/* Column section */
.column-section.animate h1 {
  animation: floatFade 1.3s ease-out forwards;
  animation-delay: 0.2s;
}
.column-section.animate .column-banner-wrapper {
  animation: floatFade 1.5s ease-out forwards;
  animation-delay: 0.35s;
}

/* ================= KEYFRAMES ================= */
@keyframes floatFade {
  0% {
    opacity: 0;
    transform: translateY(30px) scale(0.95);
  }
  50% {
    transform: translateY(-10px) scale(1.02);
    opacity: 0.8;
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* ================= HOVER EFFECTS ================= */
.bannerhome-container .grid-item img,
.bannerhome-container .grid-item1 img {
  transition: transform 0.5s ease, box-shadow 0.5s ease;
}

.bannerhome-container .grid-item:hover img,
.bannerhome-container .grid-item1:hover img {
  transform: scale(1.05);
  box-shadow: 0 15px 25px rgba(0,0,0,0.15);
}
</style>
