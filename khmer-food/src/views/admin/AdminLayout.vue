<template>
  <div class="admin-layout">
    <!-- No menu, no footer -->
    <router-view />
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.admin-layout {
  min-height: 100vh;
  background: #f5f5f5;
}
</style>
