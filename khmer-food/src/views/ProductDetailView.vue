<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useCartStore } from '../stores/cart';
import { useFavoriteStore } from '../stores/favorite';

// Pinia stores
const cart = useCartStore();
const favorite = useFavoriteStore();

// Get route params
const route = useRoute();
const productId = ref(route.params.id as string);

// Mock product list (replace with API or store later)
const mockProducts = [
  {
    id: '1',
    name: 'Brher Soup',
    price: '$8.10',
    images: ['/images/brher_soup.png', '/images/brher_soup2.png'],
    ingredients: [
      'Fish: 1 kg (cut into pieces)',
      'Pumpkin: 200 g (peeled, cubed)',
      'Mushrooms: 200 g (any type, sliced)',
      'Truffle: 100 g (sliced)',
      'Bass leaves: 100 g'
    ]
  },
  {
    id: '2',
    name: 'Amok',
    price: '$11.10',
    images: ['/images/amok.png', '/images/amok2.png'],
    ingredients: [
      'Fish: 500 g',
      'Coconut milk: 200 ml',
      'Kroeung paste: 50 g',
      'Egg: 1',
      'Banana leaves for steaming'
    ]
  }
];

// Reactive product and quantity
const product = ref<any | null>(null);
const quantity = ref(1);

// Load product by id
function loadProduct() {
  product.value = mockProducts.find(p => p.id === productId.value) || null;
}

// Add to cart
function addToCart() {
  if (product.value) {
    cart.addItem({ ...product.value, quantity: quantity.value });
    alert(`Added ${quantity.value} x ${product.value.name} to cart!`);
  }
}

// Add to favorites
function addToFavorite() {
  if (product.value && !favorite.items.find(p => p.id === product.value.id)) {
    favorite.addFavorite(product.value);
    alert(`Added ${product.value.name} to favorites!`);
  }
}

// Watch for route changes
watch(() => route.params.id, (newId) => {
  productId.value = newId as string;
  loadProduct();
});

// Initial load
onMounted(() => {
  loadProduct();
});
</script>

<template>
  <div v-if="product" class="product-detail">
    <h1>KHMER DETAIL FOOD</h1>
    <h2>{{ product.name }}</h2>

    <!-- Image Gallery -->
    <div class="image-gallery">
      <img v-for="(img, index) in product.images" :key="index" :src="img" :alt="product.name" />
    </div>

    <!-- Ingredients -->
    <section class="ingredients">
      <h3>Ingredients:</h3>
      <ul>
        <li v-for="(item, index) in product.ingredients" :key="index">{{ item }}</li>
      </ul>
    </section>

    <!-- Price and Actions -->
    <section class="purchase-section">
      <p class="price">PRICE: {{ product.price }}</p>
      <div class="actions">
        <input type="number" v-model="quantity" min="1" />
        <button @click="addToFavorite">Add to Favorite</button>
        <button @click="addToCart">Add to Cart</button>
      </div>
    </section>
  </div>

  <div v-else class="not-found">
    <p>Product not found.</p>
  </div>
</template>

<style scoped>
.product-detail {
  font-family: 'Baloo Da', cursive;
  padding: 20px;
}
h1 {
  text-align: center;
  font-size: 2rem;
  color: #548D0C;
}
h2 {
  text-align: center;
  margin-bottom: 1rem;
}
.image-gallery {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 1.5rem;
}
.image-gallery img {
  width: 150px;
  border-radius: 0.25rem;
}
.ingredients {
  margin-bottom: 1.5rem;
}
.ingredients h3 {
  margin-bottom: 0.5rem;
}
.ingredients ul {
  list-style: disc;
  margin-left: 1.5rem;
}
.price {
  color: #e91e63;
  font-weight: bold;
  font-size: 1.2rem;
}
.actions {
  margin-top: 1rem;
  display: flex;
  gap: 1rem;
}
.actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: bold;
}
.actions button:hover {
  opacity: 0.9;
}
.not-found {
  text-align: center;
  padding: 2rem;
  color: #999;
}
</style>
