import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import vegetables from '../views/vegetables.vue'
import meats from '../views/meats.vue'
import sets from '../views/sets.vue'
import CartView from '../views/CartView.vue' 
<<<<<<< HEAD
import FavoritePage from '../views/FavoritePage.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
=======
import ProductDetail from '../views/ProductDetail.vue'
>>>>>>> d9813e448e3f2c385031f90fee3f68f781ec76ac
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
<<<<<<< HEAD
  {
  path: '/cart',
  name: 'Cart',
  component: CartView
},
  {
  path: '/favorite',
  name: 'FavoritePage',
  component: FavoritePage
  },
  {
  path: '/product/:id',
  name: 'ProductDetail',
  component: ProductDetailView
},
=======
>>>>>>> d9813e448e3f2c385031f90fee3f68f781ec76ac

  {
    path: '/product/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    props : true
  },

  {
    path: '/cart',
    name: 'Cart',
    component: CartView
  }

]
const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
