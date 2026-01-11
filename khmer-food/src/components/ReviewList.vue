<template>
  <div>
    <div v-for="r in reviews" :key="r.userId" class="review">
      <p>⭐ {{ r.rating }}/5</p>
      <p>{{ r.comment }}</p>
    </div>
  </div>
</template>

<script>
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/firebase';

export default {
  props: ['productId'],
  data() {
    return { reviews: [] };
  },
  mounted() {
    const q = query(
      collection(db, 'reviews'),
      where('productId', '==', this.productId)
    );

    onSnapshot(q, snap => {
      this.reviews = snap.docs.map(d => d.data());
    });
  }
};
</script>

<style scoped>
.review {
  background: #fff;
  padding: 10px;
  margin-bottom: 8px;
  border-radius: 6px;
}
</style>
