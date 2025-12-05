<template>
  <div>
    <BlogBanner />
    <FoodSection />
  </div>
</template>

<script lang="ts">
import BlogBanner from "@/components/BlogBanner.vue";
import FoodSection from "@/components/FoodSection.vue";

export default {
  components: {
    BlogBanner,
    FoodSection
  }
};
</script>
