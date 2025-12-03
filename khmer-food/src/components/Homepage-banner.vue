<template>
  <div class="bannerhome-container">
    <!-- Main banner -->
    <div v-if="!showGridOnly && !showColumnOnly" class="banner-image">
      <img src="/images/banner1-home.png" alt="Home Banner" />
    </div>

    <!-- Grid banners -->
    <div v-if="showGridOnly" class="gridbanner">
      <div class="grid-item large">
        <img src="/images/banner2-home.png" alt="Banner 2" />
      </div>
      <div class="grid-column">
        <div class="grid-item">
          <img src="/images/banner3-home.png" alt="Banner 3" />
        </div>
        <div class="grid-item">
          <img src="/images/banner4-home.png" alt="Banner 4" />
        </div>
      </div>
    </div>

    <!-- Column banners -->
    <div v-if="showColumnOnly" class="columnbanner">
      <div class="grid-column1">
        <div class="grid-item1">
          <img src="/images/Banner5-home.png" alt="Banner 5" />
        </div>
        <div class="grid-item1">
          <img src="/images/Banner6-home.png" alt="Banner 6" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "BannerHomePage",
  props: {
    showGridOnly: {
      type: Boolean,
      default: false
    },
    showColumnOnly: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style scoped>
.bannerhome-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30px;
  /* padding-bottom: 90px; */
  border-radius: 20px;
}

/* Main banner */
.banner-image img {
  width: 100%;
  max-width: 1100px;
  border-radius: 15px;
  object-fit: cover;
}

/* Grid banners */
.gridbanner {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  width: 100%;
  max-width: 1100px;
  margin-top: 20px;
}

.grid-item {
  overflow: hidden;
}

.grid-item.large {
  grid-row: span 2;
}

.grid-item img {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  display: block;
  border-radius: 30px;
}
.grid-column1{
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  padding-bottom: 80px;
  /* max-width: 1100px; */
}
.grid-item1 img {
  border-radius: 30px;
  width: 100%;
}

/* Column banners */
.columnbanner .grid-column {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 1100px;
}

.columnbanner .grid-column .grid-item img {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  border-radius: 20px;
}
</style>
