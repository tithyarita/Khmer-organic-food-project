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
import ReviewPage from '../views/ReviewPage.vue'
import ThankYouView from '../views/ThankYouView.vue'
import ItemRatingView from '../views/ItemRatingView.vue'
import ViewOrders from '../views/ViewOrders.vue'
import OrdersCenter from '../views/OrdersCenter.vue'
import OrderView from '../views/OrderView.vue'
import Delivery from '../views/Delivery.vue'

import { auth, db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'


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
  { path: '/review/:orderId', name: 'ReviewPage', component: ReviewPage, props: true },
  { path: '/thankyou/:orderId', name: 'ThankYou', component: ThankYouView, props: true },
  { path: '/orders', name: 'ViewOrders', component: ViewOrders },
  { path: '/rate/:itemId', name: 'ItemRating', component: ItemRatingView, props: true },
  { path: '/orders-center', name: 'OrdersCenter', component: OrdersCenter },
  { path: '/order/:id', name: 'OrderView', component: OrderView, props: true },
  { path: '/delivery', name: 'Delivery', component: Delivery },


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
  meta: { requiresAdmin: true },
  children: [
    { path: '', redirect: '/admin/sales' },
    { path: 'sales', name: 'AdminSales', component: () => import('../views/admin/AdminSales.vue') },
    { path: 'products', name: 'AdminProducts', component: () => import('../views/admin/AdminProducts.vue') },
    { path: 'stocks', name: 'AdminStocks', component: () => import('../views/admin/AdminStocks.vue') },
    { path: 'orders', name: 'AdminOrders', component: () => import('../views/admin/AdminOrders.vue') },
    { path: 'users', name: 'AdminUsers', component: () => import('../views/admin/AdminUsers.vue') },
    { path: 'blogs', name: 'AdminBlog', component: () => import('../views/admin/AdminBlog.vue') },
    { path: 'contact', name: 'AdminContact', component: () => import('../views/admin/AdminContact.vue') },
    { path: 'profile', name: 'AdminProfile', component: () => import('../views/admin/ProfileAdminView.vue') },

  ],
},

{
  path: '/admin/login',
  name: 'AdminLogin',
  component: () => import('../views/admin/AdminLogin.vue'),
  meta: { hideLayout: true }
}


]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// ---------------- GLOBAL NAV GUARD ----------------
router.beforeEach(async (to, from, next) => {
  const defaultTitle = 'Khmer Organic Food'
  document.title = (to.meta?.title as string) || defaultTitle

  const userStorage = getUserStorage()
  const firebaseUser = auth.currentUser

  // ---------------- USER AUTH PROTECTION ----------------
  if (to.meta?.requiresAuth && !userStorage) {
    return next('/login')
  }

  // ---------------- ADMIN PROTECTION ----------------
  if (to.meta?.requiresAdmin) {
    if (!userStorage || userStorage.role !== 'admin') {
      return next('/admin/login')
    }
  }

  // Prevent logged-in users from visiting login/signup
  if (
    (to.path === '/login' ||
      to.path === '/signup' ||
      to.path === '/loginSignup') &&
    userStorage
  ) {
    return next('/profile')
  }

  next()
})
export default router
