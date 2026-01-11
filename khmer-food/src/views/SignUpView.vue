<template>
  <div class="signup-page">
    <!-- Left Form -->
    <div class="signup-form">
      <div class="form-content">
        <h2>Create an Account</h2>
        <p class="login-prompt">
          <span class="gray-text">Already have an account?</span>
          <router-link to="/login" class="green-link">Login</router-link>
        </p>

        <form @submit.prevent="submitForm">
          <label for="name">Name</label>
          <input id="name" v-model="name" type="text" placeholder="Enter your name" required />

          <label for="phone">Phone Number</label>
          <input
            id="phone"
            v-model="phone"
            type="text"
            placeholder="Enter your phone number"
            required
          />

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

          <button type="submit" class="submit-btn">Sign Up</button>
        </form>
      </div>
    </div>

    <!-- Right Banner -->
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
import { auth, db } from '../firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, runTransaction } from 'firebase/firestore'

const name = ref('')
const phone = ref('')
const email = ref('')
const password = ref('')
const role = ref('customer')

const router = useRouter()

const submitForm = async () => {
  try {

    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user


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


    await setDoc(doc(db, 'users', user.uid), {
      userId,
      uid: user.uid,
      name: name.value,
      phone: phone.value,
      email: email.value,
      role: role.value,
      createdAt: new Date(),
    })

    alert(`Account created successfully!\nYour User ID: ${userId}`)

    router.push('/login')
  } catch (err: unknown) {
    if (err instanceof Error) {
      alert(err.message)
    } else {
      alert('Something went wrong during signup.')
    }
  }
}
</script>

<style scoped>

</style>

<style scoped>

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
  color: #6ec007;
  font-size: 2.5rem;
  margin-top: 0.0025rem;
  margin-bottom: 0rem;
  font-weight: 800;
  text-align: center;
  line-height: 1;
}

.login-prompt {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.0025rem;
  font-size: 1.2rem;
  font-weight: 120;
  justify-content: center;
}

.login-prompt .gray-text {
  color: #979797;
  font-size: 1.2rem;
}

.login-prompt .green-link {
  color: #6ec007;
  text-decoration: none;
  cursor: pointer;
  font-size: 1.2rem;
}

form label {
  font-weight: bold;
  margin-top: 0.25rem;
  display: block;
  color: black;
  font-size: 1.2rem;
  font-family: 'Baloo Tammudu 2', sans-serif;
}

form input {
  width: 100%;
  height:3rem;
  padding: 0.2rem 0rem 0rem 1rem;
  margin-top: 0rem;
  border: 0.0625rem solid #6ec007; /* 1px = 0.0625rem */
  border-radius: 5rem;
  font-size: 1rem;
  outline: none;
  font-family: 'Baloo Tammudu 2', sans-serif;
}

form input:focus {
  border-color: #4caf50;
  box-shadow: 0 0 0 0.125rem rgba(76, 175, 80, 0.2);
}

.password-input {
  position: relative;
}

.forgot-password {
  color: #6ec007;
  font-size: 1.2rem;
  margin-top: 0.9rem;
  margin-bottom: 1.5rem;
  text-decoration: none;
  cursor: pointer;
  display: block;
  text-align: right;
}

.submit-btn {
  width: 100%;
  height: 3rem;
  margin: 1.2rem auto 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5rem ;
  background: #529203;
  color: white;
  border-radius: 5rem;
  font-size: 1.2rem;
  font-weight: bold;
  font-family: 'Baloo Tammudu 2', sans-serif;
  cursor: pointer;

  border: none;
  outline: none;
  box-shadow: none;
  appearance: none;
}

.submit-btn:hover {
  background: #57a600;
}

.submit-btn:focus {
  outline: none;
  box-shadow: none;
}

/* Right Banner */
/* Right Banner — Dark Overlay + Banner Image */
.signup-banner {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  padding: 2rem 1.5rem;
  color: white;
  background-color: #6ec007; /* base green */
  overflow: hidden;
  font-family: 'Baloo Tammudu 2', cursive;
}

/* Dark overlay over banner image */
.signup-banner::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2); /* dark overlay */
  z-index: 1;
}

.signup-banner h1,
.signup-banner p {
  position: relative;
  z-index: 2; /* on top of overlay */
}

.signup-banner h1 {
  font-size: 4.5rem;
  margin-top: 5rem;
  margin-bottom: 0.25rem;
  font-weight: 900;
  line-height: 1.1;
}

.signup-banner p {
  font-size: 1.8rem;
  margin: 0.25rem 0 2rem 0;
  font-weight: 500;
  line-height: 1.2;
}

/* Banner Image */
.signup-banner .banner-img {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 40rem;
  max-height: 30rem;
  border-radius: 1rem;
  object-fit: contain;
  z-index: 0; /* under overlay and text */
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
