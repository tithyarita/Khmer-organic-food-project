<template>
  <div class="container">
    <div class="content">
      <h1>Get Started</h1>
      <p>Start with Login or Sign Up</p>
      <img src="/images/Logo.png" alt="Khmer Organic Food" class="logo" />
      <div class="buttons">
        <button @click="goToLogin">Login</button>
        <button @click="goToSignUp">Sign Up</button>
      </div>
    </div>
    <div class="banner-layer"></div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()
const goToLogin = () => router.push('/login')
const goToSignUp = () => router.push('/signup')
</script>

<style scoped>
.container {
  position: relative;
  min-height: 100vh;
  background: linear-gradient(to bottom, white 30%, #6EC007 50%);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  padding: 0;
  margin: 0;
  font-family: 'Baloo Tammudu 2', sans-serif;
  /* padding-bottom: 5rem; */
}

.content {
  position: relative;
  z-index: 3;
  text-align: center;
  margin-top: 1rem;
}

.content h1 {
  font-size: 5.2rem;
  font-weight: 900;
  color: #6EC007;
  margin: 0;
  line-height: 1; /* 👈 Removes extra space */
}

.content p {
  font-size: 2rem;
  color: #6EC007;
  margin: 0.5rem 0 0 0; /* Only 0.5rem gap */
  font-weight: 500;
  line-height: 1.2;
}

.logo {
  width: 30rem;
  height: auto;
  margin: 1.5rem auto;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 5.5rem;
}

.buttons button {
  width: 35rem;
  padding: 0.1rem;
  border-radius: 1rem;
  border: 0.0625rem solid #6EC007;
  background: #fff;
  color: #6EC007;
  font-weight: 900;
  font-size: 2.5rem;
  font-family: 'Baloo Tammudu 2', sans-serif;
  /* cursor: pointer; */
  padding-top: 1.2rem;
}

.buttons button:hover {
  background: #f8f8f8;
}

.banner-layer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50rem;
  background-image: url('@/assets/forLogin_SignUp/bannerLog.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: bottom center;
  z-index: 1;
}

/* Mobile */
@media (max-width: 37.5rem) {
  .content h1 {
    font-size: 2rem;
    line-height: 1;
    margin: 0;
  }
  .content p {
    font-size: 1.25rem;
    margin: 0.5rem 0 0 0;
  }
  .logo {
    width: 12.5rem;
    margin: 1rem auto;
  }
  .buttons {
    margin-top: 1.5rem;
    gap: 1rem;
  }
  .buttons button {
    width: 12.5rem;
    padding: 1rem;
    font-size: 1.25rem;
  }
  .banner-layer {
    height: 18.75rem;
  }
}
</style>