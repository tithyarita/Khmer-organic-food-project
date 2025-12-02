<template>
  <div>
    <Menu class="header" />
    <main>
      <router-view />
    </main>
    <!-- <Footer class="footer" /> -->
  </div>

</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Menu from './components/Menu.vue'
import Footer from './components/Footer.vue';

export default defineComponent({
  name: 'App',
  components: {
    Menu,
    Footer
  } 
})
</script>

<style>
body {
  margin: 0;
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
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

main {
  padding-top: 80px;    /* adjust to header height */
  padding-bottom: 60px; /* adjust to footer height */
}
</style>
