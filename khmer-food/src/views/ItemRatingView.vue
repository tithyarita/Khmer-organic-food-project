<template>
  <div class="rating-page">
    <div class="container">
      <h1>Rate This Item</h1>
      <div v-if="item" class="item-details">
        <img :src="item.image || '/default-product.jpg'" :alt="item.name" class="item-image" />
        <h2>{{ item.name }}</h2>
        <p>{{ item.description || 'No description available.' }}</p>
      </div>

      <div class="rating-form">
        <h3>Your Rating</h3>
        <div class="stars">
          <span
            v-for="n in 5"
            :key="n"
            class="star"
            :class="{ active: n <= rating }"
            @click="setRating(n)"
          >
            ★
          </span>
        </div>

        <textarea
          v-model="comment"
          placeholder="Leave a comment (optional)"
          rows="4"
        ></textarea>

        <button class="submit-btn" @click="submitRating" :disabled="!rating">Submit Rating</button>
      </div>

      <button class="back-btn" @click="goBack">Back</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { auth } from '../firebase'

const route = useRoute()
const router = useRouter()

const itemId = route.params.itemId as string
const item = ref<any>(null)
const rating = ref(0)
const comment = ref('')

onMounted(async () => {
  // For simplicity, assume item details are passed or fetched; here just set a placeholder
  // In real app, fetch from backend or pass via props
  item.value = { id: itemId, name: 'Sample Item', image: '/images/sample.jpg' }
})

function setRating(n: number) {
  rating.value = n
}

async function submitRating() {
  if (!rating.value) return

  try {
    await addDoc(collection(db, 'reviews'), {
      productId: itemId,
      rating: rating.value,
      comment: comment.value,
      userId: auth.currentUser?.uid || 'anonymous',
      createdAt: new Date()
    })
    alert('Rating submitted!')
    router.push(`/product/${itemId}`)
  } catch (e) {
    console.error('Failed to submit rating:', e)
    alert('Failed to submit rating.')
  }
}

function goBack() {
  router.go(-1)
}
</script>

<style scoped>
.rating-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f9f9f9;
  padding: 2rem;
}

.container {
  max-width: 600px;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  text-align: center;
}

.item-details {
  margin-bottom: 2rem;
}

.item-image {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.rating-form {
  margin-bottom: 2rem;
}

.stars {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.star {
  font-size: 2rem;
  color: #ddd;
  cursor: pointer;
  margin: 0 0.2rem;
}

.star.active {
  color: #ffd700;
}

textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin-bottom: 1rem;
  resize: vertical;
}

.submit-btn {
  background: #4caf50;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}

.submit-btn:hover {
  background: #45a049;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.back-btn {
  background: #ccc;
  color: #333;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
}

.back-btn:hover {
  background: #bbb;
}
</style>
