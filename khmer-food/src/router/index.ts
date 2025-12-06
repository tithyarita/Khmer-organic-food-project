import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Vegetables from '../views/Vegetables.vue'
import Meats from '../views/Meats.vue'
import Sets from '../views/sets.vue'
import CartView from '../views/CartView.vue'
import FavoritePage from '../views/FavoritePage.vue'
import ProductDetail from '../views/ProductDetail.vue'

const routes: RouteRecordRaw[] = [
  { path: '/', component: HomeView },
  {
    path: '/category/vegetables',
    name: 'vegetables',
    component: Vegetables,
    meta: { title: 'GOOD FOOD STARTS WITH GOOD VEGETABLES' },
  },
  {
    path: '/category/meats',
    name: 'meats',
    component: Meats,
    meta: { title: 'YOUR SOURCE FOR SAFE CLEAN PREMIUM MEAT.' },
  },
  {
    path: '/category/sets',
    name: 'sets',
    component: Sets,
    meta: { title: "CAMBODIA'S SIGNATURE DISH SEASON'S BEST ON YOUR PLATE" },
  },
  { path: '/cart', name: 'Cart', component: CartView },
  { path: '/favorite', name: 'FavoritePage', component: FavoritePage },
  { path: '/product/:id', name: 'ProductDetail', component: ProductDetail, props: true },
  { path: '/blog', name: 'BlogView', component: () => import('../views/BlogView.vue') },
  { path: '/about', name: 'AboutView', component: () => import('../views/AboutView.vue') },
  { path: '/contact', name: 'ContactView', component: () => import('../views/ContactView.vue') },

  // Admin Layout with nested routes
  {
    path: '/admin',
    component: () => import('../components/Admindashbroad.vue'),
    children: [
      { path: '', redirect: '/admin/products' },
      {
        path: 'products',
        name: 'AdminProducts',
        component: () => import('../views/admin/AdminProducts.vue'),
      },
      {
        path: 'stocks',
        name: 'AdminStocks',
        component: () => import('../views/admin/AdminStocks.vue'),
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: () => import('../views/admin/AdminOrders.vue'),
      },
      {
        path: 'sales',
        name: 'AdminSales',
        component: () => import('../views/admin/AdminSales.vue'),
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('../views/admin/AdminUsers.vue'),
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const defaultTitle = 'Khmer Organic Food'
  document.title = (to.meta?.title as string) || defaultTitle
  next()
})

export default router
