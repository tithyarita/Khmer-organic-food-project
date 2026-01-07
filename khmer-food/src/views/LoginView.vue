<template>
  <div class="login-page">
    <!-- Left Banner -->
    <div class="login-banner">
      <h1>Welcome Back</h1>
      <p>Hey! Good to see you again</p>
      <img src="@/assets/forLogin_SignUp/logoLogin.png" alt="Food Banner" class="banner-img" />
    </div>

    <!-- Right Form -->
    <div class="login-form">
      <div class="form-content">
        <h2>Login to Your Account</h2>
        <p class="signup-prompt">
          <span class="gray-text">Don't have an account?</span>
          <router-link to="/signup" class="green-link">Sign Up</router-link>
        </p>

        <form @submit.prevent="submitForm">
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" placeholder="Enter your email" required />

          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            required
          />

          <button type="submit" class="submit-btn">Login</button>
        </form>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { saveUserStorage, getUserStorage } from '../loginstorage'

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const router = useRouter()

// Redirect already logged-in customer to profile
onMounted(() => {
  const user = getUserStorage()
  if (user && user.role !== 'admin') router.push('/profile')
})

const submitForm = async () => {
  errorMessage.value = ''
  try {
    // 1️⃣ Sign in with Firebase Auth
    const cred = await signInWithEmailAndPassword(auth, email.value, password.value)
    const uid = cred.user.uid

    // 2️⃣ Get user data from Firestore
    const userRef = doc(db, 'users', uid)
    const userSnap = await getDoc(userRef)

    if (!userSnap.exists()) {
      errorMessage.value = 'User record not found'
      return
    }

    const userData = userSnap.data()

    // 3️⃣ Prevent admin login on customer page
    if (userData.role === 'admin') {
      errorMessage.value = 'Admins cannot login here'
      return
    }

    // 4️⃣ Save customer data locally
    saveUserStorage({
      uid,
      name: userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      role: 'customer',
    })

    // 5️⃣ Redirect to customer profile
    router.push('/profile')
  } catch (err: unknown) {
    if (err instanceof Error) errorMessage.value = err.message
    else errorMessage.value = 'Login failed. Please try again.'
  }
}
</script>

<style scoped>
.login-page {
  display: flex;
  min-height: 100vh;
  font-family: 'Baloo Tammudu 2', sans-serif;
}

/* Banner */
.login-banner {
  flex: 1;
  background-color: #6ec007;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  padding: 3rem 2rem;
  position: relative;
  overflow: hidden;
}

.login-banner h1 {
  font-size: 7rem;
  margin-top: 10rem;
  margin-bottom: 0;
  font-weight: 900;
  line-height: 1;
}

.login-banner p {
  font-size: 2.5rem;
  margin: 0;
  font-weight: 500;
  line-height: 1.2;
}

.login-banner .banner-img {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 65rem;
  max-height: 70em;
  border-radius: 1rem;
  object-fit: contain;
}

/* Form */
.login-form {
  flex: 1;
  padding: 2rem;
  background: white;
}

.form-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  max-width: 40rem;
  margin: 0 auto;
  width: 100%;
}

.login-form h2 {
  color: #6ec007;
  font-size: 4rem;
  margin-bottom: 0;
  font-weight: 800;
  text-align: center;
  line-height: 1;
}

.signup-prompt {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  font-size: 2rem;
  font-weight: 120;
  justify-content: center;
}

.signup-prompt .gray-text {
  color: #979797;
  font-size: 1.5rem;
}

.signup-prompt .green-link {
  color: #6ec007;
  text-decoration: none;
  cursor: pointer;
  font-size: 1.5rem;
}

form label {
  font-weight: bold;
  margin-top: 2rem;
  display: block;
  color: black;
  font-size: 2rem;
}

form input {
  width: 100%;
  padding: 1rem;
  margin-top: 0.1rem;
  border: 0.0625rem solid #6ec007;
  border-radius: 1rem;
  font-size: 1.5rem;
  outline: none;
}

form input:focus {
  border-color: #6ec007;
  box-shadow: 0 0 0 0.125rem rgba(76, 175, 80, 0.2);
}

.submit-btn {
  width: 100%;
  padding: 0.5rem;
  background: #6ec007;
  color: white;
  border: none;
  border-radius: 1rem;
  font-size: 2.3rem;
  font-weight: bold;
  margin-top: 1.2rem;
  cursor: pointer;
}

.error {
  color: red;
  margin-top: 1rem;
  font-weight: bold;
}

/* Mobile */
@media (max-width: 600px) {
  .login-page {
    flex-direction: column;
  }
  .login-banner {
    padding: 2rem 1rem;
    min-height: 50vh;
  }
  .login-banner h1 {
    font-size: 3rem;
  }
  .login-banner p {
    font-size: 1.25rem;
  }
  .login-banner .banner-img {
    max-width: 30rem;
    max-height: 25rem;
  }
  .login-form h2 {
    font-size: 3rem;
  }
}
</style>
