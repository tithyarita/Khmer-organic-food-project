<template>
  <div class="container">
    <div class="content">
      <h1>Welcome to our Website!!!</h1>
      <img src="/images/Logo.png" alt="Khmer Organic Food" class="logo" />
      <p class="get-started"> Get Started <span class="icon">>></span></p>


      <div class="buttons">
        <button class="login" @click="goToLogin">Login</button>
      </div>

      <p class="no-account">
        Don't have an account yet? <span @click="goToSignUp"> Sign Up</span>
      </p>
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
/* ======================== */
/*      CONTAINER / BG      */
/* ======================== */
.container {
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  overflow: hidden;
  font-family: 'Baloo Tammudu 2', sans-serif;

  /* Abstract multi-layer green + white background */
  background:
    radial-gradient(circle at 20% 20%, rgba(86,145,0,0.25), transparent 35%),
    radial-gradient(circle at 80% 25%, rgba(120,200,60,0.18), transparent 30%),
    radial-gradient(circle at 50% 75%, rgba(102,192,7,0.12), transparent 40%),
    linear-gradient(to bottom, #ffffff 5%, #d4f0a3 30%, #6ec007 100%);

  animation: moveBlobs 25s ease-in-out infinite;
}

@keyframes moveBlobs {
  0% { background-position: 20% 20%, 80% 25%, 50% 75%; }
  50% { background-position: 25% 22%, 78% 28%, 48% 72%; }
  100% { background-position: 20% 20%, 80% 25%, 50% 75%; }
}

/* ======================== */
/*       CONTENT STYLES      */
/* ======================== */
.content {
  position: relative;
  z-index: 2;
  text-align: center;
  margin-top: 3rem;
}

.content h1 {
  font-size: 3.5rem;
  font-weight: 900;
  color: #2d0303;
  margin: 0;
  line-height: 1;
  text-shadow: 0 0.2rem 0.4rem rgba(0,0,0,0.15);
}

.content p {
   font-size: 2.5rem;
  font-weight: 900;
  color: #3f6f0a;
  margin: 0;
  line-height: 1;
}

/* "Don't have an account yet?" */
.no-account {
  margin-top: 1.5rem !important;
  font-size: 1rem !important;
  color: white !important;  /* force black */
  text-shadow: none !important;
}

.no-account span {
  font-weight: 700;
  color: green !important; /* green */
  cursor: pointer;
  transition: 0.2s;
}

.no-account span:hover {
  text-decoration: underline;
  color: #080807 !important; /* lighter green on hover */
}


/* ======================== */
/*         LOGO             */
/* ======================== */
.logo {
  width: 12rem;
  height: auto;
  margin: 1.5rem auto;
  filter: drop-shadow(0 0.3rem 1rem rgba(0, 0, 0, 0.25));
}

/* ======================== */
/*       BUTTONS            */
/* ======================== */
.buttons {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
}

.buttons button {
  width: 20rem;
  height: 3rem;
  padding: 0.2rem;
  font-size: 1.35rem;
  border-radius: 3rem;
  font-family: 'Baloo Tammudu 2', sans-serif;
  font-weight: 900;
  cursor: pointer;
  transition: all 0.25s ease-in-out;
  box-shadow: 0 0.4rem 0.8rem rgba(0,0,0,0.2);
}

/* Login button */
.buttons button.login {
  background: rgb(7, 41, 7);
  color: #fff;
  border: 0.01rem solid #2c3e16;
}
.buttons button.login:hover {
  background: linear-gradient(135deg, #447408, #66b32a);
  transform: translateY(-3px);
  box-shadow: 0 0.5rem 1rem rgba(243, 242, 242, 0.25);
}

/* ======================== */
/*       BANNER LAYER       */
/* ======================== */
.banner-layer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 35rem;
  background-image: url('@/assets/forLogin_SignUp/bannerLog.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: bottom center;
  z-index: 1;
  overflow: hidden;
  filter: blur(0.05rem);
}


/* ======================== */
/*        RESPONSIVE        */
/* ======================== */
@media (max-width: 37.5rem) {
  .content h1 { font-size: 2rem; }
  .content p { font-size: 1.25rem; }
  .logo { width: 12.5rem; }
  .buttons { margin-top: 1.5rem; }
  .buttons button { width: 12rem; padding: 0.8rem 1.2rem; font-size: 1.25rem; }
  .no-account { font-size: 0.9rem; }
  .banner-layer { height: 18.75rem; }
}
</style>
