<template>
  <div class="actions">
    <div class="action-box">Add Stock ➕</div>
    <div class="action-box">Update Stock ⚙️</div>
    <div class="action-box">Delete Stock 🗑️</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AdminStocks',
})
</script>

<style scoped>
.actions {
  margin-top: 20px;
}
.action-box {
  background: white;
  padding: 18px 25px;
  margin-bottom: 15px;
  font-size: 20px;
  color: #53b400;
  font-weight: bold;
  border-radius: 4px;
}
</style>
