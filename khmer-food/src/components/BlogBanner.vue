<template>
  <section class="cute-banner">
    <img src="/forBlog/BlogBanner.png" class="banner-bg" />

    <div class="cute-overlay"></div>

    <div class="cute-content">
      <span class="cute-tag">🌱 Khmer Food</span>
      <h1>Our Lovely Blog</h1>
      <p>
        Discover tasty Cambodian recipes, sweet farm stories and fresh ideas from nature.
      </p>
    </div>
  </section>
</template>

<style scoped>
.cute-banner{
  position:relative;
  height:380px;
  margin:2rem 4%;
  border-radius:30px;
  overflow:hidden;
  box-shadow:0 25px 50px rgba(0,0,0,0.15);
}

.banner-bg{
  width:100%;
  height:100%;
  object-fit:cover;
}

.cute-overlay{
  position:absolute;
  inset:0;
  background:linear-gradient(
    180deg,
    rgba(40,120,40,0.25),
    rgba(20,80,20,0.8)
  );
}

.cute-content{
  position:absolute;
  inset:0;
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  text-align:center;
  color:white;
  padding:2rem;
}

.cute-tag{
  background:rgba(255,255,255,0.2);
  padding:8px 18px;
  border-radius:999px;
  font-size:0.85rem;
  margin-bottom:1rem;
  letter-spacing:1px;
}

.cute-content h1{
  font-size:3rem;
  margin:0;
  font-weight:900;
  background:linear-gradient(135deg,#b8ff9c,#5fcf65);
  -webkit-background-clip:text;
  -webkit-text-fill-color:transparent;
}

.cute-content p{
  max-width:680px;
  margin-top:1rem;
  font-size:1.05rem;
  line-height:1.6;
  color:#ecffec;
}

@media(max-width:768px){
  .cute-banner{
    height:280px;
    margin:1rem;
    border-radius:20px;
  }

  .cute-content h1{
    font-size:2rem;
  }

  .cute-content p{
    font-size:0.95rem;
  }
}
</style>
