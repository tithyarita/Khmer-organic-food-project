<template>
  <div v-if="user">
    <StarRating :value="rating" @update="rating = $event" />

    <textarea v-model="comment" placeholder="Write review"></textarea>

    <button @click="submit">Save</button>
    <button v-if="hasReview" @click="remove">Delete</button>
  </div>
</template>

<script>
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/firebase';
import StarRating from './StarRating.vue';

export default {
  components: { StarRating },
  props: ['productId'],
  data() {
    return { rating: 0, comment: '', hasReview: false };
  },
  computed: {
    user() {
      return auth.currentUser;
    }
  },
  async mounted() {
    const id = `${this.user.uid}_${this.productId}`;
    const snap = await getDoc(doc(db, 'reviews', id));
    if (snap.exists()) {
      this.rating = snap.data().rating;
      this.comment = snap.data().comment;
      this.hasReview = true;
    }
  },
  methods: {
    async submit() {
      const id = `${this.user.uid}_${this.productId}`;
      await setDoc(doc(db, 'reviews', id), {
        userId: this.user.uid,
        productId: this.productId,
        rating: this.rating,
        comment: this.comment,
        updatedAt: serverTimestamp()
      });
    },
    async remove() {
      const id = `${this.user.uid}_${this.productId}`;
      await deleteDoc(doc(db, 'reviews', id));
    }
  }
};
</script>
