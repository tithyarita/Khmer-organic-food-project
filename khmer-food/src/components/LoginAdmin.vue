<template>
  <div class="login-admin">
    <h2>Admin Login</h2>

    <form @submit.prevent="loginAdmin">
      <input
        v-model="email"
        type="email"
        placeholder="Admin Email"
        required
      />

      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
      />

      <button type="submit">Login</button>

      <p v-if="errorMessage" class="error">
        {{ errorMessage }}
      </p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore'

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const auth = getAuth()
const db = getFirestore()
const router = useRouter()

const loginAdmin = async () => {
  errorMessage.value = ''

  try {
    // 1️⃣ Firebase login
    const cred = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )

    const uid = cred.user.uid

    // 2️⃣ Query Firestore by uid FIELD (not doc id)
    const q = query(
      collection(db, 'users'),
      where('uid', '==', uid)
    )

    const snap = await getDocs(q)

    if (snap.empty) {
      await auth.signOut()
      errorMessage.value = 'User record not found'
      return
    }

    const userData = snap.docs[0].data()

    // 3️⃣ Role check
    if (userData.role !== 'admin') {
      await auth.signOut()
      errorMessage.value = 'Access denied: Admin only'
      return
    }

    // 4️⃣ Status check
    if (userData.status !== 'active') {
      await auth.signOut()
      errorMessage.value = 'Account is not active'
      return
    }

    // 5️⃣ SUCCESS
    router.push('/admin/sales')

  } catch (error: unknown) {
    if (error instanceof Error) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = 'Login failed'
    }
  }
}
</script>


<style scoped>
.login-admin {
  max-width: 400px;
  margin: 100px auto;
  padding: 2rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}

input {
  width: 100%;
  padding: 0.6rem;
  margin-bottom: 1rem;
}

button {
  width: 100%;
  padding: 0.6rem;
  background: #6ec007;
  color: white;
  border: none;
  cursor: pointer;
}

.error {
  color: red;
  margin-top: 1rem;
}
</style>
