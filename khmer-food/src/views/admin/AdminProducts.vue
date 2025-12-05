<template>
  <AdminDashboard>
    <!-- Optional: content here or just rely on <router-view /> -->
    <div class="actions">
      <div class="action-box">
        <span>Add Product</span>
        <span class="icon">➕</span>
      </div>
      <div class="action-box">
        <span>Update Product</span>
        <span class="icon">⚙️</span>
      </div>
      <div class="action-box">
        <span>Delete Product</span>
        <span class="icon">🗑️</span>
      </div>
    </div>
  </AdminDashboard>
</template>

<script lang="ts" setup>
import AdminDashboard from '@/components/AdminDashboard.vue'
</script>

<style scoped>
.actions {
  margin-top: 40px;
}

.action-box {
  background: white;
  padding: 18px 25px;
  margin-bottom: 20px;
  font-size: 20px;
  color: #53b400;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}

.action-box .icon {
  font-size: 26px;
}
</style>
