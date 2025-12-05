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
        <button @click="addToFavorite(product, 'detail')">Add to Favorite</button>
        <button @click="addToCart">Add to Cart</button>
      </div>
    </section>
  </div>
  <div v-else>
    <p>Product not found.</p>
  </div>
</template>

<script lang="ts">
import { useCartStore } from '../stores/cart';
import { useFavoriteStore } from '../stores/favorite';
export default {
  name: 'ProductDetail',
  props: ['id'],
  data() {
    return {
      quantity: 1,
      product: null,
      mockProducts: [
        {
          id: '1',
          name: 'Brher Soup',
          price: '$8.10',
          images: ['brher1.jpg', 'brher2.jpg', 'brher3.jpg'],
          ingredients: [
            'Fish: 1 kg (cut into pieces)',
            'Pumpkin: 200 g (peeled, cubed)',
            'Mushrooms: 200 g (any type, sliced)',
            'Truffle: 100 g (sliced, seeds removed if large)',
            'Bass leaves: 100 g'
          ]
        },
        {
          id: '9',
          name: 'Amok',
          price: '$11.10',
          images: ['amok1.jpg', 'amok2.jpg'],
          ingredients: [
            'Fish: 500 g',
            'Coconut milk: 200 ml',
            'Kroeung paste: 50 g',
            'Egg: 1',
            'Banana leaves for steaming'
          ]
        }
      ]
    };
  },
  mounted() {
    this.loadProduct();
  },
  watch: {
    id() {
      this.loadProduct();
    }
  },
  methods: {
  loadProduct() {
    this.product = this.mockProducts.find(p => p.id === this.id);
  },

  addToFavorite() {
  const favorite = useFavoriteStore();

  favorite.addFavorite({
    id: this.product.id,
    name: this.product.name,
    image: this.product.images[0],
    price: Number(this.product.price.replace('$', '')) // convert string "$8.10"
    
  });

  this.$router.push('/favorite');   // redirect to Favorite page
},

  addToCart() {
    const cart = useCartStore();
    cart.addItem({
      id: this.product.id,
      name: this.product.name,
      image: this.product.images[0],
      price: Number(this.product.price.replace("$", "")),
      qty: this.quantity,
      unit: "set"
    });

    this.$router.push("/cart");
  }
}

};
</script>


<style scoped>
.product-detail-page {
  font-family: Arial, sans-serif;
  padding: 20px;
}

.product-detail {
  margin-top: 30px;
}
.image-gallery img {
  width: 150px;
  margin-right: 10px;
}
.ingredients ul {
  list-style: disc;
  margin-left: 20px;
}
.price {
  color: red;
  font-weight: bold;
}
.actions {
  margin-top: 10px;
}

</style>
