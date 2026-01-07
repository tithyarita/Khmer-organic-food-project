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
<<<<<<< HEAD
import ProfileView from '../views/ProfileView.vue'
import Checkout from '../views/CheckoutView.vue'
import LoginAdmin from '../components/LoginAdmin.vue'
=======
import ProfileView from '../views/ProfileUserView.vue'

import { getUserStorage } from '../loginstorage'
>>>>>>> 0ab8a5d0043afe1ddd6f4f25e7006e35f88d1098

const routes: RouteRecordRaw[] = [
  { path: '/', component: HomeView },

  {
    path: '/category/vegetables',
    name: 'vegetables',
    component: Vegetables,
    meta: {
      title: 'GOOD FOOD STARTS WITH GOOD VEGETABLES',
      image: '/images/vegBanner.jpeg',
      bg: '#F5F5F5',
    },
  },

  {
    path: '/category/meats',
    name: 'meats',
    component: Meats,
    meta: {
      title: 'YOUR SOURCE FOR SAFE CLEAN PREMIUM MEAT.',
      image: '/images/meatBanner.jpg',
      bg: '#FFF5E5',
    },
  },

  {
    path: '/category/sets',
    name: 'sets',
    component: Sets,
    meta: {
      title: "CAMBODIA'S SIGNATURE DISH SEASON'S BEST ON YOUR PLATE",
      image: '/images/setBanner.png',
      bg: '#F0F8FF',
    },
  },

  { path: '/cart', name: 'Cart', component: CartView },
  { path: '/favorite', name: 'FavoritePage', component: FavoritePage },

  { path: '/product/:id', name: 'ProductDetail', component: ProductDetail, props: true },

  { path: '/blog', name: 'BlogView', component: () => import('../views/BlogView.vue') },
  { path: '/about', name: 'AboutView', component: () => import('../views/AboutView.vue') },
  { path: '/contact', name: 'ContactView', component: () => import('../views/ContactView.vue') },

  /* ADMIN */
  {
    path: '/admin',
    component: () => import('../components/Admindashbroad.vue'),
    children: [
      { path: '', redirect: '/admin/sales' },
      {
        path: 'sales',
        name: 'AdminSales',
        component: () => import('../views/admin/AdminSales.vue'),
      },
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
        path: 'users',
        name: 'AdminUsers',
        component: () => import('../views/admin/AdminUsers.vue'),
      },
    ],
  },

  {
    path: '/loginSignup',
    name: 'Login/SignUp',
    component: LoginSignUpView,
    meta: { hideLayout: true },
  },

  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { hideLayout: true },
  },

  {
    path: '/signup',
    name: 'SignUp',
    component: SignUpView,
    meta: { hideLayout: true },
  },

  /* ✅ ADDED PROFILE (NO NAME CHANGES) */
  {
<<<<<<< HEAD
  path: '/ProfileUser',
  name: 'ProfileUser',
  component: () => import('../views/ProfileUserView.vue'),
},

=======
    path: '/profile',
    name: 'Profile',
    component: ProfileView,
    meta: { requiresAuth: true },
  },
>>>>>>> 0ab8a5d0043afe1ddd6f4f25e7006e35f88d1098

  {
    path: '/ProductDetail/:id',
    name: 'ProductDetail',
    component: ProductDetail,
    props: true,
<<<<<<< HEAD
    meta: { title: 'KHMER DETAIL FOOD',
    image: '/images/detailbanner.jpg',
    bg: '#f9f5f5ff'},
  },

  {
  path: '/checkout',
  name: 'Checkout',
  component: Checkout,
  meta: { title: 'Checkout - Khmer Organic Food' }
  },


=======
    meta: {
      title: 'KHMER DETAIL FOOD',
      image: '/images/detailbanner.jpg',
      bg: '#F5F5F5',
    },
  },
>>>>>>> 0ab8a5d0043afe1ddd6f4f25e7006e35f88d1098
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

/* ✅ ADD LOGIN CHECK (TITLE LOGIC KEPT) */
router.beforeEach((to, from, next) => {
  const defaultTitle = 'Khmer Organic Food'
  document.title = (to.meta?.title as string) || defaultTitle

  const user = getUserStorage()

  // Protect profile
  if (to.meta?.requiresAuth && !user) {
    next('/login')
    return
  }

  // Block login/signup if already logged in
  if ((to.path === '/login' || to.path === '/signup') && user) {
    next('/profile')
    return
  }

  next()
})

export default router
