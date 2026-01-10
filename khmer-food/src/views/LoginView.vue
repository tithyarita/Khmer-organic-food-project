<template>
  <div class="login-page">
    <!-- Left Side: Welcome Banner -->
    <div class="login-banner">
      <h1>Welcome Back</h1>
      <p>Hey! Good to see you again</p>
      <img src="@/assets/forLogin_SignUp/logoLogin.png" alt="Food Banner" class="banner-img" />
    </div>

    <!-- Right Side: Login Form -->
    <div class="login-form">
      <div class="form-content">
        <h2>Login to Your Account</h2>
        <p class="signup-prompt">
          <span class="gray-text">Don't have an account?</span>
          <router-link to="/signup" class="green-link">Sign Up</router-link>
        </p>

        <form @submit.prevent="submitForm">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Enter your email"
            required
          />

          <label for="password">Password</label>
          <div class="password-input">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Enter your password"
              required
            />
          </div>

          <a href="#" class="forgot-password">Forgot your password?</a>
          <button type="submit" class="submit-btn" :disabled="loading">
            {{ loading ? 'Logging in...' : 'Login' }}
          </button>
        </form>
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
const showPassword = ref(false)
const loading = ref(false)
const router = useRouter()

onMounted(() => {
  const user = getUserStorage()
  if (user) router.push(user.role === 'admin' ? '/admin/sales' : '/profile')
})

const submitForm = async () => {
  loading.value = true

  try {
    // 1️⃣ Auth login
    const cred = await signInWithEmailAndPassword(auth, email.value, password.value)
    const uid = cred.user.uid

    // 2️⃣ Save minimal info immediately so redirect feels fast
    saveUserStorage({ uid, email: cred.user.email!, role: 'user' })

    // 3️⃣ Redirect user immediately
    router.push('/profile')

    // 4️⃣ Fetch Firestore user data in background
    getDoc(doc(db, 'users', uid))
      .then(snap => {
        if (!snap.exists()) throw new Error('User data not found')
        const data = snap.data()

        // Update localStorage with full user info
        saveUserStorage({
          uid,
          userId: data.userId,
          email: cred.user.email!,
          name: data.name || '',
          phone: data.phone || '',
          role: data.role || 'user',
        })
      })
      .catch(err => console.error('Failed to load user profile:', err.message))

  } catch (err: any) {
    alert(err.message || 'Login failed')
  } finally {
    loading.value = false
  }
}
</script>


<style scoped>

.login-page {
  display: flex;
  min-height: 100vh;
  font-family: 'Baloo Tammudu 2', cursive;
}

/* Left Banner */
.login-banner {
  flex: 1;
  background-color: #6EC007; /* base color */
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  padding: 2rem 1.5rem;
  position: relative;
  overflow: hidden;
}

/* Dark overlay on top of image */
.login-banner::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2); /* solid dark overlay with 50% opacity */
  z-index: 1; /* below text, above image */
  pointer-events: none;
}


.login-banner h1,
.login-banner p {
  position: relative;
  z-index: 2; /* text above overlay */
}

.login-banner h1 {
  font-size: 4.5rem;
  margin-top: 5rem;
  margin-bottom: 0.1rem;
  font-weight: 900;
  line-height: 1;
}

.login-banner p {
  font-size: 1.8rem;
  margin: 0.1rem 0 2rem 0;
  font-weight: 500;
  line-height: 1.2;
}

.login-banner .banner-img {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 40rem;
  max-height: 30rem;
  border-radius: 1rem;
  z-index: 0; /* image behind everything */
  object-fit: contain;
}


/* Right Form */
.login-form {
  flex: 1;
  padding: 1.5rem;
  background: white;
}

.form-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  max-width: 30rem;
  margin: 0 auto;
  width: 100%;
}

.login-form h2 {
  color: #6EC007;
  font-size: 2.5rem;
  margin-bottom: 0.25rem;
  font-weight: 800;
  text-align: center;
  line-height: 1.1;
}

/* Sign Up prompt */
.signup-prompt {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 1rem 1.5rem 0;
  font-size: 1.2rem;
  justify-content: center;
}

.signup-prompt .gray-text {
  color: #979797;
  font-size: 1rem;
}

.signup-prompt .green-link {
  color: #6EC007;
  text-decoration: none;
  cursor: pointer;
  font-size: 1rem;
}

/* Form fields */
form label {
  font-weight: bold;
  margin-top: 1rem;
  display: block;
  color: black;
  font-size: 1.4rem;
  font-family: 'Baloo Tammudu 2', cursive;
}

form input {
  width: 100%;
  height: 3rem;
  padding: 0.35rem 0rem 0rem 1rem;
  margin-top: 0.1rem;
  border: 0.0625rem solid #6EC007;
  border-radius: 5rem;
  font-size: 1.2rem;
  font-family: 'Baloo Tammudu 2', cursive;
  outline: none;
  color: #000;
}

form input::placeholder {
  font-family: 'Baloo Tammudu 2', cursive;
  color: #888;
}

form input:focus {
  border-color: #6EC007;
  box-shadow: 0 0 0 0.125rem rgba(76, 175, 80, 0.2);
}

.password-input {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: 0.25rem;
  position: relative;
}

/* Forgot Password */
.forgot-password {
  color: #6EC007;
  font-size: 1rem;
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
  text-decoration: none;
  cursor: pointer;
  display: block;
  text-align: right;
  font-weight: bold;
  font-family: 'Baloo Tammudu 2', cursive;
}

/* Login Button */
.submit-btn {
  width: 100%;
  height: 3rem;
  padding: 0.2rem;
  background: #66b309;
  color: white;
  border: none;
  border-radius: 5rem;
  font-size: 1.35rem;
  font-weight: bold;
  font-family: 'Baloo Tammudu 2', cursive;
  margin-top: 0.8rem;
  cursor: pointer;
}

/* ======================== */
/* MOBILE RESPONSIVE */
@media (max-width: 64rem) {
  .login-page {
    flex-direction: column;
  }
  .login-banner {
    padding: 1.5rem 1rem;
    min-height: 40vh;
  }
  .login-banner h1 {
    font-size: 3rem;
    margin-top: 3rem;
  }
  .login-banner p {
    font-size: 1.25rem;
    margin: 0.5rem 0 1rem 0;
  }
  .login-banner .banner-img {
    max-width: 25rem;
    max-height: 20rem;
  }
  .login-form {
    padding: 1rem;
  }
  .login-form h2 {
    font-size: 2rem;
  }
  .signup-prompt {
    font-size: 0.9rem;
    gap: 0.25rem;
  }
  .forgot-password {
    font-size: 0.9rem;
    text-align: right;
  }
  form label {
    font-size: 1.1rem;
  }
  form input {
    width: 100%;
    padding: 1rem;
    margin-top: 0.1rem;
    border-radius: 1rem;
    font-size: 1.2rem;
  }
  .submit-btn {
    font-size: 1.2rem;
    padding: 0.5rem;
    height: 2.2rem;
  }
}
</style>
