<template>
  <div class="contact-page">
    <section class="hero-container">
      <img
        src="@/assets/forContact/contactback.png"
        alt="Contact Banner"
        class="hero-img"
      />
      <div class="overlay">
        <h1 class="hero-title">CONTACT US</h1>
        <p class="hero-subtitle">Need support? Our team is ready.</p>
      </div>
    </section>

    <section class="contact-info">
      <div class="contact-item">
        <img src="@/assets/forContact/house.png" alt="icon" class="icon" />
        <h3 class="contact-title">Visit us</h3>
        <p class="contact-text">Toul Kork, Phnom Penh</p>
      </div>
      <div class="contact-item">
        <img src="@/assets/forContact/phone-call.png" alt="icon" class="icon" />
        <h3 class="contact-title">Call us</h3>
        <p class="contact-text">+855 17213327 (telegram)</p>
      </div>
      <div class="contact-item">
        <img src="@/assets/forContact/email1.png" alt="icon" class="icon" />
        <h3 class="contact-title">E-mail</h3>
        <p class="contact-text">Admin@gmail.com</p>
      </div>
      <div class="contact-item">
        <img src="@/assets/forContact/facebook.png" alt="icon" class="icon" />
        <h3 class="contact-title">Facebook</h3>
        <p class="contact-text">AdminPage</p>
      </div>
    </section>

    <section class="map-section">
      <div class="map-header">
        <img class="pin" src="@/assets/forContact/pin.png" />
        <h3 class="map-title">Our location</h3>
      </div>

      <div class="map-wrapper">
        <iframe
          class="map-frame"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.7411808898805!2d104.89551077356433!3d11.570402744050202!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109517388680e15%3A0x63057e6682968f5!2sInstitute%20of%20Technology%20of%20Cambodia!5e0!3m2!1sen!2skh!4v1764574871884!5m2!1sen!2skh"
          allowfullscreen
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
        <a
          href="https://www.google.com/maps/place/Institute+of+Technology+of+Cambodia/@11.5685269,104.9182919,17z"
          target="_blank"
          rel="noopener noreferrer"
          class="map-overlay"
        ></a>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
export default {
  methods: {
    goToMap() {
      window.open(
        "https://www.google.com/maps/place/Institute+of+Technology+of+Cambodia/@11.5685269,104.9182919,17z",
        "_blank"
      );
    },
  },
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Baloo+2&family=Baloo+Chettan&family=Baloo+Tammudu+2:wght@400;500;600;700&display=swap');

.hero-container {
  position: relative;
  width: 90%;
  max-width: 85.813rem;
  border-radius: 1.25rem;
  overflow: hidden;
  margin: 3rem auto 0 auto;
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}

.hero-img {
  width: 100%;
  height: 20rem;
  object-fit: cover;
  display: block;
}

.overlay {
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  line-height: 2rem;
}

.hero-title {
  font-family: 'Baloo Tammudu 2', sans-serif;
  font-size: 4rem;
  font-weight: bold;
  margin: 0;
}

.hero-subtitle {
  font-family: 'Baloo Chettan', sans-serif;
  font-size: 1.25rem;
  margin-top: 0.25rem;
}

.contact-info {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  text-align: center;
  max-width: 90%;
  margin: 2rem auto 0;
}

.contact-item {
  flex: 1;
  min-width: 12rem;
  margin: 3rem 0;
}

.icon {
  display: block;
  width: 2.5rem;
  height: 2.5rem;
  object-fit: contain;
  margin: 0 auto 0.25rem;
}

.contact-title {
  font-family: 'Baloo 2', sans-serif;
  font-size: 1.125rem;
  font-weight: bold;
  color: black;
  margin: 0.25rem 0;
}

.contact-text {
  font-family: 'Baloo 2', sans-serif;
  font-size: 1.125rem;
  color: black;
  margin: 0;
}

.map-section {
  position: relative;
  max-width: 100%;
  margin: 0rem auto 10rem;
}

.map-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
  margin-left: 5rem;
}

.pin {
  width: 2.5rem;
  height: 2.5rem;
}

.map-title {
  font-family: 'Baloo 2', sans-serif;
  font-size: 1.75rem;
  font-weight: bold;
  color: #48742C;
}

.map-wrapper {
  position: relative;
  width: 90%;
  max-width: 85.813rem;
  margin: 0 auto;
  border-radius: 1.25rem;
  overflow: hidden;
  transition: transform 0.35s ease, box-shadow 0.35s ease;
}

.map-frame {
  width: 100%;
  height: 25rem;
  border: 0;
  display: block;
  border-radius: 1.25rem;
  transition: transform 0.35s ease, box-shadow 0.35s ease;
  pointer-events: none;
}

.map-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  z-index: 10;
  background: transparent;
}

.hero-container:hover,
.map-wrapper:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25);
}

</style>
