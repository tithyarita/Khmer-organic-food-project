<template>
  <div>
    <Banner />
    <h1 class="Title">Feature Products</h1>
    <div class="products">
      <ProductCard
        v-for="item in products"
        :key="item.id"
        :product="item"
        :showCart="true"
        :showStock="true"
        :showFavorite="true"
        @add-to-cart="addToCart"
        @add-to-favorite="addToFavorite"
      />
    </div>
    
  </div>
</template>

<script setup lang="ts">
import Banner from '../components/Banner.vue'
import ProductCard from '../components/ProductCard.vue'
import { useCartStore } from '../stores/cart';

const products= [
        { id: 1, 
          name: 'Carrot', 
          price: 3, 
          unit: 'kg', 
          weight: 1,
          inStock: true, 
          rating: 4, 
          image: '/images/carrot.png' },

        { id: 2, 
          name: 'Cucumber', 
          price: 2, 
          unit: 'kg', 
          weight: 1,
          inStock: true, 
          rating: 3, 
          
          image: '/images/cucumber.png' },

        { id: 3, 
          name: 'Broccoli', 
          price: 5, 
          unit: 'kg', 
          weight: 1,
          inStock: true, 
          rating: 5, 
          image: '/images/broccoli.png' },

        { id: 4, 
          name: 'Cabbage', 
          price: 4,
          unit: 'kg', 
          weight: 1,
          inStock: true, 
          rating: 5, 
          image: '/images/cabbage.png' },

        { id: 5, 
          name: 'Potato', 
          price: 3, 
          unit: 'kg', 
          weight: 1,
          inStock: true, 
          rating: 5, 
          image: '/images/potato.png' },

        { id: 6, 
          name: 'Bell Pepper', 
          price: 2.5, 
          unit: 'kg', 
          weight: 1,
          inStock: true, 
          rating: 5, 
          image: '/images/bell_pepper.png' },

        { id: 7, 
          name: 'Onion', 
          price: 3,
          unit: 'kg', 
          weight: 1, 
          inStock: true, 
          rating: 2, 
          image: '/images/onion.png' },

        { id: 8, 
          name: 'Lettuce', 
          price: 4, 
          unit: 'kg', 
          weight: 1,
          inStock: true, 
          rating: 4, 
          image: '/images/lettuce.png' },

        { id: 9, 
          name: 'Cauliflower', 
          price: 3,
          unit: 'kg', 
          weight: 1, 
          inStock: false, 
          rating: 5, 
          image: '/images/cauliflower.png' }
      ]
function addToCart(product: any) {
  const cart = useCartStore();
  cart.addItem(product);
}
</script>

<style scoped>
.products {
  display: flex;
  gap: 2rem; /* 20px converted to rem */
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 2rem;
  margin-bottom: 3rem;
}
.Title {
  text-align: center;
  font-family: 'Baloo Da', cursive;
  font-size: 2.5rem;
  margin-top: 2rem;
  color: #548D0C;
}
</style>