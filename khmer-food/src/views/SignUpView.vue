<template>
  <div class="signup-page">
    <!-- Left Side: Sign Up Form -->
    <div class="signup-form">
      <div class="form-content">
        <h2>Create an Account</h2>
        <p class="login-prompt">
          <span class="gray-text">Don't have an account?</span>
          <router-link to="/login" class="green-link">Login</router-link>
        </p>

        <form @submit.prevent="submitForm">
          <label for="name">Name</label>
          <input id="name" v-model="name" type="text" placeholder="Enter your name" required />

          <label for="phone">Phone Number</label>
          <input id="phone" v-model="phone" type="text" placeholder="Enter your phone number" required />

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

          <button type="submit" class="submit-btn">Sign Up</button>
        </form>
      </div>
    </div>

    <!-- Right Side: Welcome Banner -->
    <div class="signup-banner">
      <h1>Welcome to Our Food Shop</h1>
      <p>Hello! Let’s join our shop</p>
      <img src="@/assets/forLogin_SignUp/logoSignup.png" alt="Food Banner" class="banner-img" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// Firebase
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, runTransaction } from 'firebase/firestore'

// Form state
const name = ref('')
const phone = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const role=ref('customer')

const router = useRouter()

const submitForm = async () => {
  try {
    // 1️⃣ Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.value,
      password.value
    )
    const user = userCredential.user

    // 2️⃣ Auto-increment numeric ID
    const userId = await runTransaction(db, async (transaction) => {
      const counterRef = doc(db, 'counters', 'users')
      const counterSnap = await transaction.get(counterRef)

      if (!counterSnap.exists()) {
        transaction.set(counterRef, { lastId: 1 })
        return 1
      }

      const lastId = counterSnap.data().lastId as number
      const nextId = lastId + 1
      transaction.update(counterRef, { lastId: nextId })
      return nextId
    })

    // 3️⃣ Store user info in Firestore (NO password saved)
    await setDoc(doc(db, 'users', user.uid), {
      userId, // 1, 2, 3, ...
      uid: user.uid,
      name: name.value,
      phone: phone.value,
      role: role.value,

      email: email.value,
      createdAt: new Date()
    })

    alert(`Account created successfully!\nYour User ID: ${userId}`)
    router.push('/')

  } catch (error) {
    if (error instanceof Error) {
      // Firebase Auth errors have 'code' property
      const firebaseError = error as { code?: string; message: string }

      if (firebaseError.code === 'auth/email-already-in-use') {
        alert('This email is already registered')
      } else if (firebaseError.code === 'auth/weak-password') {
        alert('Password must be at least 6 characters')
      } else {
        alert(firebaseError.message)
      }
    } else {
      alert('Something went wrong')
    }
  }
}
</script>








<style scoped>
/* 🔴 YOUR DESIGN — UNCHANGED */
.signup-page {
  display: flex;
  min-height: 100vh;
  font-family: 'Baloo Tammudu 2', sans-serif;
}

/* Left Form */
.signup-form {
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

.signup-form h2 {
  color: #6EC007;
  font-size: 3rem;
  margin-bottom: 0;
  font-weight: 800;
  text-align: center;
  line-height: 1;
}

.login-prompt {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  /* font-size: 1.2rem; */
  font-weight: 120;
  justify-content: center;
}

.login-prompt .gray-text {
  color: #979797;
  font-size: 1.4rem;
}

.login-prompt .green-link {
  color: #6EC007;
  text-decoration: none;
  cursor: pointer;
  font-size: 1.4rem;
}

form label {
  font-weight: bold;
  margin-top: 1rem;
  display: block;
  color: black;
  font-size: 1.4rem;
  font-family: 'Baloo Tammudu 2', sans-serif;
}

form input {
  width: 100%;
  padding: 0.5rem;
  margin-top: 0.01rem;
  border: 0.0625rem solid #6EC007; /* 1px = 0.0625rem */
  border-radius: 0.7rem;
  font-size: 1.2rem;
  outline: none;
  font-family: 'Baloo Tammudu 2', sans-serif;
}

form input:focus {
  border-color: #4CAF50;
  box-shadow: 0 0 0 0.125rem rgba(76, 175, 80, 0.2);
}

.password-input {
  position: relative;
}

.forgot-password {
  color: #6EC007;
  font-size: 1.2rem;
  margin-top: 0.9rem;
  margin-bottom: 1.5rem;
  text-decoration: none;
  cursor: pointer;
  display: block;
  text-align: right;
}

.submit-btn {
  width: 50%;
  margin: 1.2rem auto 0; /* <-- ADD THIS LINE */
  display: flex;
  justify-content: center;
  padding: 0.5rem;
  background: #6EC007;
  color: white;
  border-radius: 1rem;
  font-size: 1.7rem;
  font-weight: bold;
  cursor: pointer;
}

.submit-btn:hover {
  background: #57a600;
}

/* Right Banner */
.signup-banner {
  flex: 1;
  background-color: #6EC007;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem 2rem;
  position: relative;
}

.signup-banner h1 {
  font-size: 4.65rem;
  margin-top: 7rem;
  margin-bottom: 0;
  font-weight: 900;
  line-height: 1;
  z-index: 2;
}

.signup-banner p {
  font-size: 1.8rem;
  margin: 0;
  font-weight: 300;
  line-height: 1.2;
  z-index: 2;
}

.signup-banner .banner-img {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 43rem;
  border-radius: 1rem;
  z-index: 1;
  object-fit: contain;
}

/* Mobile Responsive */
@media (max-width: 37.5rem) {
  .signup-page {
    flex-direction: column;
  }
  .signup-form {
    padding: 1rem;
  }
  .signup-form h2 {
    font-size: 3rem;
  }
  .login-prompt {
    gap: 0.25rem;
    justify-content: center;
    align-items: center;
  }
  .login-prompt .gray-text {
    font-size: 1.25rem;
  } 
  .forgot-password {
    text-align: right;
    padding-right: 0;
  }
  .signup-banner {
    min-height: 50vh;
  }
  .signup-banner h1 {
    font-size: 3rem;
    line-height: 1;
  }
  .signup-banner p {
   font-size: 1.25rem;
    margin: 0.5rem 0 0 0;
    line-height: 1;
  }
  .signup-banner .banner-img {
    max-width: 30rem;
    max-height: 25rem;
    
  }
}
</style>
