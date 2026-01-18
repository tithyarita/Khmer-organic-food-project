<template>
  <div class="review-page">
    <h2>Review Your Order</h2>

    <div v-for="item in order?.items" :key="item.id" class="review-item">
      <h3>{{ item.name }}</h3>

      <!-- Star Rating -->
      <div class="stars">
        <span
          v-for="star in 5"
          :key="star"
          @click="!isReviewed(item.id) && setRating(item.id, star)"
          :class="{ active: ratings[item.id] >= star, disabled: isReviewed(item.id) }"
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
import { getOrderById } from '@/services/orderService'
import { addOrderReview, getReviewsByOrder } from '@/services/reviewService'
import { getUserStorage } from '@/loginstorage'

const route = useRoute()
const router = useRouter()

const orderId = route.params.orderId as string
const order = ref<any>(null)
const user = getUserStorage()

const ratings = ref<Record<string, number>>({})
const comments = ref<Record<string, string>>({})
const reviewedProducts = ref<Record<string, any>>({})

const submitting = ref(false)

// Load order and existing reviews
onMounted(async () => {
  if (!user) {
    alert('Please login first!')
    router.push('/loginSignup')
    return
  }

  // Load order items
  order.value = await getOrderById(orderId)

  // Load existing reviews for this order
  const reviewDoc = await getReviewsByOrder(orderId)
  if (reviewDoc && reviewDoc.products) {
    for (const p of reviewDoc.products) {
      reviewedProducts.value[p.productId] = p
      ratings.value[p.productId] = p.rating
      comments.value[p.productId] = p.comment
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

// Submit all reviews in one document
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
      })
    }

    alert('Reviews submitted successfully!')
    router.push('/')
  } catch (error) {
    console.error(error)
    alert('Failed to submit reviews. Please try again.')
  } finally {
    submitting.value = false
  }
}

// Disable button if all products already reviewed
const allReviewed = computed(() => {
  return order.value?.items.every((item: any) => isReviewed(item.id))
})

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.review-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 16px;
}

.review-item {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
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
}

.stars span.active {
  color: #f5b301;
}

.stars span.disabled {
  cursor: not-allowed;
  color: #ccc;
}

textarea {
  width: 100%;
  min-height: 90px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: vertical;
  font-size: 14px;
  margin-top: 8px;
}

textarea:disabled {
  background: #f5f5f5;
  color: #888;
}

.already-reviewed {
  color: green;
  font-weight: 500;
  margin-top: 6px;
}

button {
  margin-top: 20px;
  padding: 12px 20px;
  background: #4f46e5;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
