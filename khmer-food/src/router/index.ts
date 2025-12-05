import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import vegetables from '../views/vegetables.vue'
import meats from '../views/meats.vue'
import sets from '../views/sets.vue'
import CartView from '../views/CartView.vue'
import FavoritePage from '../views/FavoritePage.vue'
import ProductDetail from '../views/ProductDetail.vue'



const routes = [
  { path: '/', component: HomeView },

  { path: '/category/vegetables',
    name: 'vegetables',
    component: vegetables,
    meta: {
      title: 'GOOD FOOD STARTS WITH GOOD VEGETABLES',
      image: '/images/vegBanner.jpeg',
      bg: '#F5F5F5'
    }
  },
  { path: '/category/meats',
    name: 'meats',
    component: meats,
    meta: {
      title: 'YOUR SOURCE FOR SAFE CLEAN PREMIUM MEAT.',
      image: '/images/meatBanner.jpg',
      bg: ''
    }
  },
  { path: '/category/sets',
    name: 'sets',
    component: sets,
    meta: {
      title: 'CAMBODIA’S SIGNATURE DISH SEASON’S BEST ON YOUR PLATE',
      image: '/images/setBanner.png',
      bg: ''
    }
  },
  {
  path: '/cart',
  name: 'Cart',
  component: CartView
  },
  {
  path: '/favorite',
  name: 'FavoritePage',
  component: FavoritePage,
  },

  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    meta:{
    title: 'KHMER DETAIL FOOD',
    image: '/images/mint-isLeft.png',
    bg: ''
  },
    props : true
  },

  {
    path: '/cart',
    name: 'Cart',
    component: CartView
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('../views/BlogView.vue')
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/AboutView.vue')
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('../views/ContactView.vue')
  },

]
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
