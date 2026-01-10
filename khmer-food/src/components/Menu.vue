<template>
  <header class="menu">
    <!-- LEFT: Logo + App Name -->
    <div class="left-container">
      <router-link to="/" class="logo-link">
        <img src="/images/Logo.png" alt="Logo" />
      </router-link>
      <span class="app-name">Khmer Organic Food</span>
    </div>

    <!-- CENTER: Navigation -->
    <nav class="navigation">
      <router-link to="/" class="nav-link">Home</router-link>

      <!-- Category Dropdown -->
      <div class="dropdown">
        <span class="nav-link">Category</span>
        <div class="dropdown-content">
          <router-link to="/category/vegetables" class="dropdown-link">Vegetables</router-link>
          <router-link to="/category/meats" class="dropdown-link">Meats</router-link>
          <router-link to="/category/sets" class="dropdown-link">Sets</router-link>
        </div>
      </div>

      <router-link to="/blog" class="nav-link">Blog</router-link>
      <router-link to="/contact" class="nav-link">Contact</router-link>
      <router-link to="/about" class="nav-link">About</router-link>
    </nav>

    <!-- RIGHT: Search Box + Icons -->
    <div class="right-side">
      <div class="search-wrap">
        <!-- <select v-model="searchTarget" class="search-select">
          <option value="products">Products</option>
          <option value="blog">Blog</option>
        </select> -->
        <input v-model="searchTerm" @keyup.enter="doSearch" type="text" placeholder="Search..." class="search-box" />
        <!-- <button class="search-btn" @click="doSearch">Search</button> -->
      </div>

      <!-- Favorite Icon with Badge -->
      <router-link to="/favorite" class="icon-link cart-container">
        <i class="fa-regular fa-heart"></i>
        <span v-if="totalFavorites > 0" class="cart-badge">{{ totalFavorites }}</span>
      </router-link>

      <!-- Cart Icon with Badge -->
      <router-link to="/cart" class="icon-link cart-container">
        <i class="fa-solid fa-cart-shopping"></i>
        <span v-if="totalItems > 0" class="cart-badge">{{ totalItems }}</span>
      </router-link>

      <!-- Notifications (combined) -->
      <!-- <router-link to="/notifications" class="icon-link cart-container">
        <i class="fa-regular fa-bell"></i>
        <span v-if="totalNotifications > 0" class="cart-badge">{{ totalNotifications }}</span>
      </router-link> -->

      <router-link to="/profile" class="icon-link">
        <i class="fa-regular fa-user"></i>
      </router-link>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'
import { useFavoriteStore } from '../stores/favorite'
// removed isLoggedIn import — we load stores regardless to keep header badges in sync

export default defineComponent({
  name: 'AppMenu',
  setup() {
    const cartStore = useCartStore()
    const favoriteStore = useFavoriteStore()

    onMounted(async () => {
      try {
        // Always attempt to load persisted favorites and cart (works for logged-in users
        // and will noop for guests). This keeps the header badges in sync across pages.
        await favoriteStore.loadFavorites()
      } catch (e) {
        console.warn('Could not load favorites on mount', e)
      }

      try {
        await cartStore.loadCart()
      } catch (e) {
        console.warn('Could not load cart on mount', e)
      }
    })

    const totalItems = computed(() =>
      cartStore.items.reduce((sum, i) => sum + (i.qty || 1), 0)
    )

    const totalFavorites = computed(() => favoriteStore.items.length)

    const totalNotifications = computed(() => totalItems.value + totalFavorites.value)

    const searchTerm = ref('')
    const searchTarget = ref('products')
    const router = useRouter()

    function doSearch() {
      const q = (searchTerm.value || '').trim()
      if (!q) return
      if (searchTarget.value === 'blog') {
        router.push({ path: '/blog', query: { q } })
      } else {
        // default: go to vegetables category with query (category pages read query)
        router.push({ path: '/category/vegetables', query: { q } })
      }
    }

    return { totalItems, totalFavorites, totalNotifications, searchTerm, searchTarget, doSearch }
  },
})
</script>


<style scoped>
.menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #6ec007;
  padding: 0.5rem 3rem;
  font-family: 'Baloo Da', cursive;
  width: 100%;
  height: 3rem;
}

.left-container {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-link img {
  height: 2rem;
  width: auto;
}

.app-name {
  color: whitesmoke;
  font-size: 1.3rem;
  font-weight: 400;
}

.navigation {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  margin: 0 auto;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 100;
  cursor: pointer;
  position: relative;
}

.dropdown {
  position: relative;
}

.dropdown-content {
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  min-width: 10rem;
  border-radius: 0.6rem;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  opacity: 0;
  transform: translateY(10px);
  pointer-events: auto;
  transition: all 0.25s ease;
  z-index: 100;
}

.dropdown-content .dropdown-link {
  color: #333;
  padding: 0.8rem 1.2rem;
  font-size: 0.85rem;
  display: block;
  text-decoration: none;
}

.dropdown-content .dropdown-link:hover {
  background: #f4f4f4;
}

.dropdown:hover .dropdown-content {
  opacity: 1;
  transform: translateY(0);
}

.right-side {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-box {
  padding: 0.25rem 0.5rem;
  border-radius: 2rem;
  border: 1px solid #ccc;
  outline: none;
  font-size: 0.9rem;
  font-weight: 200;
  color: black;
  font-family: 'Baloo Da', cursive;
  background: white;
  width: 17rem;
  height: 1.75rem;
}

.search-wrap { display: flex; gap: .4rem; align-items: center }
.search-select { border-radius: 0.6rem; padding: 0.25rem; border: 1px solid #ccc }
.search-btn { background: #fff; border: 1px solid #ccc; padding: 6px 10px; border-radius: 8px; cursor: pointer }

.icon-link {
  color: white;
  font-size: 0.9rem;
  transition: transform 0.2s ease, opacity 0.2s ease;
  position: relative;
}

.icon-link:hover {
  transform: scale(1.15);
  opacity: 0.9;
}

/* BADGE */
.cart-container {
  position: relative;
}

.cart-badge {
  position: absolute;
  top: -5px;
  right: -10px;
  background: red;
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 50%;
  min-width: 18px;
  text-align: center;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .menu {
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem 1.5rem;
    gap: 1rem;
  }

  .left-container {
    flex-direction: row;
    gap: 0.5rem;
  }

  .navigation {
    flex-wrap: wrap;
    margin: 0;
    gap: 1rem;
  }

  .nav-link {
    font-size: 0.8rem;
  }

  .right-side {
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .search-box {
    width: 100%;
  }
}
</style>
