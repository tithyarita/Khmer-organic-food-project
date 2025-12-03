<template>
  <footer class="footer">
    <!-- Left Side -->
    <div class="footer-left">
      <p><strong>Contact Us:</strong></p>
      <p><strong>Phone:</strong> +855 12 345 678</p>
      <p><strong>Location:</strong> Phnom Penh, Cambodia</p>
    </div>

    <!-- Right Side -->
    <div class="footer-right">
      <p>Follow Us</p>
      <div class="social-icons">
        <a href="https://facebook.com" target="_blank" aria-label="Facebook"><i class="fab fa-facebook"></i></a>
        <a href="https://instagram.com" target="_blank" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
        <a href="https://tiktok.com" target="_blank" aria-label="TikTok"><i class="fab fa-tiktok"></i></a>
        <a href="https://twitter.com" target="_blank" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
        <a href="https://x.com" target="_blank" aria-label="X"><i class="fab fa-x-twitter"></i></a>
        <a href="mailto:support@khmerorganic.com" aria-label="Message"><i class="fas fa-envelope"></i></a>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
export default {
  name: "Footer"
}
</script>

<style scoped>
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #6EC007; /* same as header */
  padding: 1.25rem 1.875rem; /* 20px 30px converted to rem */
  font-family: 'Baloo Da', cursive;
  color: #fff;
}

.footer-left{
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.footer-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.5rem;
}

.footer-left p{
   margin: 0;
  font-size: 1rem;
}
.footer-right p {
  margin: 0;
  font-size: 1rem;
  text-align: center;
  display: inline-block;         /* allow horizontal alignment */
  align-self: center;            /* center within flex container */
  padding-right: 1rem;           /* spacing between text and icons */
}
.footer-right {
  align-items: flex-end;
  text-align: right;
}

.social-icons {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  align-items: center;
}

.social-icons a i {
  font-size: 1.4rem;
  color: white;
  transition: 0.3s ease;
}

.social-icons a:hover i {
  transform: scale(1.3);
  color: #e8ffe8; /* highlight */
}
</style>