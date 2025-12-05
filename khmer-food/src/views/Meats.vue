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
import Banner from '../components/Banner.vue';
import ProductCard from '../components/ProductCard.vue';
import { useCartStore } from '../stores/cart';
import { useFavoriteStore } from '../stores/favorite';

const cart = useCartStore();
const favorite = useFavoriteStore();

const products = [
<<<<<<< HEAD
  { id: 1, name: 'Chicken Chick', price: 3, unit: 'kg', weight: 1, inStock: true, rating: 5, image: '/images/chicken_chick.png' },
  { id: 2, name: 'Beef', price: 10, unit: 'kg', weight: 1, inStock: true, rating: 5, image: '/images/beef.png' },
  { id: 3, name: 'Pork', price: 5, unit: 'kg', weight: 1, inStock: true, rating: 5, image: '/images/pork.png' },
  { id: 4, name: 'Lamb', price: 9, unit: 'kg', weight: 1, inStock: true, rating: 5, image: '/images/lamb.png' },
  { id: 5, name: 'Chicken Wings', price: 5, unit: 'kg', weight: 1, inStock: true, rating: 5, image: '/images/chicken_wing.png' },
  { id: 6, name: 'Chicken Drumsticks', price: 5, unit: 'kg', weight: 1, inStock: true, rating: 5, image: '/images/chicken_dumpstick.png' },
  { id: 7, name: 'Fish', price: 3, unit: 'kg', weight: 1, inStock: true, rating: 5, image: '/images/fish.png' },
  { id: 8, name: 'Salmon', price: 15, unit: 'kg', weight: 1, inStock: true, rating: 5, image: '/images/salmon.png' },
  { id: 9, name: 'Eggs', price: 2, unit: 'set', weight: 1, inStock: false, rating: 4, image: '/images/egg.png' }
=======
  { id: 1, name: 'Chicken Chick', price: 5.50, unit: 'kg', weight: 1, inStock:true, rating:5, image: '/images/chicken_chick.png' },
  { id: 2, name: 'Beef', price: 8.70, unit: 'kg', weight: 1, inStock:true, rating:5, image: '/images/beef.png' },
  { id: 3, name: 'Pork', price: 6.80, unit: 'kg', weight: 1, inStock:true, rating:5, image: '/images/pork.png' },
  { id: 4, name: 'Lamb', price: 9.40, unit: 'kg', weight: 1, inStock:true, rating:5, image: '/images/lamb.png' },
  { id: 5, name: 'Chicken Wings', price: 5.20, unit: 'kg', weight: 1, inStock:true, rating:5, image: '/images/chicken_wing.png' },
  { id: 6, name: 'Chicken Drumsticks', price: 7.40, unit: 'kg', weight: 1, inStock:true, rating:5, image: '/images/chicken_dumpstick.png' },
  { id: 7, name: 'Fish', price: 7.50, unit: 'kg', weight: 1, inStock:true, rating:5, image: '/images/fish.png' },
  { id: 8, name: 'Salmon', price: 19.50, unit: 'kg', weight: 1, inStock:true, rating:5, image: '/images/salmon.png' },
  { id: 9, name: 'Eggs', price: 2.50, unit: 'set', weight: 1,inStock:false, rating:4, image: '/images/egg.png' }
>>>>>>> d9813e448e3f2c385031f90fee3f68f781ec76ac
];

function addToCart(product: any) {
  cart.addItem(product);
}

function addToFavorite(product: any) {
  if (!favorite.items.find(p => p.id === product.id)) {
    favorite.addFavorite(product);
  }
}
</script>

<style scoped>
.products {
  display: flex;
  gap: 2rem;
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
