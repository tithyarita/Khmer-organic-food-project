<template>
  <div class="review-page">
    <h2 class="page-title">💖 Review Your Order</h2>

    <div v-for="item in order?.items" :key="item.id" class="review-item">
      <div class="item-header">
        <img :src="item.image || '/default-product.jpg'" class="item-image" />
        <h3>{{ item.name }}</h3>
      </div>

      <!-- Star Rating -->
      <div class="stars">
        <span
          v-for="star in 5"
          :key="star"
          @click="!isReviewed(item.id) && setRating(item.id, star)"
          @mouseover="hoverRating[item.id] = star"
          @mouseleave="hoverRating[item.id] = 0"
          :class="{
            active: (hoverRating[item.id] || ratings[item.id]) >= star,
            disabled: isReviewed(item.id)
          }"
        >
          ★
        </span>
      </div>

      <!-- Comment -->
      <textarea
        v-model="comments[item.id]"
        :disabled="isReviewed(item.id)"
        placeholder="Write your review..."
      ></textarea>

      <!-- Photo Upload -->
      <div class="photo-upload" v-if="!isReviewed(item.id)">
        <label for="photo">Upload a photo (optional):</label>
        <input type="file" accept="image/*" @change="handleFileUpload($event, item.id)" />
        <img v-if="photos[item.id]" :src="photos[item.id]" class="preview-image" />
      </div>

      <p v-if="isReviewed(item.id)" class="already-reviewed">
        ✔ Already reviewed
      </p>
    </div>

    <!-- Submit All Reviews Button -->
    <button @click="submitAllReviews" :disabled="allReviewed || submitting">
      <span v-if="!submitting">Submit All Reviews</span>
      <span v-else>Submitting...</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getOrderById, updateOrderRated } from '@/services/orderService'
import { addOrderReview, getReviewsByOrder } from '@/services/reviewService'
import { getUserStorage } from '@/loginstorage'

const route = useRoute()
const router = useRouter()
const orderId = route.params.orderId as string

const order = ref<any>(null)
const user = getUserStorage()

const ratings = ref<Record<string, number>>({})
const comments = ref<Record<string, string>>({})
const hoverRating = ref<Record<string, number>>({})
const reviewedProducts = ref<Record<string, any>>({})
const photos = ref<Record<string, string>>({}) // base64 photos

const submitting = ref(false)

onMounted(async () => {
  if (!user) {
    alert('Please login first!')
    router.push('/loginSignup')
    return
  }

  // Load order items
  order.value = await getOrderById(orderId)

  // Load existing reviews
  const reviewDoc = await getReviewsByOrder(orderId)
  if (reviewDoc?.products) {
    for (const p of reviewDoc.products) {
      reviewedProducts.value[p.productId] = p
      ratings.value[p.productId] = p.rating
      comments.value[p.productId] = p.comment
      if (p.photo) photos.value[p.productId] = p.photo
    }
  }
})

// Check if product already reviewed
function isReviewed(productId: string | number) {
  return !!reviewedProducts.value[productId]
}

// Set rating
function setRating(productId: string | number, star: number) {
  ratings.value[productId] = star
}

// Handle photo upload
function handleFileUpload(e: Event, productId: string) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    photos.value[productId] = reader.result as string
  }
  reader.readAsDataURL(file)
}

// Submit all reviews
async function submitAllReviews() {
  if (!user) return

  const itemsToSubmit = order.value.items.filter(item => !isReviewed(item.id))

  if (!itemsToSubmit.length) {
    alert('All products already reviewed!')
    return
  }

  // Validate ratings
  for (const item of itemsToSubmit) {
    if (!ratings.value[item.id]) {
      alert(`Please give a rating for ${item.name}`)
      return
    }
  }

  submitting.value = true

  try {
    for (const item of itemsToSubmit) {
      await addOrderReview({
        userId: user.uid,
        orderId,
        productId: item.id,
        productName: item.name,
        rating: ratings.value[item.id],
        comment: comments.value[item.id] || '',
        photo: photos.value[item.id] || ''
      })
    }

    await updateOrderRated(orderId, true)

    alert('Reviews submitted successfully! 💖')
    router.push('/')
  } catch (error) {
    console.error(error)
    alert('Failed to submit reviews. Please try again.')
  } finally {
    submitting.value = false
  }
}

// Disable button if all reviewed
const allReviewed = computed(() => {
  return order.value?.items.every((item: any) => isReviewed(item.id))
})
</script>

<style scoped>
.review-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 16px;
  font-family: 'Poppins', sans-serif;
  min-height: 100vh;
}

.page-title {
  text-align: center;
  font-size: 2rem;
  color: #6ec007;
  font-family: 'Quicksand', sans-serif;
  margin-bottom: 32px;
}

.review-item {
  background: #fff;
  border-radius: 20px;
  padding: 24px;
  font-family: 'Quicksand', sans-serif;
  margin-bottom: 24px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
  transition: transform 0.2s;
}

.review-item:hover {
  transform: translateY(-2px);
}

.item-header {
  display: flex;
  align-items: center;
  font-family: 'Quicksand', sans-serif;
  gap: 16px;
  margin-bottom: 16px;
}

.item-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(109, 192, 7, 0.378);
}

.stars {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
}

.stars span {
  font-size: 28px;
  cursor: pointer;
  color: #ddd;
  transition: transform 0.2s, color 0.2s;
}

.stars span.active {
  color: #f5b301;
  transform: scale(1.2);
}

.stars span.disabled {
  cursor: not-allowed;
}

textarea {
  width: 100%;
  min-height: 90px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #eee;
  resize: vertical;
  font-size: 14px;
  margin-top: 8px;
  font-family: 'Quicksand', sans-serif;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.05);
}

textarea:disabled {
  background: #f5f5f5;
  color: #888;
}

.photo-upload {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-family: 'Quicksand', sans-serif;
  font-size: 14px;
  color: #555;
}

.photo-upload input {
  padding: 4px;
}

.preview-image {
  max-width: 120px;
  border-radius: 12px;
  margin-top: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

.already-reviewed {
  color: green;
  font-weight: 500;
  margin-top: 6px;
}

button {
  margin-top: 20px;
  padding: 14px 20px;
  background: linear-gradient(135deg,#ff6b81,#ff9f1c);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  font-family: 'Quicksand', sans-serif;
}

button:hover:enabled {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(255,107,129,0.4);
}

button:disabled {
  cursor: not-allowed;
}
</style>
