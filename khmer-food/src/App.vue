<template>
  <div>
    <!-- Header only if showLayout is true -->
    <Menu v-if="showLayout" class="header" />

    <main :class="{ 'with-layout': showLayout }">
      <router-view />
    </main>

    <!-- Footer only if showLayout is true -->
    <Footer v-if="showLayout" class="footer" />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import Menu from './components/Menu.vue'
import Footer from './components/Footer.vue'

export default defineComponent({
  name: 'App',
  components: {
    Menu,
    Footer,
  },
  setup() {
    const route = useRoute()

    // Hide header/footer for admin routes and login/signup pages
    const showLayout = computed(() => {
      return !(
        route.meta.hideLayout ||
        route.path.startsWith('/admin')
      )
    })

    return { showLayout }
  },
})
</script>

<style>
html,
body {
  width: 100%;
  max-width: 100%;
  overflow-x: hidden;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: inherit;
}

body {
  font-family: Arial, sans-serif;
  padding: 0;
  margin: 0;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

.footer {
  position: static;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

.with-layout {
  padding-top: 3rem; /* adjust to header height */
  /* padding-bottom: 60px; */ /* adjust to footer height */
}
</style>
