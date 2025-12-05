<template>
  <div>
    <Banner />

    <div class="set-page">
      <CategorySection 
        v-for="(cat, index) in categories"
        :key="index"
        :title="cat.title"
        :items="cat.items"
      />
    </div>
  </div>
</template>

<script setup>
import Banner from '../components/Banner.vue'
import CategorySection from '../components/SetCategory.vue'

import { useRoute } from 'vue-router'

const route = useRoute()
const category = route.params.category


const categories = [
  {
    title: "Soup",
    items: [
      { id:1, name: "Brher Soup", price: "8.10", image: "/images/brher_soup.png" },
      { id:2, name: "Korko Soup", price: "9.60", image: "/images/korko_soup.png" },
      { id:3, name: "Mjo Soup", price: "7.10", image: "/images/mju_soup.png" },
      { id:4, name: "Sour Soup", price: "8.70", image: "/images/sour_soup.png" }
    ]
  },
  {
    title: "Fried (Chha)",
    items: [
      { id:5, name: "Chha Traukon", price: "5.10", image: "/images/chhaTrakuon.png" },
      { id:6, name: "Chha Vegetables", price: "4.70", image: "/images/chhaVegetables.png" },
      { id:7, name: "Spicy Chicken", price: "7.20", image: "/images/spicyChicken.png" },
      { id:8,name: "Chha Kngay", price: "4.50", image: "/images/chhaKhgey.png" }
    ]
  },
  {
    title: "Steamed",
    items: [
      { id:9, name: "Amok", price: "11.10", image: "/images/amok.png" },
      { id:10, name: "Brhok", price: "9.30", image: "/images/brhok.png" },
      { id:11, name: "Brhok Ktiss", price: "9.70", image: "/images/brhokKtis.png" },
      { id:12,name: "Stream Fish", price: "6.80", image: "/images/streamFish.png" }
    ]
  }
]
</script>

<style scoped>
.set-page {
  margin: 1rem 0;
}
</style>