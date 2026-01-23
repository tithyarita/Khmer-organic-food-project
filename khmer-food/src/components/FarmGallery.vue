<template>
  <div class="farm-gallery">
    <h2>From Organic Farm to Your Table</h2>
    <p>We take pride in organic farming practices. Here's a glimpse of our farm.</p>
    <div class="gallery-images">
      <div class="gallery-item">
        <img src="/images/Vegplace.webp" alt="Farm photo 1" />
        <div class="overlay">Fresh Vegetables</div>
      </div>
      <div class="gallery-item">
        <img src="/images/Vegplace2.jpg" alt="Farm photo 2" />
        <div class="overlay"> Green Fields</div>
      </div>
      <div class="gallery-item">
        <img src="/images/meatplace.webp" alt="Farm photo 3" />
        <div class="overlay">Natural Meats</div>
      </div>
      <div class="gallery-item">
        <img src="/images/meatplace2.jpg" alt="Farm photo 3" />
        <div class="overlay">Quality Meats</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.farm-gallery {
  text-align: center;
  margin: 4rem 0;
  font-family: 'Baloo Da', cursive;
}

.farm-gallery h2 {
  font-size: 3rem;
  font-family: 'Baloo Tamma 2', cursive;
  color: #6ec007;
  margin-bottom: 1rem;
}

.farm-gallery p {
  font-size: 1.2rem;
  color: #555;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.gallery-images {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.gallery-item {
  position: relative;
  overflow: hidden;
  border-radius: 1.875rem;
  box-shadow: 0 0.625rem 1.25rem rgba(0, 0, 0, 0.15);
  width: 350px;
  height: 250px;
  cursor: pointer;
}

.gallery-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.gallery-item:hover img {
  transform: scale(1.1);
}

.overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 1rem;
  text-align: center;
  font-size: 1.5rem;
  font-family: 'Baloo Bhai', cursive;
  opacity: 0;
  transition: opacity 0.5s ease;
}

.gallery-item:hover .overlay {
  opacity: 1;
}
</style>
