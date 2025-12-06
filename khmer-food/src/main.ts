import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import api from './services/api'

// Make Axios available globally

createApp(App).use(router).mount('#app')
const app = createApp(App)
app.config.globalProperties.$api = api
app.use(createPinia())
app.use(router)
app.mount('#app')
