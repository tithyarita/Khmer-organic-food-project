import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import vegetables from '../views/vegetables.vue'
import meats from '../views/meats.vue'
import sets from '../views/sets.vue'

const routes = [
  { path: '/', component: HomeView },

  { path: '/category/vegetables', 
    name: 'vegetables', 
    component: vegetables,
    meta: {
      title: 'GOOD FOOD STARTS WITH GOOD VEGETABLES',
      image: '/images/vegBanner.png',
      bg: '#F5F5F5'
    }
  },
  { path: '/category/meats',
    name: 'meats', 
    component: meats,
    meta: { 
      title: 'Meats - Khmer Organic Food',
      image: '',
      bg: ''
    }
  },
  { path: '/category/sets', 
    name: 'sets', 
    component: sets,
    meta: { 
      title: 'Sets - Khmer Organic Food',
      image: '',
      bg: ''
    }
  },

]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
