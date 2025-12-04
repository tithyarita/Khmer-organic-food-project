<template>
  <div class="set-page">
    <CategorySection 
      v-for="(cat, index) in categories"
      :key="index"
      :title="cat.title"
      :items="cat.items"
    />
  </div>
</template>

<script setup>
import CategorySection from './CategorySection.vue'

const categories = [
  {
    title: "Soup",
    items: [
      { name: "Brher Soup", price: "8.10", image: "/images/brher_soup.png" },
      { name: "Korko Soup", price: "9.60", image: "/images/korko_soup.png" },
      { name: "Mjo Soup", price: "7.10", image: "/images/mju_soup.png" },
      { name: "Sour Soup", price: "8.70", image: "/images/sour_soup.png" }
    ]
  },
  {
    title: "Fried (Chha)",
    items: [
      { name: "Chha Traukon", price: "5.10", image: "/images/chhaTrakuon.png" },
      { name: "Chha Vegetables", price: "4.70", image: "/images/chhaVegetables.png" },
      { name: "Spicy Chicken", price: "7.20", image: "/images/spicyChicken.png" },
      { name: "Chha Kngay", price: "4.50", image: "/images/chhaKhgey.png" }
    ]
  },
  {
    title: "Steamed",
    items: [
      { name: "Amok", price: "11.10", image: "/images/amok.png" },
      { name: "Brhok", price: "9.30", image: "/images/brhok.png" },
      { name: "Brhok Ktiss", price: "9.70", image: "/images/brhokKtis.png" },
      { name: "Stream Fish", price: "6.80", image: "/images/streamFish.png" }
    ]
  }
]
</script>

<style scoped>
.set-page {
  padding: 1rem;
 
}
</style>
