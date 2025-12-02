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
          image: '/images/Carrot.png' },

        { id: 2, 
          name: 'Bananas', 
          price: 2, inStock: false, 
          rating: 3, 
          image: '/images/bananas.jpg' },

        { id: 3, 
          name: 'Mangoes', 
          price: 5, 
          inStock: true, 
          rating: 5, 
          image: '/images/mangoes.jpg' },

        { id: 4, 
          name: 'Mangoes', 
          price: 5, 
          inStock: true, 
          rating: 5, 
          image: '/images/mangoes.jpg' },

        { id: 5, 
          name: 'Mangoes', 
          price: 5, 
          inStock: true, 
          rating: 5, 
          image: '/images/mangoes.jpg' },

        { id: 6, 
          name: 'Mangoes', 
          price: 5, 
          inStock: true, 
          rating: 5, 
          image: '/images/mangoes.jpg' },

        { id: 7, 
          name: 'Mangoes', 
          price: 5, 
          inStock: true, 
          rating: 5, 
          image: '/images/mangoes.jpg' }
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
}
.Title {
  text-align: center;
  font-family: 'Baloo Da', cursive;
  font-size: 2.5rem;
  margin-top: 2rem;
  color: #548D0C;
}
</style>