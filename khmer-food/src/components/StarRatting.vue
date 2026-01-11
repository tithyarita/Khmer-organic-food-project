<template>
  <div>
    <span
      v-for="star in 5"
      :key="star"
      @click="$emit('update', star)"
      :class="{ active: star <= value }"
    >★</span>
  </div>
</template>

<script>
export default {
  props: ['value']
};
</script>

<style scoped>
span {
  font-size: 24px;
  cursor: pointer;
  color: #ddd;
}
.active {
  color: gold;
}
</style>
