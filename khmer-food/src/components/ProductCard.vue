<template>
  <div class="card">
    <!-- Header -->
    <div class="card-header">
      <div class="stock-status">
        <i :class="product.inStock ? 'fa-solid fa-check-circle' : 'fa-solid fa-times-circle'"></i>
        <span>{{ product.inStock ? 'In Stock' : 'Out of Stock' }}</span>
      </div>
      <div class="favorite" @click="toggleFavorite">
        <i :class="isFavorite ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"></i>
      </div>
    </div>

    <!-- Center Image -->
    <div class="card-image">
      <img :src="product.image || '/default-product.jpg'" :alt="product.name" />
    </div>

    <!-- Footer -->
    <div class="card-footer">
      <!-- Rating -->
      <div class="rating">
        <i v-for="n in 5" :key="n"
           :class="n <= product.rating ? 'fa-solid fa-star' : 'fa-regular fa-star'"></i>
      </div>

      <!-- Name + Price -->
      <div class="info-row">
        <span class="product-name">{{ product.name }}</span>
        <span class="product-price">${{ product.price }}/Kg</span>
      </div>

      <!-- Add to Cart -->
      <!-- <button class="add-to-cart">Add to Cart</button> -->
      <router-link to="/cart">
      <button class="add-to-cart">
        <i class="fa-solid fa-cart-shopping"></i> Add to Cart
      </button>
    </router-link>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    product: Object
  },
  data() {
    return {
      isFavorite: false
    }
  },
  methods: {
    toggleFavorite() {
      this.isFavorite = !this.isFavorite
    }
  }
}
</script>

<style scoped>
.card {
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  padding: 1rem;
  width: 390px;
  height: 500px;
  box-shadow: 0 0.25rem 0.5rem rgba(0,0,0,0.1);
  font-family: 'Baloo Da', cursive;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.stock-status {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
  color: #2e7d32;
}

.stock-status i {
  color: #2e7d32;
}

.favorite i {
  font-size: 1.2rem;
  color: #e91e63; /* red heart */
  cursor: pointer;
  transition: transform 0.2s ease;
}

.favorite i:hover {
  transform: scale(1.2);
}

/* Image */
.card-image {
  text-align: center;
  /* margin: 0.1rem 0; */
}

.card-image img {
  max-width: 270px;
  height: 240px;
  border-radius: 0.25rem;
  align-items: center;
}

/* Footer */
.card-footer {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.rating {
  color: #FFD700; /* gold stars */
  font-size: 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  font-weight: 600;
  
}

.add-to-cart {
  background-color: #6EC007;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 0.50rem;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s ease;
  width: 100%;
  height: 3rem;
  font-size: 1.2rem;
}

.add-to-cart:hover {
  background-color: #4CAF50;
}
.product-price {
  color: #6EC007;
}
</style>