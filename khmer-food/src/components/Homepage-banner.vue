<template>
  <div class="bannerhome-container">

    <!-- Main banner -->
    <div v-if="!showGridOnly && !showColumnOnly" class="banner-image">
      <button class="shop-now">Shop Now</button>
    </div>

    <!-- Grid banners -->
    <div v-if="showGridOnly" class="gridbanner">

      <!-- Banner 2 → Soup Set (center text) -->
      <router-link
        class="grid-item large abstract text-center"
        :to="{ name: 'sets', params: { category: 'soup' } }"
      >
        <img src="/images/banner2-home.png" alt="Soup Banner" />
        <div class="overlay-text black">
          Khmer Set Food<br />
        </div>
      </router-link>

      <div class="grid-column">

        <!-- Banner 3 → Vegetable (top text) -->
        <router-link
          class="grid-item abstract text-top"
          :to="{ name: 'vegetables', params: { category: 'vegetables' } }"
        >
          <img src="/images/banner3-home.png" alt="Vegetables Banner" />
          <div class="overlay-text green">
            Vegetable
          </div>
        </router-link>

        <!-- Banner 4 → Meat (bottom text) -->
        <router-link
          class="grid-item abstract text-bottom"
          :to="{ name: 'meats', params: { category: 'meat' } }"
        >
          <img src="/images/banner4-home.png" alt="Meat Banner" />
          <div class="overlay-text white">
            Meat
          </div>
        </router-link>

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
    showGridOnly: { type: Boolean, default: false },
    showColumnOnly: { type: Boolean, default: false },
  },
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Baloo+Da&family=Baloo+Bhai&display=swap');

/* ================= MAIN CONTAINER ================= */
.bannerhome-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* ================= HERO BANNER ================= */
.banner-image {
  width: 100%;
  height: 92vh;
  background: url('/images/Food-banner.png') center / cover no-repeat;
  position: relative;
}

.shop-now {
  position: absolute;
  bottom: 50px;
  left: 150px;
  padding: 12px 25px;
  background: #6ec007;
  color: white;
  font-size: 20px;
  border-radius: 30px;
  border: none;
  cursor: pointer;
  font-family: 'Baloo Da', cursive;
}

.shop-now:hover {
  background-color: white;
  color: #57a600;
  transition: background-color 0.3s ease;
}

/* ================= GRID BANNERS ================= */
.gridbanner {
  display: grid;
  grid-template-columns: 635px 638px;
  gap: 24px;
  width: 90%;
  max-width: 1275px;
  margin-top: 20px;
}

.grid-column {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* ================= ABSTRACT CARD STYLE ================= */
.grid-item {
  position: relative;
  overflow: hidden;
  border-radius: 30px;
  box-shadow: inset 0 0 25px 5px rgba(0, 0, 0, 0.2);
}

.grid-item.large {
  height: 422px; /* Banner2 height */
  width: 635px;
}

.grid-column .grid-item {
  height: 200px; /* Banner3 & 4 height */
  width: 500px;
}

.grid-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

/* Abstract overlay effect */
.grid-item.abstract::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0,0,0,0.05),
    rgba(0,0,0,0.35)
  );
}

/* Zoom effect on hover */
.grid-item:hover img {
  transform: scale(1.08);
}

/* ================= TEXT OVERLAY ================= */
.overlay-text {
  position: absolute;
  left: 30%;
  transform: translateX(-50%);
  z-index: 2;
  font-family: 'Baloo Bhai', cursive;
  font-size: 46px;
  font-weight: 700;
  line-height: 1.1;
  text-align: center;
}

/* Position modifiers */
.text-center .overlay-text {
  top: 30%;
  left: 40%;
  transform: translate(-50%, -50%);
}

.text-top .overlay-text {
  top: 80px;
  transform: translateX(-50%);
}

.text-bottom .overlay-text {
  bottom: 80px;
  left:20%;
  transform: translateX(-50%);
}

/* Colors */
.overlay-text.black { color: #000000; }
.overlay-text.green { color: #2C3A06; }
.overlay-text.white { color: #ffffff; }

/* ================= COLUMN BANNERS ================= */
.columnbanner {
  width: 90%;
  max-width: 1275px;
}

.grid-column1 {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 80px;
}

.grid-item1 {
  border-radius: 30px;
  overflow: hidden;
  box-shadow: inset 0 0 0 5px black;
}

.grid-item1 img {
  width: 100%;
  display: block;
}
</style>
