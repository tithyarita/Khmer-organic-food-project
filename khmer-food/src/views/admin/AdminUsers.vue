<template>
  <div class="login-admin">
    <h2>Admin Login</h2>

    <form @submit.prevent="loginAdmin">
      <label>Email</label>
      <input v-model="email" type="email" required />

      <label>Password</label>
      <input v-model="password" type="password" required />

      <button type="submit">Login</button>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth'
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

const router = useRouter()
const auth = getAuth()
const db = getFirestore()

const loginAdmin = async () => {
  errorMessage.value = ''

  try {
    // 1️⃣ Login with Firebase Auth
    const cred = await signInWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )

    const uid = cred.user.uid

    // 2️⃣ Query Firestore by uid FIELD
    const q = query(
      collection(db, 'users'),
      where('uid', '==', uid)
    )

    const snap = await getDocs(q)

    if (snap.empty) {
      await signOut(auth)
      errorMessage.value = 'User record not found'
      return
    }

    const userData = snap.docs[0].data()

    // 3️⃣ Check role
    if (userData.role !== 'admin') {
      await signOut(auth)
      errorMessage.value = 'Access denied: Admin only'
      return
    }

    // 4️⃣ Check status
    if (userData.status !== 'active') {
      await signOut(auth)
      errorMessage.value = 'Account is inactive'
      return
    }

    // 5️⃣ SUCCESS → Go to admin dashboard
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
  padding: 30px;
  background: white;
  border-radius: 8px;
}

label {
  display: block;
  margin-top: 15px;
}

input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
}

button {
  margin-top: 20px;
  width: 100%;
  padding: 10px;
  background: #53b400;
  color: white;
  border: none;
  cursor: pointer;
}

.error {
  margin-top: 15px;
  color: red;
  font-weight: bold;
}
</style>
