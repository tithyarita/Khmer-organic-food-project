<template>
  <main class="blog-page">
    <BlogBanner />
    <BlogList />
  </main>
</template>

<script setup lang="ts">
import BlogBanner from "@/components/BlogBanner.vue"
import BlogList from "@/components/BlogList.vue"
</script>

<style scoped>
.blog-page{
  background:#f3fbf2;
  min-height:100vh;
  padding-bottom:4rem;
}
</style>
