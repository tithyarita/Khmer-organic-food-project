<template>
  <div class="homepage-container">
  
    <!-- Main banner -->
    <BannerHomePage />

    <!-- Grid banners section -->
    <section class="content-section">
      <h1>Our Product</h1>
      <BannerHomePage :showGridOnly="true" />
    </section>

    <!-- Column banners section -->
    <section class="content-section">
      <h1>Promotion</h1>
      <BannerHomePage :showColumnOnly="true" />
    </section>
  </div>

  
</template>


<script setup>
import { ref } from 'vue'
import Menu from '@/components/Menu.vue'
import BannerHomePage from '@/components/Homepage-banner.vue'

const searchQuery = ref('')
</script>


<style scoped>
/* Apply background + font to the main container instead of body */
.homepage-container {
  margin: 0;
  padding: 0;
  min-height: 100vh;
  font-family: 'Baloo Da', cursive;
}

.content-section {
  text-align: center;
  margin-top: 0px;
}

.content-section h1 {
  font-size: 64px;
  font-family: 'Baloo Tamma 2', cursive;
  color: #6ec007;
  margin-bottom: 0px;
  margin-top: 0;
}

.categories-section {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 40px 20px;
  margin-top: 60px;
}
</style>
