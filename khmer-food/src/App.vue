<template>
  <div>
    <Menu class="header" />
    <main>
      <router-view />
    </main>
    <Footer class="footer" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Menu from './components/Menu.vue'
import Footer from './components/Footer.vue'

export default defineComponent({
  name: 'App',
  components: {
    Menu,
    Footer,
  },
})
</script>

<style>
html,
body {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden; /* ⛔ NO LEFT/RIGHT SCROLL */
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: inherit; /* keeps all elements inside screen */
}

body {
  font-family: Arial, sans-serif;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

.footer {
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

main {
  padding-top: 80px; /* adjust to header height */
  padding-bottom: 60px; /* adjust to footer height */
}
</style>
