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
import { ref, onMounted } from 'vue'
import Banner from '../components/Banner.vue'
import CategorySection from '../components/SetCategory.vue'
import api from '@/services/api'

const categories = ref([])

onMounted(async () => {
  const res = await api.get('/sets')
  categories.value = res.data
})
</script>


<style scoped>
.set-page {
  margin: 1rem 0;
}
</style>