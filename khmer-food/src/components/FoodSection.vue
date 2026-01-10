<template>
  <div class="food-section">
    <FoodBlog
      v-for="(item, index) in filteredBlogs"
      :key="index"
      :title="item.title"
      :description="item.description"
      :img="item.img"
      :bgColor="item.bgColor"
      :reverse="item.reverse"
      :borderColor="item.borderColor"
    />
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/no-explicit-any */
import FoodBlog from '@/components/FoodBlog.vue';

export default {
  name: 'FoodSection',
  components: { FoodBlog },
  data() {
    return {
      foodBlogs: [
        { title: 'Brher Soup', description: `This creamy curry is a simple and comforting recipe you can cook in under 30 minutes. Perfect for busy days or family dinners. First, heat a little oil in a pan and cook the onion until it becomes soft. Next, mix in the curry powder and stir for one minute. Then, add the meat and cook until it turns lightly brown. After that, pour in the coconut milk and let it simmer for about 15 minutes. Finally, add salt and pepper to taste and serve warm with rice.`, img: '/forBlog/Brher.png', bgColor: '#ffffff', reverse: false, borderColor: '#134E09' },
        { title: 'Korko Soup', description: `This traditional mixed-vegetable soup is rich, thick, and comforting. Start by frying your kroeung paste until it smells good. Then, add the meat and cook until it changes color. After that, pour in water and bring it to a boil. Add vegetables like eggplant, papaya, and long beans. Let everything simmer until soft. Finish by stirring in roasted rice powder and serve hot.`, img: '/forBlog/Korko.png', bgColor: '#8DB65A', reverse: true, borderColor: '#ffffff' },
        { title: 'Mju Soup', description: `This sour and aromatic soup is perfect for refreshing meals. Begin by heating a bit of oil and frying your kroeung until fragrant. Add the meat and cook until lightly brown. Then, pour in water and let it boil for around 10–15 minutes. Add pineapple, tomatoes, and tamarind paste for the sour taste. Finally, season with salt, sugar, and fish sauce before serving.`, img: '/forBlog/Mju.png', bgColor: '#ffffff', reverse: false, borderColor: '#134E09' },
        { title: 'Sour Soup', description: `This clear sour soup is simple and bright. First, boil water and add smashed garlic, lemongrass, and tomatoes. Then, add the fish and let it cook gently. After that, mix in tamarind or lime juice for the sour flavor. Finally, season with salt and fish sauce, and finish with fresh herbs before serving.`, img: '/forBlog/Sour.png', bgColor: '#8DB65A', reverse: true, borderColor: '#ffffff' },
        { title: 'Chha Trakuon', description: `This stir-fried morning glory is fast and flavorful. Heat oil in a pan and fry garlic until golden. Next, add the morning glory and stir quickly on high heat. Add oyster sauce, fish sauce, and a little sugar. Toss everything for about 2 minutes, then serve immediately while it’s crisp and fresh.`, img: '/forBlog/CharTrkoun.png', bgColor: '#ffffff', reverse: false, borderColor: '#134E09' },
        { title: 'Chha Vegetables', description: `This vegetable stir-fry is colorful, healthy, and easy to cook. Start by heating oil and frying garlic until fragrant. Add mixed vegetables like carrot, broccoli, and baby corn. Stir for a few minutes, then add seasoning with soy sauce and oyster sauce. Let it cook until the vegetables are tender but still crunchy, then serve warm.`, img: '/forBlog/ChhaVegetables.png', bgColor: '#8DB65A', reverse: true, borderColor: '#ffffff' },
        { title: 'Spicy Chicken', description: `This spicy chicken stir-fry is bold and aromatic. Heat a little oil and fry kroeung until it smells good. Add chicken and cook until lightly brown. Next, mix in chili, lemongrass, and basil leaves. Stir everything together for a few minutes. Add fish sauce and a bit of sugar, then serve hot.`, img: '/forBlog/SpicyChicken.png', bgColor: '#ffffff', reverse: false, borderColor: '#134E09' },
        { title: 'Chha Khgey', description: `Put the oil into a wok, add garlic, palm sugar, fish sauce and fry until it gets slightly brown. Add the beef and fry for 2 mins. Add some water to prevent from dry. Then add ginger and stir fry again. Add chilli sauce, and garnish with spring onion.`, img: '/forBlog/ChhaKhgey.png', bgColor: '#8DB65A', reverse: true, borderColor: '#ffffff' },
        { title: 'Amok', description: `Add everything mixed in a bowl (except for banana leaves) and then, after mixing, add everything into the banana leaves and steam for 25 mins on high heat.`, img: '/forBlog/Amok.png', bgColor: '#ffffff', reverse: false, borderColor: '#134E09' },
        { title: 'Brhok', description: `This classic fermented fish dip is strong but deeply loved. Start by frying garlic, lemongrass, and chili until fragrant. Add prahok and stir gently until it melts. Next, add a bit of pork or fish and cook until mixed well. Then, add water and let it simmer until the flavors blend. Serve with fresh vegetables.`, img: '/forBlog/Brhok.png', bgColor: '#8DB65A', reverse: true, borderColor: '#ffffff' },
        { title: 'Brohok Ktis', description: `This creamy prahok dip is rich and delicious. Heat oil and fry kroeung until fragrant. Add minced pork and cook until brown. Next, add prahok and stir well. After that, pour in coconut milk and let it simmer until thick and creamy. Add palm sugar and fish sauce, then adjust before serving.`, img: '/forBlog/BrhokKtis.png', bgColor: '#ffffff', reverse: false, borderColor: '#134E09' },
        { title: 'Steam Fish', description: `This gentle steamed fish is simple and healthy. First, clean the fish and place it on a plate with garlic, ginger, tomatoes, and herbs. Drizzle fish sauce and a little sugar on top. Then steam for 15–20 minutes until soft. Serve warm with rice.`, img: '/forBlog/StreamFish.png', bgColor: '#8DB65A', reverse: true, borderColor: '#ffffff' }
      ]
    };
  },
  computed: {
    filteredBlogs(): any[] {
      const q = String((this as any).$route?.query?.q || '').trim().toLowerCase()
      if (!q) return (this as any).foodBlogs
      return (this as any).foodBlogs.filter((b: any) => {
        const title = (b.title || '').toLowerCase()
        const desc = (b.description || '').toLowerCase()
        return title.includes(q) || desc.includes(q)
      })
    }
  }
}
</script>
          img: "/forBlog/Sour.png",

          bgColor: "#8DB65A",
