const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

const vegetables = [
  {
    id: 1,
    name: 'Carrot',
    price: 3,
    unit: 'kg',
    rating: 4,
    inStock: true,
    image: '/images/Carrot.png'
  },
  {
    id: 2,
    name: 'Cucumber',
    price: 2,
    unit: 'kg',
    rating: 3,
    inStock: true,
    image: '/images/cucumber.png'
  },
  {
    id: 3,
    name: 'Broccoli',
    price: 5,
    unit: 'kg',
    rating: 5,
    inStock: false,
    image: '/images/broccoli.png'
  },
  {
    id: 4,
    name: 'Cabbage',
    price: 4,
    unit: 'kg',
    rating: 4,
    inStock: true,
    image: '/images/cabbage.png'
  },
  {
    id: 5,
    name: 'bell_pepper',
    price: 3,
    unit: 'kg',
    rating: 5,
    inStock: true,
    image: '/images/bell_pepper.png'
  },
  {
    id: 6,
    name: 'cauliflower',
    price: 2,
    unit: 'kg',
    rating: 4,
    inStock: false,
    image: '/images/cauliflower.png'
  },

]


const meats = [
  {
    id: 1,
    name: 'Beef',
    price: 3,
    unit: 'kg',
    rating: 4,
    inStock: true,
    image: '/images/beef.png'
  },
  {
    id: 2,
    name: 'Egg',
    price: 2,
    unit: 'kg',
    rating: 3,
    inStock: true,
    image: '/images/egg.png'
  },
  {
    id: 3,
    name: 'Fish',
    price: 5,
    unit: 'kg',
    rating: 5,
    inStock: false,
    image: '/images/fish.png'
  },

]

const sets = [
  {
    title: "Soup",
    items: [
      { id: 1, name: "Brher Soup", price: 8.10, image: "/images/brher_soup.png" },
      { id: 2, name: "Korko Soup", price: 9.60, image: "/images/korko_soup.png" },
      { id: 3, name: "Mjo Soup", price: 7.10, image: "/images/mju_soup.png" },
      { id: 4, name: "Sour Soup", price: 8.70, image: "/images/sour_soup.png" }
    ]
  },
  {
    title: "Fried (Chha)",
    items: [
      { id: 5, name: "Chha Traukon", price: 5.10, image: "/images/chhaTrakuon.png" },
      { id: 6, name: "Chha Vegetables", price: 4.70, image: "/images/chhaVegetables.png" },
      { id: 7, name: "Spicy Chicken", price: 7.20, image: "/images/spicyChicken.png" },
      { id: 8, name: "Chha Kngay", price: 4.50, image: "/images/chhaKhgey.png" }
    ]
  },
  {
    title: "Steamed",
    items: [
      { id: 9, name: "Amok", price: 11.10, image: "/images/amok.png" },
      { id: 10, name: "Brhok", price: 9.30, image: "/images/brhok.png" },
      { id: 11, name: "Brhok Ktiss", price: 9.70, image: "/images/brhokKtis.png" },
      { id: 12, name: "Steam Fish", price: 6.80, image: "/images/streamFish.png" }
    ]
  }
]

app.get('/sets', (req, res) => {
  res.json(sets)
})


app.get('/vegetables', (req, res) => {
  res.json(vegetables)
})

app.get('/meats', (req, res) => {
  res.json(meats)
})

app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000')
})
