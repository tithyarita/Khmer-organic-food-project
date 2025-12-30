<template>
  <div class="login-admin">
    <h2>Admin Login</h2>
    <form @submit.prevent="submitForm">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth'

const email = ref('')
const password = ref('')
const router = useRouter()
const auth = getAuth()

const submitForm = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

    // Check if user is admin (you need a field in Firebase, e.g., custom claims or Firestore role)
    const token = await user.getIdTokenResult()
    if (token.claims.admin) {
      alert('Welcome Admin!')
      router.push('/admin/sales')
    } else {
      alert('You are not an admin!')
      await auth.signOut()
    }
  } catch (error: unknown) {
    if (error instanceof Error) alert(error.message)
    else alert('Login failed')
  }
}
</script>

<style scoped>
.login-admin {
  max-width: 400px;
  margin: 5rem auto;
  padding: 2rem;
  border: 1px solid #ccc;
  border-radius: 1rem;
}
.login-admin input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
}
.login-admin button {
  width: 100%;
  padding: 0.7rem;
  background: #53b400;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}
</style>
