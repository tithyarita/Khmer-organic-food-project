<template>
  <div class="food-card" :style="{ backgroundColor: bgColor }">
    <div class="container" :class="{ reverse: reverse }">

      <!-- IMAGE -->
      <div class="image-box">
        <div class="circle" :style="{ borderColor: borderColor }">
          <img :src="img" alt="Food Photo" />
        </div>
      </div>

      <!-- TEXT -->
      <div class="text-box">
        <h2 class="title">{{ title }}</h2>
        <p class="desc">{{ description }}</p>
      </div>

    </div>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    title: String,
    description: String,
    img: String,
    bgColor: { type: String, default: "#ffffff" },
    reverse: { type: Boolean, default: false },

    // Circle border color
    borderColor: { type: String, default: "#1c6f32" }
  }
};
</script>

<style scoped>
/* Import fonts from Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@400;700;800&display=swap');

.food-card {
  width: 100%;
  padding: 3.125rem 0; /* 50px → 3.125rem */
}

.container {
  width: 85%;
  margin: auto;
  display: flex;
  align-items: center;
  gap: 3.75rem; /* 60px → 3.75rem */
}

.container.reverse {
  flex-direction: row-reverse;
}

/* IMAGE BOX */
.image-box {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
}

/* Circle frame */
.circle {
  width: 14.375rem; /* 230px → 14.375rem */
  height: 14.375rem;
  border-radius: 50%;
  overflow: hidden;
  border: 0.375rem solid; /* 6px → 0.375rem */
  display: flex;
  justify-content: center;
  align-items: center;
}

.circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* TEXT SECTION */
.text-box {
  flex: 1 1 auto;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title {
  font-family: 'Baloo 2', cursive;
  font-size: 2rem; /* 24px → 1.5rem */
  font-weight: 800;
  color: #000000;
  margin-bottom: 0rem;
}

.desc {
  font-family: 'Baloo 2', cursive;
  font-size: 1.125rem; /* 12px → 0.75rem */
  font-weight: 400;
  color: #000000;
  line-height: 1.7;
  white-space: normal;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

/* Extra polish when reversed */
.container.reverse .text-box {
  text-align: left;
  padding-right: 1.25rem; /* 20px → 1.25rem */
}

.container:not(.reverse) .text-box {
  padding-left: 1.25rem; /* 20px → 1.25rem */
}

/* Mobile responsive */
@media (max-width: 768px) {
  .container,
  .container.reverse {
    flex-direction: column !important;
    text-align: center;
  }

  .text-box {
    padding: 0 !important;
  }

  .circle {
    width: 12.5rem; /* 200px → 12.5rem */
    height: 12.5rem;
  }
}
</style>
