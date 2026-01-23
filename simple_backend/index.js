const express = require('express')
const cors = require('cors')
const multer = require('multer')
const path = require('path')
const fs = require('fs')

const app = express()
app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())
// Serve uploaded images
app.use('/uploads', express.static('uploads'))

// 🔹 Setup multer for file uploads
const upload = multer({
  dest: 'uploads/', // folder to store uploaded images
  limits: { fileSize: 5 * 1024 * 1024 }, // optional: limit file size to 5MB
})

// ✅ LOAD sets from file or initialize to json file for save API
let sets = []
function getNextSetId() {
  return sets
    .flatMap(c => c.items) // flatten all items
    .reduce((max, i) => Math.max(max, i.id), 0) + 1
}

function loadSets() {
  if (fs.existsSync('sets.json')) {
    sets = JSON.parse(fs.readFileSync('sets.json'))
  } else {
    sets = [
      { title: "Soup", items: [] },
      { title: "Fried (Chha)", items: [] },
      { title: "Steamed", items: [] }
    ]
  }
}

loadSets()

function saveSets() {
  fs.writeFileSync('sets.json', JSON.stringify(sets, null, 2))
}

// ✅ LOAD vegetables and meats from file or initialize to json file for save API
let vegetables = []
let meats = []
function loadVegetables() {

  if (fs.existsSync('vegetables.json')) {
    vegetables = JSON.parse(fs.readFileSync('vegetables.json'))
  } else {
    vegetables = []
  }
} 


function saveVegetables() {
  fs.writeFileSync('vegetables.json', JSON.stringify(vegetables, null, 2))
}

function loadMeats() {
  if (fs.existsSync('meats.json')) {
    meats = JSON.parse(fs.readFileSync('meats.json'))
  } else {
    meats = []
  }
}

function saveMeats() {
  fs.writeFileSync('meats.json', JSON.stringify(meats, null, 2))
}

loadVegetables()
loadMeats()

// 🔹 GET APIs
app.get('/vegetables', (req, res) => {
  res.json(vegetables)
})
app.get('/meats', (req, res) => {
  res.json(meats)
})
app.get('/sets', (req, res) => {
  res.json(sets)
}) 

// 🔹 POST API with vegetables

app.post('/vegetables', upload.array('images', 4), (req, res) => {
  const { name, price, unit, rating, stock, discount } = req.body
  const imageFiles = req.files

  if (!imageFiles || imageFiles.length === 0) {
    return res.status(400).json({ message: 'Image files are required' })
  }
const newItem = {
  id: vegetables.length + 1,
  name,
  category: 'vegetables',
  price: Number(price),
  unit,
  rating: Number(rating),
  stock: stock !== undefined ? Number(stock) : 0,
  discount: discount ? Number(discount) : 0, 
  // image: `http://localhost:3000/uploads/${req.file.filename}`
  image: imageFiles.map(file => `http://localhost:3000/uploads/${file.filename}`) // ✅ multiple images

}


  vegetables.push(newItem)
  saveVegetables() // ✅ persist to file
  res.status(201).json(newItem)
})

// 🔹 DELETE API
app.delete('/vegetables/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = vegetables.findIndex(v => v.id === id)

  if (index === -1) {
    return res.status(404).json({ message: 'Vegetable not found' })
  }

  const deleted = vegetables.splice(index, 1)
  saveVegetables()
  res.json({ message: 'Deleted successfully', deleted: deleted[0] })
})

//Update vegetables
app.patch('/vegetables/:id', upload.array('images', 4), (req, res) => {
  const id = Number(req.params.id)
  const index = vegetables.findIndex(v => v.id === id)

  if (index === -1) {
    return res.status(404).json({ message: 'Vegetable not found' })
  }

  const { name, price, unit, rating, stock, discount } = req.body

  const imageFiles = req.files

  vegetables[index] = {
    ...vegetables[index],
    name: name ?? vegetables[index].name,
    price: price ? Number(price) : vegetables[index].price,
    unit: unit ?? vegetables[index].unit,
    rating: rating ? Number(rating) : vegetables[index].rating,
    stock: stock !== undefined ? Number(stock) : vegetables[index].stock,
    discount: discount ? Number(discount) : vegetables[index].discount, 
    image: imageFiles && imageFiles.length > 0
      ? imageFiles.map(file => `http://localhost:3000/uploads/${file.filename}`)
      : vegetables[index].image
  }

  saveVegetables()
  res.json(vegetables[index])
})

// 🔹 POST API with image upload for meats
app.post('/meats', upload.array('images', 4), (req, res) => {
  const { name, price, unit, rating, stock, discount } = req.body
  const imageFiles = req.files

  if (!imageFiles || imageFiles.length === 0) {
    return res.status(400).json({ message: 'Image files are required' })
  }

  const newItem = {
    id: meats.length + 1, // sequential IDs
    name,
    category:'meats',
    price: Number(price),
    unit,
    rating: Number(rating),
    stock: stock !== undefined ? Number(stock) : 0,
    discount: discount ? Number(discount) : 0,
    // image: `http://localhost:3000/uploads/${imageFile.filename}`
    image: imageFiles.map(file => `http://localhost:3000/uploads/${file.filename}`) // ✅ multiple images
  }

  meats.push(newItem)
  saveMeats() // ✅ persist to file
  res.status(201).json(newItem)
})
//DELETE API for meats
app.delete('/meats/:id', (req, res) => {
  const id = Number(req.params.id)
  const index = meats.findIndex(m => m.id === id)
  if (index === -1) {
    return res.status(404).json({ message: 'Meat not found' })
  }
  const deleted = meats.splice(index, 1)
  saveMeats()
  res.json({ message: 'Deleted successfully', deleted: deleted[0] })
})

//Update meats
app.patch('/meats/:id', upload.array('images', 4), (req, res) => {
  const id = Number(req.params.id)
  const index = meats.findIndex(m => m.id === id)
  if (index === -1) {
    return res.status(404).json({ message: 'Meat not found' })
  }
  const { name, price, unit, rating, stock, discount } = req.body
  const imageFiles = req.files
  meats[index] = {
    ...meats[index],
    name: name ?? meats[index].name,
    price: price ? Number(price) : meats[index].price,
    unit: unit ?? meats[index].unit,
    rating: rating ? Number(rating) : meats[index].rating,
    stock: stock !== undefined ? Number(stock) : meats[index].stock,
    discount: discount ? Number(discount) : meats[index].discount,
    image: imageFiles && imageFiles.length > 0
      ? `http://localhost:3000/uploads/${imageFiles[0].filename}`
      : meats[index].image
  }
  saveMeats()
  res.json(meats[index])
})

// 🔹 POST API with image upload for sets
// let globalId =1;
app.post('/sets', upload.array('images', 4), (req, res) => {
  const { name, price, unit, rating, stock, category, discount, ingredients } = req.body
  const imageFiles = req.files

  if (!imageFiles || imageFiles.length === 0) {
    return res.status(400).json({ message: 'Image files are required' })
  }

  // Find the category in sets
  const categoryIndex = sets.findIndex(s => s.title.toLowerCase() === category.toLowerCase())
  if (categoryIndex === -1) {
    return res.status(404).json({ message: 'Category not found' })
  }

  // Create new item
  const newItem = {
    id: getNextSetId(), // sequential ID inside category
    name,
    category,
    price: Number(price),
    unit,
    rating: Number(rating),
    stock: stock !== undefined ? Number(stock) : 0,
    discount: discount ? Number(discount) : 0,
    ingredients: ingredients ? JSON.parse(ingredients) : [],
    // image: `http://localhost:3000/uploads/${imageFiles[0].filename}`
    image: imageFiles.map(file => `http://localhost:3000/uploads/${file.filename}`) // ✅ multiple images
  }

  // Push into the right category
  sets[categoryIndex].items.push(newItem)
  saveSets() // ✅ persist to file
  res.status(201).json(newItem)
})

// Delete a specific item inside a category
app.delete('/sets/:category/:id', (req, res) => {
  const { category, id } = req.params
  const categoryIndex = sets.findIndex(s => s.title.toLowerCase() === category.toLowerCase())

  if (categoryIndex === -1) {
    return res.status(404).json({ message: 'Category not found' })
  }

  const itemIndex = sets[categoryIndex].items.findIndex(i => i.id === Number(id))
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found' })
  }

  const deleted = sets[categoryIndex].items.splice(itemIndex, 1)
  saveSets()
  res.json({ message: 'Deleted successfully', deleted: deleted[0] })
})

// Update a specific item inside a category
app.patch('/sets/:category/:id', upload.array('images', 4), (req, res) => {
  const { category, id } = req.params
  const categoryIndex = sets.findIndex(s => s.title.toLowerCase() === category.toLowerCase())

  if (categoryIndex === -1) {
    return res.status(404).json({ message: 'Category not found' })
  }

  const itemIndex = sets[categoryIndex].items.findIndex(i => i.id === Number(id))
  if (itemIndex === -1) {
    return res.status(404).json({ message: 'Item not found' })
  }

  const { name, price, unit, rating, stock, discount, ingredients } = req.body
  const imageFiles = req.files

  sets[categoryIndex].items[itemIndex] = {
    ...sets[categoryIndex].items[itemIndex],
    name: name ?? sets[categoryIndex].items[itemIndex].name,
    price: price ? Number(price) : sets[categoryIndex].items[itemIndex].price,
    unit: unit ?? sets[categoryIndex].items[itemIndex].unit,
    rating: rating ? Number(rating) : sets[categoryIndex].items[itemIndex].rating,
    stock: stock !== undefined ? Number(stock) : sets[categoryIndex].items[itemIndex].stock,
    discount: discount ? Number(discount) : sets[categoryIndex].items[itemIndex].discount,
    ingredients: ingredients ? JSON.parse(ingredients) : sets[categoryIndex].items[itemIndex].ingredients,
    image: imageFiles
      ? `http://localhost:3000/uploads/${imageFiles[0].filename}`
      : sets[categoryIndex].items[itemIndex].image
  }
  saveSets()
  res.json(sets[categoryIndex].items[itemIndex])
})


app.post('/payment-success', (req, res) => {
  console.log('==============================')
  console.log('PAYMENT SUCCESS API HIT')
  console.log('BODY:', req.body)
  console.log('==============================')

  const { items } = req.body
  let vegUpdated = false
  let meatUpdated = false
  let setUpdated = false

  items.forEach(item => {
    const category = String(item.category).toLowerCase()
    const id = Number(item.id)
    const qty = Number(item.quantity)

    // 🥬 VEGETABLES
    if (category === 'vegetables') {
      const product = vegetables.find(v => Number(v.id) === id)
      if (product) {
        console.log(`Veg Before (${product.name}):`, product.stock)
        product.stock = Math.max(0, product.stock - qty)
        console.log(`Veg After (${product.name}):`, product.stock)
        vegUpdated = true
      }
    }

    // 🥩 MEATS
    else if (category === 'meats') {
      const product = meats.find(m => Number(m.id) === id)
      if (product) {
        console.log(`Meat Before (${product.name}):`, product.stock)
        product.stock = Math.max(0, product.stock - qty)
        console.log(`Meat After (${product.name}):`, product.stock)
        meatUpdated = true
      }
    }

    // 🍲 SETS (Soup / Fried / Steamed)
    else {
      sets.forEach(set => {
        const product = set.items.find(i => Number(i.id) === id)
        if (product) {
          console.log(`Set Before (${product.name}):`, product.stock)
          product.stock = Math.max(0, product.stock - qty)
          console.log(`Set After (${product.name}):`, product.stock)
          setUpdated = true
        }
      })
    }
  })

  // ✅ SAVE ONLY WHAT CHANGED
  if (vegUpdated) saveVegetables()
  if (meatUpdated) saveMeats()
  if (setUpdated) saveSets()

  res.json({ message: 'Stock updated successfully' })
})




// 🔹 Start the server

app.listen(3000, () => {
  console.log('Backend running on http://localhost:3000')
})