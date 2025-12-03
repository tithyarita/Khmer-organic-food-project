<template>
  <div>
    <h2>Your Cart</h2>
    <ul>
      <li v-for="item in cart.items" :key="item.id">
        {{ item.name }} - {{ item.price }} USD
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useCartStore } from '../stores/cart'

export default defineComponent({
  setup() {
    const cart = useCartStore()
    return { cart }
  }
})
</script>