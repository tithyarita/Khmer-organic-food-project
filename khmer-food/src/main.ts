import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia';

createApp(App).use(router).mount('#app')
const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount('#app');