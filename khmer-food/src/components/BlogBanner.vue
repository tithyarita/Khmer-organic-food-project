<template>
  <section class="cute-banner">
    <img src="/forBlog/BlogBanner.png" class="banner-bg" />
    <div class="cute-overlay"></div>
    <div class="cute-content">
      <div class="text-content">
        <h1>Our Lovely Blog</h1>
        <p>
          Discover tasty Cambodian recipes,
          sweet farm stories
          and fresh ideas from nature.
        </p>
      </div>
      <!-- <router-link to="/blog" class="read-more">Read More</router-link> -->
    </div>
  </section>
</template>

<style scoped>
.cute-banner {
  position: relative;
  height: 23.75rem; /* 380px */
  margin: 2rem 4%;
  border-radius: 1.875rem; /* 30px */
  overflow: hidden;
  box-shadow: 0 1.5625rem 3.125rem rgba(0, 0, 0, 0.15);
}

.banner-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cute-overlay {
  position: absolute;
  inset: 0;
  /* Optional subtle overlay effect */
  background: rgba(255, 255, 255, 0.1);
}

.cute-content {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 0;
}

.text-content {
  flex-grow: 1; /* text takes up remaining space */
  display: flex;
  flex-direction: column;
  justify-content: center; /* vertically center text */
  align-items: center;
  gap: 0.5rem;
}

.cute-content h1 {
  font-size: 3rem;
  margin: 0;
  font-weight: 900;
  background: linear-gradient(135deg, #27720a, #5fcf65);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.cute-content p {
  max-width: 42.5rem;
  margin-top: 0.5rem;
  font-size: 1.05rem;
  line-height: 1.6;
  color: black;
  white-space: pre-wrap; /* preserves line breaks from admin input */
}

/* Button pinned at bottom */
.read-more {
  margin-top: auto; /* pushes button to bottom */
  padding: 0.75rem 2rem;
  border-radius: 1.25rem;
  background: #27720a;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
}

.read-more:hover {
  transform: translateY(-3px);
}

/* Responsive styles */
@media (max-width: 48rem) {
  .cute-banner {
    height: 17.5rem; /* 280px */
    margin: 1rem;
    border-radius: 1.25rem; /* 20px */
  }

  .cute-content h1 {
    font-size: 2rem;
  }

  .cute-content p {
    font-size: 0.95rem;
  }

  .read-more {
    font-size: 0.9rem;
    padding: 0.5rem 1.5rem;
  }
}
</style>
