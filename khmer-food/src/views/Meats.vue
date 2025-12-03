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
          name: 'Chicken Chick',
          price: 3,
          inStock: true,
          rating: 4,
          image: '/images/chicken_chick.png' },

        { id: 2,
          name: 'Beef',
          price: 2, inStock: false,
          rating: 3,
          image: '/images/beef.png' },

        { id: 3,
          name: 'Pork',
          price: 5,
          inStock: true,
          rating: 5,
          image: '/images/pork.png' },

        { id: 4,
          name: 'Lamb',
          price: 5,
          inStock: true,
          rating: 5,
          image: '/images/lamb.png' },

        { id: 5,
          name: 'Chicken Wings',
          price: 5,
          inStock: true,
          rating: 5,
          image: '/images/chicken_wing.png' },

        { id: 6,
          name: 'Chicken Drumsticks',
          price: 5,
          inStock: true,
          rating: 5,
          image: '/images/chicken_dumpstick.png' },

        { id: 7,
          name: 'Fish',
          price: 5,
          inStock: true,
          rating: 5,
          image: '/images/fish.png' },

        { id: 8,
          name: 'Salmon',
          price: 5,
          inStock: true,
          rating: 5,
          image: '/images/salmon.png' },

        { id: 9,
          name: 'Eggs',
          price: 5,
          inStock: true,
          rating: 5,
          image: '/images/egg.png' }

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
