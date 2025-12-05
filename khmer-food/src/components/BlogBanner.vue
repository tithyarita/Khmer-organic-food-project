<template>
  <section class="banner">
    <img src="/forBlog/BlogBanner.png" class="banner-img" alt="Khmer Food Banner" />

    <div class="banner-text">
      <h2 class="text-green">Khmer</h2>

      <div class="blog-title">
        <img class="imBanner" src="/forBlog/leaf.png" alt="Icon" />
        <h1 class="text-main">Blog</h1>
      </div>

      <h2 class="text-green">Food</h2>
    </div>
  </section>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Baloo+Tammudu+2:wght@400;500;600;700&display=swap');
</style>

<style scoped>
.banner {
  position: relative;
  width: 100%;
}

.banner-img {
  width: 100%;
  height: 20.625rem;
  object-fit: cover;
}

.banner-text {
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.blog-title {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.text-green {
  color: #59b500;
  font-size: 2.5rem;
  margin: 0;
  font-weight: 700;
  font-family: "Baloo Tammudu 2", sans-serif;
  line-height: 2rem;
}

.text-main {
  color: #2d7600;
  font-size: 5rem;
  margin: 0;
  font-weight: 800;
  font-family: "Baloo Tammudu 2", sans-serif;
  line-height: 0.5rem;
}

.imBanner {
  width: 5rem;
  height: 5rem;
  margin-bottom: 1rem;
}
</style>
