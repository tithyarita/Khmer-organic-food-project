<template>
  <div>
    <Banner />
    <h1 class="Title">Feature Products</h1>
    <div class="products">
      <ProductCard
        v-for="item in products"
        :key="item.id"
        :product="item"
      />
    </div>
    
  </div>
</template>

<script>
import Banner from '../components/Banner.vue'
import ProductCard from '../components/ProductCard.vue'

export default {
  components: { Banner, ProductCard },
  data() {
    return {
      products: [
        { id: 1, 
          name: 'Carrot', 
          price: 3, 
          inStock: true, 
          rating: 4, 
          image: '/images/carrot.png' },

        { id: 2, 
          name: 'Cucumber', 
          price: 2, inStock: false, 
          rating: 3, 
          image: '/images/cucumber.png' },

        { id: 3, 
          name: 'Broccoli', 
          price: 5, 
          inStock: true, 
          rating: 5, 
          image: '/images/broccoli.png' },

        { id: 4, 
          name: 'Cabbage', 
          price: 5, 
          inStock: true, 
          rating: 5, 
          image: '/images/cabbage.png' },

        { id: 5, 
          name: 'Potato', 
          price: 5, 
          inStock: true, 
          rating: 5, 
          image: '/images/potato.png' },

        { id: 6, 
          name: 'Bell Pepper', 
          price: 5, 
          inStock: true, 
          rating: 5, 
          image: '/images/bell_pepper.png' },

        { id: 7, 
          name: 'Onion', 
          price: 5, 
          inStock: true, 
          rating: 5, 
          image: '/images/onion.png' },

        { id: 8, 
          name: 'Lettuce', 
          price: 5, 
          inStock: true, 
          rating: 5, 
          image: '/images/lettuce.png' },

        { id: 9, 
          name: 'Cauliflower', 
          price: 5, 
          inStock: true, 
          rating: 5, 
          image: '/images/cauliflower.png' }
      ]
    }
  }
}
</script>

<style scoped>
.products {
  display: flex;
  gap: 2rem; /* 20px converted to rem */
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 10rem;
}
.Title {
  text-align: center;
  font-family: 'Baloo Da', cursive;
  font-size: 2.5rem;
  margin-top: 2rem;
  color: #548D0C;
}
</style>