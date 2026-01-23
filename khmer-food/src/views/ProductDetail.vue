<template>
  <div class="product-detail-page">
    <Banner />

    <!-- ================= PRODUCT DETAIL ================= -->
    <div v-if="product" class="product-detail">
      <div class="product-layout">

        <!-- LEFT : IMAGE GALLERY (3 IMAGES) -->
        <div class="left-section">
          <div class="main-image">
            <img :src="selectedImage" :alt="product.name" />
          </div>

          <div class="thumbnail-row">
            <img
              v-for="(img, index) in product.images"
              :key="index"
              :src="img"
              :class="{ active: selectedImage === img }"
              @click="selectedImage = img"
            />
          </div>
        </div>

        <!-- RIGHT : PRODUCT INFO + INGREDIENTS -->
        <div class="right-wrapper">
          <!-- Product Info -->
          <div class="right-section">
            <h2 class="product-title">{{ product.name }}</h2>

            <p class="product-desc">
              Fresh and delicious food prepared with high quality ingredients.
            </p>

            <div class="price">
              ${{ product.price }} / {{ product.unit || 'set' }}
            </div>

            <!-- Quantity -->
            <div class="quantity-selector">
              <button @click="quantity--" :disabled="quantity <= 1">−</button>
              <input type="number" v-model="quantity" min="1" />
              <button @click="quantity++">+</button>
            </div>

            <div class="total">
              Total: ${{ (Number(product.price) * quantity).toFixed(2) }}
            </div>

            <!-- ACTION BUTTONS -->
            <div class="actions">
              <button class="favorite-btn" @click="addToFavorite">
                Add to Favorite
              </button>
              <button class="cart-btn" @click="addToCart">
                Add to Cart
              </button>
            </div>
          </div>

          <!-- Ingredients -->
          <div class="ingredients-box" v-if="product.ingredients?.length">
            <h3>To do this food we need Ingredients as below:</h3>
            <ul>
              <li v-for="(item, i) in product.ingredients" :key="i">
                  {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <!-- ================= RELATED SETS ================= -->
<!-- ================= ANOTHER SET ================= -->
<div class="another-set" v-if="relatedSets.length">
  <h3>Another set</h3>
  <div class="scroll-container">
    <div class="scroll-row">
      <div v-for="item in relatedSets" :key="item.id" class="set-card">
        <img :src="item.image" :alt="item.name" />
        <h4>{{ item.name }}</h4>
        <p class="price">${{ item.price }}</p>
        <button @click="goToProduct(item.id)">View Detail</button>
      </div>
    </div>
  </div>
</div>



      <!-- ================= REVIEWS ================= -->
      <div v-if="reviews.length" class="review-section">
        <h3>⭐ {{ averageRating }} / 5 ({{ totalReviews }} reviews)</h3>

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
            <span v-for="n in 5" :key="n" :class="{ filled: n <= r.rating }">
              ★
            </span>
          </div>

          <p>{{ r.comment }}</p>

          <img v-if="r.photo" :src="r.photo" class="review-image" />
        </div>
      </div>

      <div v-else class="no-review">No reviews yet.</div>
    </div>

    <div v-else>Product not found.</div>
  </div>
</template>


<script lang="ts">
import Banner from '../components/Banner.vue'
import { useCartStore } from '../stores/cart'
import { useFavoriteStore } from '../stores/favorite'
import { getDocs, collection } from 'firebase/firestore'
import { db } from '../firebase'

type Review = {
  id: string
  rating: number
  comment: string
  userId: string
  userName?: string
  createdAt?: any
  photo?: string
}

export default {
  name: 'ProductDetail',
  components: { Banner },
  props: ['id'],

  data() {
    return {
      quantity: 1,
      product: null as any,
      selectedImage: '',
      reviews: [] as Review[],
      averageRating: 0,
      totalReviews: 0,
      relatedSets: [],

      mockProducts: [
        {
          id: '1',
          images: ['/images/brher1.png', '/images/brher2.png', '/images/brher3.png'],
          ingredients: ['Fish: 1kg', 'Pumpkin: 200g', 'Mushroom: 200g', 'Truffle: 100g (sliced)', 'Bass leaves: 100g']
        },
        {
          id: '2',
          images: ['/images/korko1.png', '/images/korko2.png', '/images/korko3.png'],
          ingredients: [
            'Fish or Pork: 1 kg',
            'Papaya: 300 g',
            'Moringa leaves: 200 g',
            'Pumpkin: 100 g',
            'Eggplant: 100 g'
          ]
        },
         {
          id: '3',
          images: ['/images/mju1.png', '/images/mju2.png', '/images/mju3.png'],
          ingredients: [
            'Beef: 0.5 kg',
            'Scallions: 300 g',
            'Peppers: 0.05 g ',
            'Lemongrass: 100 g',
            'Garlic: 50 g',
            'Fennel: 50 g',
            'Ripe tamarind: 50 g'
          ]
        },
         {
          id: '4',
          images: ['/images/sour1.png', '/images/sour2.png', '/images/sour3.png'],
          ingredients: [
            'Chicken: 0.5 kg',
            'Lemongrass: 3 stalks',
            'Ginger: 3 slices',
            'Garlic: 5 cloves',
            'Lemon: 1 piece'
          ]
        },
        {
          id: '5',
          images: ['/images/trakuon1.png', '/images/trakuon2.png', '/images/trakuon3.png'],
          ingredients: [
            'Chicken: 0.4 kg',
            'Garlic: 5 cloves',
            'Trakuon: 500 g'
          ]
        },
        {
          id: '6',
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
          images: ['/images/chicken1.png', '/images/chicken2.png', '/images/chicken3.png'],
          ingredients: [
            'Chicken: 1 kg (cut into pieces)',
            'Garlic: 5 cloves',
            'Peppers: 0.05 g',
            'Lemongrass: 100 g',
            'Fennel: 50 g',
            'Ripe tamarind: 50 g'
          ]
        },
        {
          id: '8',
          images: ['/images/khgey1.png', '/images/khgey2.png', '/images/khgey3.png'],
          ingredients: [
            'Chicken: 1 kg',
            'Garlic: 5 cloves',
            'Ginger: 3 silces',
            'Garlic leaves: 10 g'
          ]
        },
        {
          id: '9',
          images: ['/images/ahmok1.png', '/images/ahmok2.png', '/images/ahmok3.png'],
          ingredients: [
            'Fish: 500 g',
            'Coconut milk: 200 ml',
            'Kroeung paste: 50 g',
            'Egg: 1',
            'Banana leaves for steaming'
          ]
        },
         {
          id: '10',
          images: ['/images/brhok1.png', '/images/brhok2.png', '/images/brhok3.png'],
          ingredients: [
            'Brhok: 200 g',
            'Pork: 0.5 kg',
            'Garlic: 5 cloves',
            'Peppers: 0.05 g',
            'Egg: 3 pieces'
          ]
        },
        {
          id: '11',
          images: ['/images/brhokktis1.png', '/images/brhokktis2.png', '/images/brhokktis3.png'],
          ingredients: [
            'Pork: 0.5 kg',
            'Brhok: 200 g',
            'Coconut milk: 200 ml',
            'Garlic: 5 cloves',
            'Peppers: 0.05 g',
            'Peanut: 100 g'
          ]
        },
         {
          id: '12',
          images: ['/images/streamfish1.png', '/images/streamfish2.png', '/images/streamfish3.png'],
          ingredients: [
            'Fish: 1 kg',
            'Garlic leaves: 10 g',
            'Carrot: 200 g',
            'Peppers: 0.05 g'
          ]
        }
      ]
    }
  },

  mounted() {
    this.loadProduct()
    this.fetchReviews()
    this.fetchRelatedSets()
  },

  watch: {
    id() {
      this.loadProduct()
      this.fetchReviews()
      this.fetchRelatedSets()
    }
  },

  methods: {
    async fetchRelatedSets() { const res = await fetch('http://localhost:3000/sets')
    const sets = await res.json()
    const items = sets.flatMap((s: any) => s.items)

    this.relatedSets = items
      .filter((p: any) => String(p.id) != String(this.id))
      .slice(0.6)
  },
  goToProduct(id: string) {
  this.$router.push({
    name: 'ProductDetail',
    params: { id }
  })
},

    async loadProduct() {
      const res = await fetch('http://localhost:3000/sets')
      const sets = await res.json()
      const items = sets.flatMap((s: any) => s.items)

      const backendProduct = items.find(
        (p: any) => String(p.id) === String(this.id)
      )

      if (!backendProduct) return

      const mock = this.mockProducts.find(p => p.id === this.id)

      this.product = {
        ...backendProduct,
        images: mock?.images || [backendProduct.image],
        ingredients: mock?.ingredients || []
      }

      this.selectedImage = this.product.images[0]
    },

    addToCart() {
      const cart = useCartStore()
      cart.addItem({
        id: String(this.product.id),
        name: this.product.name,
        image: this.product.images[0],
        price: Number(this.product.price),
        qty: this.quantity,
        unit: this.product.unit || 'set'
      })
      this.$router.push('/cart')
    },

    addToFavorite() {
      const favorite = useFavoriteStore()
      favorite.addFavorite(
        {
          id: this.product.id,
          name: this.product.name,
          image: this.product.images[0],
          price: this.product.price
        },
        'detail'
      )
      this.$router.push('/favorite')
    },

async fetchReviews() {
  const snap = await getDocs(collection(db, 'reviews'))
  let sum = 0
  const list: Review[] = []

  snap.forEach(doc => {
    const data = doc.data()
    const review = data.products?.find(
      (p: any) => String(p.productId) === String(this.id)
    )

    if (review) {
      // Convert review photo to base64 if it exists
      let photoBase64 = ''
      if (review.photo) {
        photoBase64 = review.photo.startsWith('data:image')
          ? review.photo
          : `data:image/jpeg;base64,${review.photo}`
      }

      list.push({
        id: doc.id,
        rating: review.rating,
        comment: review.comment,
        userId: data.userId,
        userName: data.userName || 'Anonymous',
        createdAt: data.createdAt,
        photo: photoBase64 // add photo here
      })

      sum += review.rating
    }
  })

  this.reviews = list
  this.totalReviews = list.length
  this.averageRating = list.length
    ? Number((sum / list.length).toFixed(1))
    : 0
}

  }
}
</script>

<style scoped>
.product-detail-page {
  padding: 30px;
  background: #f9f9f9;
}

/* Layout */
.product-layout {
  display: flex;
  gap: 100px;
  background: #fff;
  padding: 40px;
  border-radius: 20px;
  font-family: 'Quicksand', sans-serif;
}

/* LEFT */
.main-image img {
  width: 280px;
  background: #e8f7d8;
  padding: 20px;
  border-radius: 20px;
}

.thumbnail-row {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.thumbnail-row img {
  width: 70px;
  cursor: pointer;
  border-radius: 10px;
  border: 2px solid transparent;
}

.thumbnail-row img.active {
  border-color: #6ec007;
}

/* RIGHT */
.product-title {
  font-size: 28px;
  margin-bottom: 10px;
}

.product-desc {
  color: #777;
  margin-bottom: 15px;
}

.price {
  font-size: 22px;
  font-weight: bold;
  color: #6ec007;
  margin-bottom: 15px;
}

.quantity-selector {
  display: flex;
  gap: 4px;
  margin-bottom: 10px;
  align-items: center;
}

.quantity-selector button {
  width: 30px;        /* smaller width */
  height: 30px;       /* smaller height */
  font-size: 14px;    /* smaller symbol */
  border-radius: 6px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
}

.quantity-selector input {
  width: 50px;        /* smaller input */
  height: 30px;
  text-align: center;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #ccc;
}


.total {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
}

/* Buttons */
.actions {
  display: flex;
  gap: 40px;
}

.cart-btn {
  background: #6ec007;
  color: #fff;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
}

.favorite-btn {
  background:#6ec007;
  color:#fff;
  border: none;
  padding: 10px 20px;
  border-radius: 20px;
}
.favorite-btn:hover,
.cart-btn:hover {
  background: #5aa005;
  cursor: pointer;

}


/* Reviews */
.review-item {
  background: #fff;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 10px;
}

.review-image {
  max-width: 200px;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-top: 10px;
}

.stars span {
  color: #ddd;
}

.stars .filled {
  color: #f5a623;
}
.right-wrapper {
  display: flex;
  flex-direction: row;
  gap: 100px;
  flex: 1;
}


/* ===== Another set section ===== */
.another-set {
  margin-top: 60px;
  font-family: 'Quicksand', sans-serif;
}

.another-set h3 {
  text-align: center;
  font-size: 26px;
  margin-bottom: 30px;
  font-weight: 600;
  color: #333;
}

/* Horizontal scroll */
.scroll-container {
  overflow-x: auto;
  padding-bottom: 15px;
}

.scroll-row {
  display: flex;
  gap: 24px;
}

/* ===== Card ===== */
.set-card {
  flex: 0 0 220px;
  background: #ffffff;
  border-radius: 24px;
  padding: 20px 16px;
  text-align: center;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.set-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.12);
}

/* ===== Image ===== */
.set-card img {
  width: 170px;
  height: 150px;
  object-fit: contain;
  border-radius: 16px;
  background: #f3f3f3;
  padding: 10px;
  margin-bottom: 16px;
}

/* ===== Name ===== */
.set-card h4 {
  font-size: 16px;
  font-weight: 600;
  color: #444;
  margin-bottom: 10px;
}

/* ===== Price ===== */
.set-card .price {
  font-size: 22px;
  font-weight: 700;
  color: #6ec007;
  margin-bottom: 14px;
}

/* ===== Button ===== */
.set-card button {
  background: #6ec007;
  color: #fff;
  border: none;
  padding: 10px 22px;
  border-radius: 999px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.set-card button:hover {
  background: #5aa005;
  transform: scale(1.05);
}

/* Optional: hide scrollbar but keep scroll */
.scroll-container::-webkit-scrollbar {
  height: 6px;
}

.scroll-container::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}
.review-section{
  margin-top: 50px;
  font-family: 'Quicksand', sans-serif;
}


</style>
