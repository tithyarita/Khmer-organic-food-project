<template>
  <div class="progress">
    <div
      v-for="step in steps"
      :key="step.key"
      :class="['step', { active: isActive(step.key) }]"
    >
      {{ step.label }}
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ status: string }>()

const steps = [
  { key: 'paid', label: 'Paid' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'delivering', label: 'Delivering' },
  { key: 'completed', label: 'Completed' }
]

const isActive = (step: string) => {
  const order = ['paid', 'preparing', 'delivering', 'completed']
  return order.indexOf(step) <= order.indexOf(props.status)
}
</script>

<style scoped>
.progress {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.step {
  flex: 1;
  text-align: center;
  padding: 6px;
  border-radius: 20px;
  background: #eee;
  font-size: 0.75rem;
}

.step.active {
  background: #ff6f61;
  color: white;
  font-weight: bold;
}
</style>
