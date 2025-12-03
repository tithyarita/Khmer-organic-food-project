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

<script>
import BannerHomePage from "@/components/Homepage-banner.vue";

export default {
  name: "HomePage",
  components: {
    BannerHomePage
  }
};
</script>

<style scoped>
.content-section {
  text-align: center;
  margin-top: 60px;
}

.content-section h1 {
  font-size: 64px;
  font-family: 'Baloo Tamma 2', cursive;
  color: #6EC007;
  margin-bottom: 20px;
}

.categories-section {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 40px 20px;
  margin-top: 60px;
}
</style>
