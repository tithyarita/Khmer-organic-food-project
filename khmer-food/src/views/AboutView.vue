<template>
  <div class="about-container">
    <div class="header-row">
      <img src="@/assets/forAboutUs/logoAb.png" alt="Logo" class="header-photo" />
      <div class="header-text">
        <h1 class="main-title">ABOUT US</h1>
        <p class="subtitle">Welcome to our shop! Quality Khmer Food Sets You Can Trust!</p>
      </div>
    </div>

    <h2 class="discover-title">Let's Discover Who We Are</h2>

    <div class="discover-box">
      <div class="box mission-box">
        <h3 class="box-title">What’s our mission?</h3>
        <p class="box-text">
          We believe every meal tells a story—a story of family, tradition, and the flavors of Cambodia.
          Our ingredient sets make it easy for you to bring those stories into your kitchen.
        </p>
      </div>

      <div class="right-column">
        <div class="box purpose-box">
          <h3 class="box-title">What's our purpose?</h3>
          <p class="box-text">
            Our purpose is simple but profound: to make Khmer cooking easier, fresher, and full of love.
            We support families, students, and busy people who lack time to shop or prepare everything
            or who are unfamiliar with Khmer food ingredients.
          </p>
        </div>

        <div class="box product-box">
          <h3 class="box-title product-title">Why our product?</h3>
          <p class="box-text product-text">
            Every ingredient we offer—fresh vegetables, quality meats, and ready-to-cook sets—is carefully
            selected for safety, quality, and taste. We partner with trusted local farmers to bring the best
            of Cambodia to your table.
          </p>
        </div>
      </div>
    </div>

    <h2 class="from-us-title">From us</h2>
    <div class="from-us-img">
      <img src="@/assets/forAboutUs/family.png" alt="Family" />
    </div>

    <p class="from-us-text">
      At our shop, we believe food is more than something you eat; it is comfort, culture, and connection.
      With our fresh ingredients and Khmer cooking sets, you can prepare meals that bring your family together,
      remind you of home, and keep Cambodian traditions alive in every dish. We are here to support your
      cooking journey with care, quality, and love.
    </p>
  </div>
</template>

<script lang="ts">
export default {};
</script>

<!-- Import fonts globally -->
<style>
@import url('https://fonts.googleapis.com/css2?family=Baloo+Tammudu+2:wght@400;500;600;700&family=Baloo+Chettan:wght@400;700&display=swap');
</style>

<style scoped>
.about-container {
  width: 100%;
  max-width: 1200px;
  margin: auto;
  font-family: Arial, sans-serif;
  padding: 1rem;
}

.header-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8rem;
  flex-wrap: wrap;
  margin-top: 1rem;
  line-height: 2rem;

}

.header-photo {
  width: 17.5rem;
  max-width: 40%;
  margin-left: 2rem;
  margin-bottom: 1rem;
  height: auto;
  object-fit: contain;
}

.header-text {
  flex: 1;
  min-width: 250px;
}

.main-title {
  font-family: "Baloo Tammudu 2", sans-serif;
  font-size: 5rem;
  font-weight: bold;
  color: #2d7600;
  margin: 0;
}

.subtitle {
  font-family: "Baloo Chettan", sans-serif;
  font-size: 1.125rem;
  color: #59b500;
  margin-top: 0.5rem;
}

.discover-title {
  font-family: "Baloo Chettan", sans-serif;
  font-size: 2.5rem;
  color: #213805;
  text-align: center;
  margin-top: 3rem;
  margin-bottom: 1rem;
}

.discover-box {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.25rem;
  flex-wrap: wrap;
}

.right-column {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
  min-width: 250px;
}

.mission-box {
  background: #e0ecd1;
  flex: 1;
  min-width: 250px;
  border-radius: 1.25rem 0 1.25rem 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  padding: 1rem;
}

.mission-box .box-title {
  font-family: "Baloo Chettan", sans-serif;
  font-size: 1.125rem;
  font-weight: bold;
  color: black;
  margin-bottom: 0.625rem;
}

.mission-box .box-text {
  font-family: "Baloo Tammudu 2", sans-serif;
  font-size: 1.125rem;
  color: black;
}

.purpose-box {
  background: #6ec007;
  border-radius: 1.25rem 1.25rem 0 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  padding: 1rem;
}

.purpose-box .box-title {
  font-family: "Baloo Chettan", sans-serif;
  font-size: 1.125rem;
  font-weight: bold;
  color: black;
  margin-bottom: 0.625rem;
}

.purpose-box .box-text {
  font-family: "Baloo Tammudu 2", sans-serif;
  font-size: 1.125rem;
  color: black;
}

.product-box {
  background-color: #548d0c;
  border-radius: 0 0 1.25rem 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  padding: 1rem;
}

.product-box .product-title {
  font-family: "Baloo Chettan", sans-serif;
  font-size: 1.125rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.625rem;
}

.product-box .product-text {
  font-family: "Baloo Tammudu 2", sans-serif;
  font-size: 1.125rem;
  color: white;
}

.from-us-title {
  font-family: "Baloo Chettan", sans-serif;
  font-size: 2.5rem;
  color: #213805;
  text-align: center;
  margin-top: 3rem;
  margin-bottom: 1rem;
}

.from-us-img img {
  width: 17.5rem;
  height: 17.5rem;
  display: block;
  margin: 0 auto 2.25rem auto;
  object-fit: cover;
  border-radius: 1rem;
}

.from-us-text {
  font-family: "Baloo Tammudu 2", sans-serif;
  font-size: 1.125rem;
  color: black;
  text-align: center;
  line-height: 1.6;
  margin: 0 auto 2rem auto;
  max-width: 90%;
}

@media (max-width: 900px) {
  .header-row {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .discover-box {
    flex-direction: column;
    align-items: center;
  }

  .right-column {
    width: 100%;
  }

  .mission-box,
  .purpose-box,
  .product-box {
    width: 90%;
    min-width: auto;
  }

  .from-us-img img {
    width: 18rem;
    height: 18rem;
  }

  .from-us-title,
  .discover-title {
    font-size: 1.5rem;
  }

  .from-us-text {
    font-size: 1.125rem;
  }
}
</style>
