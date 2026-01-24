<template>
  <section class="blog-cute">
    <div class="cute-header">
      <h2>Our Blog Can Help You </h2>
      <p>Sweet recipes, farm stories & fresh Khmer food 🌱</p>
    </div>

    <div v-if="blogs.length === 0" class="empty">
      No blog posts yet 🍃
    </div>

    <div class="cute-grid">
      <div v-for="b in blogs" :key="b.id" class="cute-card">
        <div class="img-box">
          <img :src="b.image || placeholder" />
        </div>

        <div class="cute-body">
          <span class="cute-date">{{ formatDate(b.createdAt) }}</span>
          <h3>{{ b.title }}</h3>
          <p>{{ excerpt(b.content) }}</p>

          <button class="cute-btn" @click="openFull(b)">
            Read More 💚
          </button>
        </div>
      </div>
    </div>

    <!-- Cute Modal -->
    <div v-if="active" class="cute-modal" @click.self="closeFull">
      <div class="cute-modal-card">
        <button class="cute-close" @click="closeFull">✕</button>

        <img v-if="active.image" :src="active.image" class="cute-modal-img" />

        <h2>{{ active.title }}</h2>
        <span class="cute-modal-date">{{ formatDate(active.createdAt) }}</span>

        <p class="cute-modal-content">{{ active.content }}</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue"
import { collection, onSnapshot, query, orderBy } from "firebase/firestore"
import { db } from "@/firebase"
import type { Timestamp } from "firebase/firestore"

interface BlogItem {
  id?: string
  title: string
  content: string
  image?: string
  createdAt?: Timestamp
}

const blogs = ref<BlogItem[]>([])
const active = ref<BlogItem | null>(null)
const placeholder = "/forBlog/placeholder.png"

let unsub: any = null

onMounted(() => {
  const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"))
  unsub = onSnapshot(q, snap => {
    blogs.value = snap.docs.map(d => ({ id: d.id, ...(d.data() as BlogItem) }))
  })
})

onUnmounted(() => unsub && unsub())

function formatDate(ts?: Timestamp) {
  if (!ts) return "-"
  return new Date((ts as any).seconds * 1000).toLocaleDateString()
}

function excerpt(text = "") {
  return text.length > 100 ? text.substring(0, 100) + "..." : text
}

function openFull(b: BlogItem) {
  console.log("Opening blog post:", b)
  active.value = b
  console.log("Active blog post:", active.value)
}

function closeFull() {
  active.value = null
}
</script>

<style scoped>
.blog-cute {
  padding: 4rem 8%;
  font-family: 'Baloo 2', cursive;
}

/* Header */
.cute-header {
  text-align: center;
  margin-bottom: 3rem;
}
.cute-header h2 {
  font-size: 2.5rem;
  color: #3b7d3a;
}
.cute-header p {
  color: #7fae85;
  margin-top: 0.4rem;
}

/* Grid */
.cute-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 2rem;
}

/* Card */
.cute-card {
  background: #ffffff;
  border-radius: 26px;
  overflow: hidden;
  box-shadow: 0 18px 45px rgba(60, 160, 90, 0.15);
  transition: 0.35s;
}
.cute-card:hover {
  transform: translateY(-8px) rotate(-0.5deg);
  box-shadow: 0 25px 60px rgba(60, 160, 90, 0.25);
}

.img-box img {
  width: 100%;
  height: 210px;
  object-fit: cover;
}

/* Body */
.cute-body {
  padding: 1.5rem;
}
.cute-date {
  font-size: 0.8rem;
  color: #9bc6a0;
}
h3 {
  margin: 0.6rem 0;
  color: #2f6f37;
  font-size: 1.3rem;
}
p {
  font-size: 0.95rem;
  color: #5d8b63;
  line-height: 1.6;
}

/* Button */
.cute-btn {
  margin-top: 1.2rem;
  background: linear-gradient(135deg, #b7ffb7, #6be48a);
  border: none;
  padding: 10px 20px;
  border-radius: 999px;
  color: #1f5f32;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(80, 200, 120, 0.4);
}
.cute-btn:hover {
  background: linear-gradient(135deg, #7df09a, #35c96a);
  color: white;
}

/* Modal */
.cute-modal {
  position: fixed;
  inset: 0;
  background: rgba(25, 80, 40, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1.5rem;
  z-index: 999;
}

.cute-modal-card {
  background: #f6fff5;
  max-width: 900px;
  width: 100%;
  border-radius: 26px;
  padding: 2rem;
  position: relative;
  max-height: 90vh;
  overflow-y: auto;
}

.cute-modal-img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 18px;
  margin-bottom: 1rem;
}

.cute-modal-date {
  color: #8bcf96;
  font-size: 0.9rem;
}

.cute-modal-content {
  margin-top: 1rem;
  line-height: 1.8;
  color: #355e3b;
  white-space: pre-wrap;
}

.cute-close {
  position: absolute;
  right: 16px;
  top: 16px;
  background: #e7f8e6;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
}

/* Mobile */
@media (max-width: 768px) {
  .cute-grid {
    grid-template-columns: 1fr;
  }
  .img-box img {
    height: 180px;
  }
}
</style>
