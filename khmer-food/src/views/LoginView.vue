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
          <input id="email" v-model="email" type="email" placeholder="Enter your email" required />

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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const router = useRouter()

const submitForm = () => {
  console.log('Logging in:', { email: email.value, password: password.value })
  alert('Logged in!')
  router.push('/')
}
</script>

<style scoped>
.login-page {
  display: flex;
  min-height: 100vh;
  font-family: 'Baloo Tammudu 2', sans-serif;
}

/* Left Banner */
.login-banner {
  flex: 1;
  background-color: #6EC007;
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
  z-index: 2;
}

.login-banner p {
  font-size: 2.5rem;
  margin: 0;
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
  max-width: 65rem;
  max-height: 70em;
  border-radius: 1rem;
  z-index: 1;
  object-fit: contain;
}

/* Right Form */
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
  color: #6EC007;
  font-size: 4rem;
  margin-bottom: 0;
  font-weight: 800;
  text-align: center;
  line-height: 1;
}

/* Sign Up prompt */
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
  color: #6EC007;
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
  font-family: 'Baloo Tammudu 2', sans-serif;
}

form input {
  width: 100%;
  padding: 1rem;
  margin-top: 0.1rem;
  border: 0.0625rem solid #6EC007; /* 1px = 0.0625rem */
  border-radius: 1rem;
  font-size: 1.5rem;
  outline: none;
  font-family: 'Baloo Tammudu 2', sans-serif;
}

form input:focus {
  border-color: #6EC007;
  /* box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2); */
  box-shadow: 0 0 0 0.125rem rgba(76, 175, 80, 0.2); /* 2px = 0.125rem */
}

.password-input {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  margin-top: 0.25rem;
  position: relative;
}

/* ✅ FORGOT PASSWORD: RIGHT-ALIGNED */
.forgot-password {
  color: #6EC007;
  font-size: 1.2rem;
  margin-top: 0.9rem;
  margin-bottom: 3rem;
  text-decoration: none;
  cursor: pointer;
  display: block;
  text-align: right;
  padding-right: 0.5rem;
  font-family: 'Baloo Tammudu 2', sans-serif;
  font-weight: bold;
}

.submit-btn {
  width: 100%;
  padding: 0.5rem;
  background: #6EC007;
  color: white;
  border: none;
  border-radius: 1rem;
  font-size: 2.3rem;
  font-weight: bold;
  margin-top: 1.2rem;
  cursor: pointer;
  font-family: 'Baloo Tammudu 2', sans-serif;
}

/* Mobile Responsive */
@media (max-width: 37.5rem) {
  .login-page {
    flex-direction: column;
  }
  .login-banner {
    padding: 2rem 1rem;
    min-height: 50vh;
  }
  .login-banner h1 {
    font-size: 3rem;
    line-height: 1;
  }
  .login-banner p {
    font-size: 1.25rem;
    margin: 0.5rem 0 0 0;
    line-height: 1;
  }
  .login-banner .banner-img {
    max-width: 30rem;
    max-height: 25rem;
  }
  .login-form {
    padding: 1rem;
  }
  .login-form h2 {
    font-size: 3rem;
  }
  .signup-prompt {
    gap: 0.25rem;
    justify-content: center;
    align-items: center;
  }
  .signup-prompt .gray-text {
    font-size: 1.25rem;
  }
  .forgot-password {
    text-align: right;
    padding-right: 0;
  }
}
</style>