<template>
  <div class="product-detail-page">
    <Banner />

    <!-- ✅ PRODUCT DETAIL -->
    <div v-if="product" class="product-detail">
      <div class="product-layout">

        <!-- LEFT -->
        <div class="left-section">
          <h2 class="dish-name">{{ product.name }}</h2>

          <div class="image-gallery">
            <img
              v-for="(img, index) in product.images"
              :key="index"
              :src="img"
              :alt="product.name"
            />
          </div>

          <div class="price-quantity-row">
            <div class="price">
              <template v-if="product.discount && product.discount > 0">
                <span class="old-price">
                  ${{ product.price }}/{{ product.unit }}
                </span>
                <span class="new-price">
                  ${{ (product.price - (product.price * product.discount) / 100).toFixed(2) }}/{{ product.unit }}
                  <span class="discount-text">(-{{ product.discount }}%)</span>
                </span>
              </template>

              <template v-else>
                <span class="new-price">
                  ${{ product.price }}/{{ product.unit }}
                </span>
              </template>
            </div>

            <div class="quantity-selector">
              <button @click="quantity--" :disabled="quantity <= 1">-</button>
              <input type="number" v-model="quantity" min="1" />
              <button @click="quantity++">+</button>
            </div>
          </div>
        </div>

        <!-- RIGHT -->
        <div class="right-section">
          <h3 class="ingredients-title">
            To do this food we need Ingredients as below:
          </h3>
          <ul class="ingredients-list">
            <li v-for="(item, index) in product.ingredients" :key="index">
              • {{ item }}
            </li>
          </ul>
        </div>
      </div>

      <!-- ACTION BUTTONS -->
      <div class="actions">
        <button @click="addToFavorite">Add to Favorite</button>
        <button @click="addToCart">Add to Cart</button>
      </div>
    </div>

    <!-- ❌ PRODUCT NOT FOUND -->
    <div v-else>
      <p>Product not found.</p>
    </div>
    <!-- ========================= REVIEW SECTION ========================= -->
  

    <!-- <div v-if="reviews.length" class="review-section">
      <h3>
        ⭐ {{ averageRating }} / 5 ({{ totalReviews }} reviews)
      </h3>
      
      <div v-for="r in reviews" :key="r.orderId" class="review-item">
        <small class="review-meta">
          {{
            r.createdAt?.seconds
              ? new Date(r.createdAt.seconds * 1000).toLocaleDateString()
              : ''
          }}
        </small>

        <div class="stars">
          <span v-for="n in 5" :key="n" :class="{ filled: n <= r.rating }">★</span>
        </div>
        <p>{{ r.comment }}</p>
      </div>
    </div>

    <div v-else>
      <p>No reviews yet.</p>
    </div> -->

    
    <div v-if="reviews.length" class="review-section">
      <h3>
        ⭐ {{ averageRating }} / 5 ({{ totalReviews }} reviews)
      </h3>

      <div v-for="r in reviews" :key="r.id" class="review-item">
            <div class="review-header">
              <strong>{{ r.userName }}</strong>
              <small>
                {{
                  r.createdAt?.seconds
                    ? new Date(r.createdAt.seconds * 1000).toLocaleDateString()
                    : ''
                }}
              </small>
            </div>

            <div class="stars">
              <span v-for="n in 5" :key="n" :class="{ filled: n <= r.rating }">★</span>
            </div>

            <p>{{ r.comment }}</p>
      </div>
    </div>

    <div v-else>
      <p>No reviews yet.</p>
    </div>



  </div>
</template>


<script lang="ts">

import Banner from '../components/Banner.vue';
import { useCartStore } from '../stores/cart';
import { useFavoriteStore } from '../stores/favorite';
import { collection, query, where, orderBy, getDocs } from "firebase/firestore"
import { db } from "../firebase"

type Review = {
  id: string
  rating: number
  comment: string
  userId: string
  userName?: string
  createdAt?: any
}


export default {
  name: 'ProductDetail',
  components: { Banner },
  props: ['id'],

  data() {
    return {
      quantity: 1,
      product: null,

      // newRating: 0,
      // newComment: '',
      // reviewsByProduct: {},
      reviews: [] as Review[],
      averageRating: 0,
      totalReviews: 0,

      // Your product list stays the same
      mockProducts: [
        {
          id: '1',
          name: 'Brher Soup',
          price: '8.10',
          images: ['/images/brher1.png', '/images/brher2.png', '/images/brher3.png'],
          ingredients: [
            'Fish: 1 kg (Cut into pieces)',
            'Pumpkin: 200 g (peeled, cubed)',
            'Mushrooms: 200 g (any type, sliced)',
            'Truffle: 100 g (sliced)',
            'Bass leaves: 100 g'
          ]
        },
        {
          id: '2',
          name: 'Korko Soup',
          price: '9.60',
          images: ['/images/korko1.png', '/images/korko2.png', '/images/korko3.png'],
          ingredients: [
            'Fish or Pork: 1 kg (Cut into pieces)',
            'Papaya: 300 g',
            'Moringa leaves: 200 g',
            'Bass leaves: 300 g',
            'Pumpkin: 100 g ',
            'Eggplant: 100 g'           
          ]
        },
        {
          id: '3',
          name: 'Mju Soup',
          price: '7.10',
          images: ['/images/mju1.png', '/images/mju2.png', '/images/mju3.png'],
          ingredients: [
            'Beef: 0.5 kg ',
            'Scallions: 300g',
            'Peppers:0.05g',
            'Lemongrass: 100g',
            'Garlic: 50g',
            'Fennel: 50g',
            'Ripe tamarind: 50g',
          ]
        },
        {
          id: '4',
          name: 'Sour Soup',
          price: '8.70',
          images: ['/images/sour1.png', '/images/sour2.png', '/images/sour3.png'],
          ingredients: [
            'Chicken: 0.5 kg',
            'Lemongrass: 3 stalks',
            'Ginger: 3 slices',
            'Garlic: 5 cloves',
            'Lemon: 1 piece ',
          ]
        },
        {
          id: '5',
          name: 'Chha Trakuon',
          price: '5.10',
          images: ['/images/trakuon1.png', '/images/trakuon2.png', '/images/trakuon3.png'],
          ingredients: [
            'Chicken: 0.4 kg',
            'Garlic:  5 cloves',
            'Trakuon: 500 g',          
          ]
        },
        {
          id: '6',
          name: 'Chha Vegetables',
          price: '4.70',
          images: ['/images/vegetables1.png', '/images/vegetables2.png', '/images/vegetables3.png'],
          ingredients: [
            'Pork: 0.5 kg',
            'Carrot: 200 g',
            'Cauliflower: 200 g',
            'Broccoli: 200 g',
            'Bell pepper: 100 g',
            'Onion: 100 g',
            'Garlic: 5 cloves'
          ]
        },
        {
          id: '7',
          name: 'Spicy Chicken',
          price: '7.20',
          images: ['/images/chicken1.png', '/images/chicken2.png', '/images/chicken3.png'],
          ingredients: [
            'Chicken: 1 kg (Cut into pieces)',
            'Garlic: 5 cloves',
            'Peppers: 0.05g',
            'Lemongrass: 100g',
            'Fennel: 50g',
            'Ripe tamarind: 50g',
          ]
        },
        {
          id: '8',
          name: 'Chha Khgey',
          price: '4.50',
          images: ['/images/khgey1.png', '/images/khgey2.png', '/images/khgey3.png'],
          ingredients: [
            'Chicken: 1 kg',
            'Garlic: 5 cloves',
            'Ginger: 3 slices',
            'Garlic leaves:10g',            
            
          ]
        },
        {
          id: '10',
          name: 'Brhok',
          price: '9.30',
          images: ['/images/brhok1.png', '/images/brhok2.png', '/images/brhok3.png'],
          ingredients: [
            'Brhok: 200g',
            'Pork: 0.5kg',
            'Garlic: 5 cloves',
            'Peppers: 0.05g',
            'Egg: 3pieces',
          ]
        },
        {
          id: '11',
          name: 'Brhok Ktis',
          price: '9.70',
          images: ['/images/brhokktis1.png', '/images/brhokktis2.png', '/images/brhokktis3.png'],
          ingredients: [
            'Pork: 0.5 kg',
            'Brhok: 200g',
            'Coconut milk: 200 ml',
            'Garlic: 5 cloves',
            'Peppers: 0.05g',
            'Peanut: 100g',            
          ]
        },
        {
          id: '12',
          name: 'Stream Fish',
          price: '6.80',
          images: ['/images/streamfish1.png', '/images/streamfish2.png', '/images/streamfish3.png'],
          ingredients: [
            'Fish: 1 kg',
            'Peppers: 0.05g',
            'Garlic leaves:10g',
            'Carrot: 200g',
          ]
          
        },
        {
          id: '9',
          name: 'Amok',
          price: '11.10',
          images: ['/images/ahmok1.png', '/images/ahmok2.png', '/images/ahmok3.png'],
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
    this.fetchReviews();
  },

  watch: {
    id() {
      this.loadProduct();
       this.fetchReviews();
    }
  },
  methods: {
  async loadProduct() {
  try {
    const res = await fetch('http://localhost:3000/sets')
    const sets = await res.json()

    // Flatten all set items
    const allItems = sets.flatMap((s: any) => s.items)

    // Find product by id
    const backendProduct = allItems.find(
      (p: any) => String(p.id) === String(this.id)
    )

    if (!backendProduct) {
      console.error('Product not found in backend')
      return
    }

    // Optional: merge UI-only data (ingredients, extra images)
    const mock = this.mockProducts.find(p => p.id === this.id)

    this.product = {
      ...backendProduct,
      images: mock?.images || [backendProduct.image],
      ingredients: mock?.ingredients || []
    }

  } catch (err) {
    console.error('Failed to load product:', err)
  }
},

  addToFavorite() {
    const favorite = useFavoriteStore(); 
    favorite.addFavorite({
      id: this.product.id,
      name: this.product.name,
      image: this.product.images[0],
      price: this.product.price
    }, 'detail');

    this.$router.push("/favorite");
  },

  addToCart() {
  const cart = useCartStore();

  const normalizedPrice =
    typeof this.product.price === "string"
      ? Number(this.product.price.replace("$", "").trim())
      : Number(this.product.price);

  cart.addItem({
    id: String(this.product.id), // always string for Firestore consistency
    name: this.product.name,
    image: this.product.images?.[0] || "/default-product.jpg",
    price: normalizedPrice,
    qty: this.quantity > 0 ? this.quantity : 1,
    unit: this.product.unit || "set", // fallback to "set"
    category: "food" // optional: helps distinguish in backend
  });

  this.$router.push("/cart");
},

async fetchReviews() {
  try {
    const snap = await getDocs(collection(db, "reviews"))

    const list: Review[] = []
    let sum = 0

    snap.forEach(doc => {
      const data = doc.data()

      const productReview = data.products?.find(
        (p: any) => String(p.productId) === String(this.id)
      )

      if (productReview) {
        list.push({
          id: doc.id,
          rating: productReview.rating,
          comment: productReview.comment,
          userId: data.userId,
          userName: data.userName || "Anonymous",
          createdAt: data.createdAt
        })

        sum += productReview.rating
      }
    })

    this.reviews = list
    this.totalReviews = list.length
    this.averageRating = list.length
      ? Number((sum / list.length).toFixed(1))
      : 0

  } catch (err) {
    console.error("Failed to load reviews:", err)
  }
}

},


};
</script>

<style scoped>
/* your CSS unchanged */

/* Review Section */
.review-section {
  margin-top: 40px;
}

.review-item {
  border-bottom: 1px solid #eee;
  padding: 12px 0;
}

.review-header {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  margin-bottom: 6px;
}

.stars span {
  color: #ddd;
  font-size: 18px;
}

.stars .filled {
  color: #f5a623;
}


/* Individual review card */
.review-item {
  background: #fafafa;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.product-detail-page {
  font-family: 'Roboto', sans-serif;
  padding: 20px;
  background-color: #f9f9f9;
}

.product-layout {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-bottom: 2rem;
}

.left-section,
.right-section {
  flex: 1;
  min-width: 280px;
}

.dish-name {
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
}

.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.image-gallery img {
  width: 150px;
  border-radius: 0.5rem;
  box-shadow: 0 0 5px rgba(0,0,0,0.1);
}

.price-quantity-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  margin-top: 0.5rem;
}

.price {
  color: red;
  font-weight: bold;
  font-size: 1.2rem;
  margin: 0;
}

.quantity-selector {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.quantity-selector button {
  background-color: #6EC007;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  font-size: 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
}

.quantity-selector input {
  width: 60px;
  text-align: center;
  font-size: 1rem;
  padding: 0.3rem;
}

.ingredients-title {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.ingredients-list {
  list-style: none;
  padding-left: 1rem;
}

.ingredients-list li {
  margin-bottom: 0.3rem;
  font-size: 1rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
}

.actions button {
  padding: 0.5rem 1rem;
  background-color: #6EC007;
  color: white;
  border: none;
  border-radius: 0.25rem;
  cursor: pointer;
  font-weight: bold;
}

.actions button:hover {
  background-color: #4CAF50;
}

.price {
  display: flex;
  flex-direction: column; /* stack vertically */
  gap: 0.2rem;
}

.old-price {
  text-decoration: line-through;
  color: #999;
  font-size: 1rem; /* smaller */
}

.new-price {
  color: #6EC007;   /* green highlight */
  font-weight: bold;
  font-size: 1.5rem; /* bigger emphasis */
}

.discount-text {
  color: #ff0000;   /* red for discount */
  font-weight: bold;
  font-size: 1rem;
  margin-left: 0.3rem;
}

</style>
