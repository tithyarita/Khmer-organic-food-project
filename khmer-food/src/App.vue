<template>
  <Menu />
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Menu from './components/Menu.vue'

export default defineComponent({
  name: 'App',
  components: {
    Menu
  }
})
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
}
</style>
