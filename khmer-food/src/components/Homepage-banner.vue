<template>
  <div class="bannerhome-container">
    <!-- Main banner -->
    <div v-if="!showGridOnly && !showColumnOnly" class="banner-image">
      <button class="shop-now">Shop Now</button>
    </div>


    <!-- Grid banners -->
    <div v-if="showGridOnly" class="gridbanner">
      <!-- Banner 2 → Soup set -->
      <div class="grid-item large">
        <router-link :to="{ name: 'sets', params: { category: 'soup' } }">
          <img src="/images/banner2-home.png" alt="Soup Banner" />
        </router-link>
      </div>

      <div class="grid-column">
        <!-- Banner 3 → Vegetables set -->
        <div class="grid-item">
          <router-link :to="{ name: 'vegetables', params: { category: 'vegetables' } }">
            <img src="/images/banner3-home.png" alt="Vegetables Banner" />
          </router-link>
        </div>

        <!-- Banner 4 → Meat set -->
        <div class="grid-item">
          <router-link :to="{ name: 'meats', params: { category: 'meat' } }">
            <img src="/images/banner4-home.png" alt="Meat Banner" />
          </router-link>
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
  name: 'BannerHomePage',
  props: {
    showGridOnly: {
      type: Boolean,
      default: false,
    },
    showColumnOnly: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style scoped>
.bannerhome-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.banner-image {
  width: 100%;
  height: 90vh;
  background-image: url('/images/Food-banner.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
/* Shop Now button styling */
.shop-now {
  padding: 12px 25px;
  background: #6ec007;
  color: white;
  font-size: 20px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-family: 'Baloo Da', cursive;

  position: absolute;
  bottom: 50px;   /* like “below” */
  left: 150px;    /* similar to your margin-left */
}
.shop-now:hover {
  background-color: white;
  color: #57a600;
  transition: background-color 0.3s ease;
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
.grid-column1 {
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
