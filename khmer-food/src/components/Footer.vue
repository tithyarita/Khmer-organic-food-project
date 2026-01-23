  <template>
  <footer class="footer">
    <div class="footer-container">
      <!-- Left Section: Contact -->
      <div class="footer-left">
        <h3>Contact Us</h3>
        <p>Phone: +855 17 213 327</p>
        <p>Location: Phnom Penh, Cambodia</p>
        <p>Email: <a href="mailto:support@khmerorganic.com">Admin@gmail.com</a></p>
      </div>

      <!-- Center Section: Quick Links -->
      <div class="footer-center">
        <!-- Main Links -->
        <div class="footer-links-column">
          <h3>Main Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/favorite">Favorite</a></li>
            <li><a href="/cart">Add to Cart</a></li>
          </ul>
        </div>

        <!-- Products -->
        <div class="footer-links-column">
          <h3>Products</h3>
          <ul>
            <li><a href="/">Promotion</a></li>
            <li><a href="/category/sets">Set</a></li>
            <li><a href="/category/vegetables">Vegetable</a></li>
            <li><a href="/category/meats">Meat</a></li>
          </ul>
        </div>

        <!-- Info -->
        <div class="footer-links-column">
          <h3>Info</h3>
          <ul>
            <li><a href="/about">Mission</a></li>
            <li><a href="/about">Purpose</a></li>
            <li><a href="/about">Useful</a></li>
          </ul>
        </div>
      </div>

      <!-- Right Section: Social Media (visual only) -->
      <div class="footer-right">
        <h3>Follow Us</h3>
        <div class="social-icons">
          <i class="fab fa-facebook" aria-label="Facebook"></i>
          <i class="fab fa-instagram" aria-label="Instagram"></i>
          <i class="fab fa-tiktok" aria-label="TikTok"></i>
          <i class="fab fa-twitter" aria-label="Twitter"></i>
          <i class="fab fa-x-twitter" aria-label="X"></i>
          <i class="fas fa-envelope" aria-label="Email"></i>
        </div>
      </div>
    </div>

    <!-- Bottom -->
    <div class="footer-bottom">
      <p>© 2025 KhmerOrganic. All rights reserved.</p>
    </div>
  </footer>
</template>

<script lang="ts">
export default {
  name: 'Footer',
}
</script>

<style scoped>

.footer {
  background-color: #6ec007;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  /* padding: 2rem 2.5rem 1rem 2.5rem; */
  padding: 1.2rem;
  font-family: 'Baloo 2', cursive;

}


.footer-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 2rem;
}


.footer-left h3,
.footer-links-column h3,
.footer-right h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.9;
  border-bottom: 1px solid #bfffc1;
  padding-bottom: 0.25rem;
}

.footer-left p,
.footer-left a {
  font-size: 0.8rem;
  margin: 0.2rem 0;
  color: #f1f5f1;
  text-decoration: none;
}

.footer-left a:hover {
  color: #bfffc1;
  text-decoration: underline;
}


.footer-center {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.footer-links-column ul {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0;
}

.footer-links-column li {
  margin: 0.5rem 0;
}

.footer-links-column a {
  color: #f1f5f1;
  text-decoration: none;
  font-size: 0.8rem;
  transition: color 0.3s ease;
}

.footer-links-column a:hover {
  color: #bfffc1;
}

.footer-right .social-icons {
  display: flex;
  gap: 0.8rem;
  margin-top: 0.5rem;
}

.footer-right .social-icons i {
  font-size: 1.1rem;
  color: #f1f5f1;
  transition: transform 0.25s ease, color 0.25s ease;
}

.footer-right .social-icons i:hover {
  transform: translateY(-3px) scale(1.2);
  color: #bfffc1;
}


.footer-bottom {
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin-top: 1.5rem;
  padding-top: 1rem;
  font-size: 0.75rem;
  opacity: 0.8;
}


@media (max-width: 900px) {
  .footer-container {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .footer-left,
  .footer-center,
  .footer-right {
    align-items: center;
  }

  .footer-center {
    flex-direction: column;
  }
}
</style>
