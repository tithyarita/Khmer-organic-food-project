 <template>
  <header class="menu">
    <!-- LEFT: Logo + App Name -->
    <div class="left-container">
      <router-link to="/admin" class="logo-link">
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
      <!-- Search Box -->
      <input
        type="text"
        placeholder="Search..."
        class="search-box"
        v-model="searchText"
        @input="emitSearch"
      />

      <router-link to="#" class="icon-link">
        <i class="fa-solid fa-magnifying-glass"></i>
      </router-link>


      <router-link to="/favorite" class="icon-link">
        <i class="fa-regular fa-heart"></i>
      </router-link>
      <router-link to="/cart" class="icon-link">
        <i class="fa-solid fa-cart-shopping"></i>
      </router-link>
      <router-link to="/ProfileUser" class="icon-link">
        <i class="fa-regular fa-user"></i>
      </router-link>
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Menu',
})
</script>

<style scoped>

.menu {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #2b7a0b;
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
  font-size: 1.30rem;
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
  position: relative;
  cursor: pointer;
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
  position: static;
}

.dropdown-content .dropdown-link:hover {
  background: #f4f4f4;
}

.dropdown-content .dropdown-link::after {
  content: none;
}

.dropdown-content a:hover {
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


.icon-link {
  color: white;
  font-size: 0.9rem;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.icon-link:hover {
  transform: scale(1.15);
  opacity: 0.9;
}


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
