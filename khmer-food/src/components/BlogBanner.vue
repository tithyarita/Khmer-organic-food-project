<template>
  <section class="cute-banner">
    <img src="/forBlog/BlogBanner.png" class="banner-bg" />
    <div class="cute-overlay"></div>
    <div class="cute-content">
      <span class="cute-tag">🌱 Khmer Food</span>
      <h1>Our Lovely Blog</h1>
      <p>
        Discover tasty Cambodian recipes, sweet farm stories and fresh ideas from nature.
      </p>
    </div>
  </section>
</template>

<style scoped>
.cute-banner{
  position: relative;
  height: 23.75rem;
  margin: 2rem 4%;
  border-radius: 1.875rem;
  overflow: hidden;
  box-shadow: 0 1.5625rem 3.125rem rgba(0,0,0,0.15);
}

.banner-bg{
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cute-overlay{
  position: absolute;
  inset: 0;
}

.cute-content{
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: black;
  padding: 2rem;
}

.cute-tag{
  background: rgba(0, 0, 0, 0.2);
  padding: 0.5rem 1.125rem;
  border-radius: 62.4375rem;
  font-size: 0.85rem;
  margin-bottom: 1rem;
  letter-spacing: 0.0625rem;
}

.cute-content h1{
  font-size: 3rem;
  margin: 0;
  font-weight: 900;
  background: linear-gradient(135deg,#27720a,#5fcf65);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.cute-content p{
  max-width: 42.5rem;
  margin-top: 1rem;
  font-size: 1.05rem;
  line-height: 1.6;
  color: black;
}

@media (max-width: 48rem){
  .cute-banner{
    height: 17.5rem;
    margin: 1rem;
    border-radius: 1.25rem;
  }

  .cute-content h1{
    font-size: 2rem;
  }

  .cute-content p{
    font-size: 0.95rem;
  }
}
</style>
