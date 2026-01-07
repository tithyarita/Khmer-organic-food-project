<template>
  <div class="login-page">
    <div class="login-form">
      <div class="form-content">
        <h2>Admin Login</h2>
        <p class="login-prompt">
          <span class="gray-text">Not an admin?</span>
          <router-link to="/" class="green-link">Go Home</router-link>
        </p>

        <form @submit.prevent="loginAdmin">
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" placeholder="Enter admin email" required />

          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter password"
            required
          />

          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>
      </div>
    </div>

    <div class="login-banner">
      <h1>Welcome Back Admin</h1>
      <p>Manage users and shop settings easily</p>
      <img src="@/assets/forLogin_SignUp/logoSignup.png" alt="Admin Banner" class="banner-img" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '../../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { collection, query, where, getDocs } from 'firebase/firestore'

const router = useRouter()
const email = ref('')
const password = ref('')
const loading = ref(false)

const loginAdmin = async () => {
  if (!email.value || !password.value) return

  loading.value = true
  try {
    // 1️⃣ Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user

    // 2️⃣ Check role in Firestore
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('email', '==', user.email))
    const querySnapshot = await getDocs(q)

    if (querySnapshot.empty) {
      alert('No user found. Please check your credentials.')
      await auth.signOut()
      return
    }

    const userData = querySnapshot.docs[0].data()
    if (userData.role !== 'admin') {
      alert('Access denied. You are not an admin.')
      await auth.signOut()
      return
    }

    // ✅ Login successful, redirect to admin dashboard
    alert('Welcome Admin!')
    router.push('/admin') // change this to your admin dashboard route
  } catch (err: unknown) {
    if (err instanceof Error) {
      alert(err.message)
    } else {
      alert('Failed to login. Please try again.')
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  min-height: 100vh;
  font-family: 'Baloo Tammudu 2', sans-serif;
}

/* Left Form */
.login-form {
  flex: 1;
  padding: 2rem;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form-content {
  width: 100%;
  max-width: 400px;
}

.login-form h2 {
  color: #6ec007;
  font-size: 3rem;
  font-weight: 800;
  text-align: center;
}

.login-prompt {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.gray-text {
  color: #979797;
  font-size: 1.2rem;
}

.green-link {
  color: #6ec007;
  text-decoration: none;
  font-size: 1.2rem;
}

form label {
  font-weight: bold;
  display: block;
  margin-top: 1rem;
  font-size: 1.2rem;
}

form input {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.2rem;
  border: 1px solid #6ec007;
  border-radius: 0.7rem;
  font-size: 1rem;
  outline: none;
}

form input:focus {
  border-color: #4caf50;
  box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
}

.submit-btn {
  width: 50%;
  margin: 1.5rem auto 0;
  display: flex;
  justify-content: center;
  padding: 0.7rem;
  background: #6ec007;
  color: white;
  border-radius: 1rem;
  font-size: 1.3rem;
  font-weight: bold;
  cursor: pointer;
}

.submit-btn:hover {
  background: #57a600;
}

/* Right Banner */
.login-banner {
  flex: 1;
  background-color: #6ec007;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  position: relative;
}

.login-banner h1 {
  font-size: 3.5rem;
  font-weight: 900;
  margin-top: 5rem;
}

.login-banner p {
  font-size: 1.5rem;
  font-weight: 300;
  margin-top: 0.5rem;
}

.login-banner .banner-img {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-width: 35rem;
  object-fit: contain;
  border-radius: 1rem;
}

/* Mobile */
@media (max-width: 768px) {
  .login-page {
    flex-direction: column;
  }
  .login-banner {
    min-height: 40vh;
  }
}
</style>
