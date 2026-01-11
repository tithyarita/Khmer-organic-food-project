import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import api from './services/api'

const app = createApp(App)

// Add Pinia
const pinia = createPinia()
app.use(pinia)

// Add router
app.use(router)

// Make Axios (api) available globally
app.config.globalProperties.$api = api

// Mount app
app.mount('#app')
