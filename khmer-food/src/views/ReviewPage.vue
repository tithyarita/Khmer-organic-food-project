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
          @click="setRating(item.id, star)"
          :class="{ active: ratings[item.id] >= star }"
        >
          ★
        </span>
      </div>

      <!-- Comment -->
      <textarea
        v-model="comments[item.id]"
        placeholder="Write your review..."
      ></textarea>

      <button @click="submitReview(item)">
        Submit Review
      </button>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getOrderById } from '@/services/orderService'
import { addReview } from '@/services/reviewService'
import { getUserStorage } from '@/loginstorage'
import router from '../router/index'

const route = useRoute()
const orderId = route.params.orderId as string

const order = ref<any>(null)
const ratings = ref<Record<string, number>>({})
const comments = ref<Record<string, string>>({})

const user = getUserStorage()

onMounted(async () => {
  order.value = await getOrderById(orderId)
})

function setRating(productId: string | number, star: number) {
  ratings.value[productId] = star
}

async function submitReview(item: any) {
  if (!ratings.value[item.id]) {
    alert('Please give a rating')
    return
  }

  await addReview({
    userId: user.uid,
    orderId,
    productId: item.id,
    productName: item.name,
    rating: ratings.value[item.id],
    comment: comments.value[item.id] || '',
  })

  alert('Review submitted!')

  router.push('/')
}
    

</script>


<style scoped>
.review-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 16px;
}

.review-page h2 {
  text-align: center;
  margin-bottom: 32px;
  font-size: 28px;
  font-weight: 600;
}

.review-item {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.review-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 26px rgba(0, 0, 0, 0.12);
}

.review-item h3 {
  margin-bottom: 12px;
  font-size: 20px;
  font-weight: 600;
}

/* ⭐ Star Rating */
.stars {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
}

.stars span {
  font-size: 28px;
  cursor: pointer;
  color: #ddd;
  transition: color 0.2s ease, transform 0.15s ease;
}

.stars span:hover {
  transform: scale(1.2);
}

.stars span.active {
  color: #f5b301;
}

/* ✍️ Comment Box */
textarea {
  width: 100%;
  min-height: 90px;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #ccc;
  resize: vertical;
  font-size: 14px;
  margin-top: 8px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

textarea:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.15);
}

/* 🚀 Submit Button */
button {
  margin-top: 14px;
  padding: 10px 18px;
  background: linear-gradient(135deg, #4f46e5, #6366f1);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.25s ease, transform 0.15s ease, box-shadow 0.15s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.35);
}

button:active {
  transform: translateY(0);
}

</style>
