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
          <button type="submit" class="submit-btn">Login</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth } from '../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { saveUserStorage, getUserStorage } from '../loginstorage'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const router = useRouter()

onMounted(() => {
  const user = getUserStorage()
  if (user) router.push('/profile')
})

const submitForm = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user
    saveUserStorage({ uid: user.uid, email: user.email })
    alert(`Welcome back, ${user.email}`)
    router.push('/profile')
  } catch (error) {
    if (error instanceof Error) {
      const firebaseError = error as { code?: string; message: string }
      switch (firebaseError.code) {
        case 'auth/user-not-found':
          alert('No account found with this email. Please sign up first.')
          break
        case 'auth/wrong-password':
          alert('Incorrect password. Please try again.')
          break
        case 'auth/invalid-email':
          alert('Invalid email format.')
          break
        default:
          alert(firebaseError.message)
      }
    } else {
      alert('Something went wrong. Please try again.')
    }
  }
}
</script>

<style scoped>
/* ======================== */
/*      LOGIN PAGE LAYOUT   */
/* ======================== */
.login-page {
  display: flex;
  min-height: 100vh;
  font-family: 'Baloo Tammudu 2', cursive;
}

/* Left Banner */
.login-banner {
  flex: 1;
  background-color: #6EC007; /* base color */
  background-image: linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.0)); /* dark to light */
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

.login-banner h1 {
  font-size: 4.5rem;
  margin-top: 5rem;
  margin-bottom: 0.1rem;
  font-weight: 900;
  line-height: 1;
  z-index: 2;
}

.login-banner p {
  font-size: 1.8rem;
  margin: 0.1rem 0 2rem 0;
  font-weight: 500;
  line-height: 1.2;
  z-index: 2;
}

.login-banner .banner-img {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 28rem; /* smaller than before (was 45rem) */
  max-height: 22rem; /* smaller than before (was 35rem) */
  border-radius: 1rem;
  z-index: 1;
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
  height: 2.5rem;
  padding: 0.2rem;
  background: #345708;
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
