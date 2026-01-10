import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Vegetables from '../views/Vegetables.vue'
import Meats from '../views/Meats.vue'
import Sets from '../views/sets.vue'
import CartView from '../views/CartView.vue'
import FavoritePage from '../views/FavoritePage.vue'
import ProductDetail from '../views/ProductDetail.vue'
import LoginSignUpView from '../views/LoginSignUpView.vue'
import LoginView from '../views/LoginView.vue'
import SignUpView from '../views/SignUpView.vue'
import ProfileView from '../views/ProfileUserView.vue'
import Checkout from '../views/CheckoutView.vue'
import AboutView from '../views/AboutView.vue'
import ContactView from '../views/ContactView.vue'
import BlogView from '../views/BlogView.vue'

import { getUserStorage } from '../loginstorage'

const routes: RouteRecordRaw[] = [
  // ---------------- USER ROUTES ----------------
  { path: '/', component: HomeView },
  { path: '/category/vegetables', name: 'vegetables', component: Vegetables, meta: { title: 'KHMER VEGETABLES FOOD', image: '/images/vegBanner.jpeg', bg: '#0a0a0aff' } },
  { path: '/category/meats', name: 'meats', component: Meats, meta: { title: 'KHMER MEATS FOOD', image: '/images/meatBanner.jpg', bg: '#0a0a0aff' } },
  { path: '/category/sets', name: 'sets', component: Sets, meta: { title: 'KHMER SETS FOOD', image: '/images/setBanner.png', bg: '#0a0a0aff' } },
  { path: '/cart', name: 'Cart', component: CartView },
  { path: '/favorite', name: 'FavoritePage', component: FavoritePage },
  { path: '/product/:id', name: 'ProductDetail', component: ProductDetail, props: true, meta: { title: 'KHMER DETAIL FOOD', image: '/images/detailbanner.jpg', bg: '#0a0a0aff' } },
  { path: '/checkout', name: 'Checkout', component: Checkout },
  { path: '/about', name: 'About', component: AboutView },
  { path: '/contact', name: 'Contact', component: ContactView },
  { path: '/blog', name: 'Blog', component: BlogView },

  // Login / Signup
  { path: '/loginSignup', name: 'LoginSignUp', component: LoginSignUpView, meta: { hideLayout: true } },
  { path: '/login', name: 'Login', component: LoginView, meta: { hideLayout: true } },
  { path: '/signup', name: 'SignUp', component: SignUpView, meta: { hideLayout: true } },

  // Profile (protected)
  { path: '/profile', name: 'Profile', component: ProfileView, meta: { requiresAuth: true } },

  // ---------------- ADMIN ROUTES ----------------
  {
    path: '/admin',
    component: () => import('../components/Admindashbroad.vue'),
    children: [
      { path: '', redirect: '/admin/sales' },
      { path: 'sales', name: 'AdminSales', component: () => import('../views/admin/AdminSales.vue') },
      { path: 'products', name: 'AdminProducts', component: () => import('../views/admin/AdminProducts.vue') },
      { path: 'stocks', name: 'AdminStocks', component: () => import('../views/admin/AdminStocks.vue') },
      { path: 'orders', name: 'AdminOrders', component: () => import('../views/admin/AdminOrders.vue') },
      { path: 'users', name: 'AdminUsers', component: () => import('../views/admin/AdminUsers.vue') },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// ---------------- GLOBAL NAV GUARD ----------------
router.beforeEach((to, from, next) => {
  const defaultTitle = 'Khmer Organic Food'
  document.title = (to.meta?.title as string) || defaultTitle

  const user = getUserStorage()

  // ---------------- USER PROTECTION ----------------
  if (to.meta?.requiresAuth && !user) {
    return next('/login')
  }

  // Prevent logged-in users from visiting login/signup
  if ((to.path === '/login' || to.path === '/signup' || to.path === '/loginSignup') && user) {
    return next('/profile')
  }

  next()
})

export default router
