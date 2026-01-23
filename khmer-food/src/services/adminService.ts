// import api from './api'

// // =====================
// // GET
// // =====================
// export const getVegetables = () => api.get('/vegetables')
// export const getMeats = () => api.get('/meats')
// export const getSets = () => api.get('/sets')

// // =====================
// // ADD
// // =====================
// export const addProduct = (data: any) => {
//   if (data.category === 'Vegetables') {
//     return api.post('/vegetables', data)
//   }

//   if (data.category === 'Meats') {
//     return api.post('/meats', data)
//   }

//   // Set food: Soup / Fried (Chha) / Steamed
//   return api.post(`/sets/${data.category}`, data)
// }

// // =====================
// // UPDATE
// // =====================
// export const updateProduct = (data: any) => {
//   if (data.category === 'Vegetables') {
//     return api.patch(`/vegetables/${data.id}`, data)
//   }

//   if (data.category === 'Meats') {
//     return api.patch(`/meats/${data.id}`, data)
//   }

//   return api.patch(`/sets/${data.category}/${data.id}`, data)
// }

// // =====================
// // DELETE
// // =====================
// // Vegetables
// export const deleteVegetable = (id: number) =>
//   api.delete(`/vegetables/${id}`)

// // Meats
// export const deleteMeat = (id: number) =>
//   api.delete(`/meats/${id}`)

// // Set food
// export const deleteSetItem = (category: string, id: number) =>
//   api.delete(`/sets/${category}/${id}`)




import api from './api'

// =====================
// GET
// =====================
export const getVegetables = () => api.get('/vegetables')
export const getMeats = () => api.get('/meats')
export const getSets = () => api.get('/sets')

// =====================
// ADD (FIXED)
// =====================
export const addProduct = (data: any) => {
  const fd = new FormData()

  fd.append('name', data.name)
  fd.append('price', String(data.price))
  fd.append('unit', data.unit)
  fd.append('rating', String(data.rating))
  fd.append('discount', String(data.discount))
  fd.append('stock', String(data.stock))
  if (data.ingredients) {
    fd.append('ingredients', JSON.stringify(data.ingredients.split(',').map((ing: string) => ing.trim())))
  }

  if (data.imageFiles && data.imageFiles.length > 0) {
    for (const file of data.imageFiles) {
      fd.append('images', file) // ✅ append each file under the "images" key
    }
  }
  // fd.append('images', data.imageFiles[0]) // Only first image

  if (data.category === 'Vegetables') {
    return api.post('/vegetables', fd)
  }

  if (data.category === 'Meats') {
    return api.post('/meats', fd)
  }

  // SETS
  fd.append('category', data.category)
  return api.post('/sets', fd)
}

// =====================
// UPDATE (FIXED)
// =====================

export const updateProduct = (data: any) => {
  const fd = new FormData()

  fd.append('name', data.name)
  fd.append('price', String(data.price))
  fd.append('unit', data.unit)
  fd.append('rating', String(data.rating))
  fd.append('discount', String(data.discount))
  fd.append('stock', String(data.stock))
  if (data.ingredients) {
    fd.append('ingredients', JSON.stringify(data.ingredients.split(',').map((ing: string) => ing.trim())))
  }

  // if (data.imageFiles) {
  //   fd.append('images', data.imageFiles[0]) // Only first image
  // }

  if (data.imageFiles && data.imageFiles.length > 0) {
    for (const file of data.imageFiles) {
      fd.append('images', file) // ✅ append each file under the "images" key
    }
  }

  if (data.category === 'Vegetables') {
    return api.patch(`/vegetables/${data.id}`, fd)
  }

  if (data.category === 'Meats') {
    return api.patch(`/meats/${data.id}`, fd)
  }

  return api.patch(`/sets/${data.category}/${data.id}`, fd)
}

// export const updateProduct = (data: any) => {
//   const fd = new FormData()

//   fd.append('name', data.name)
//   fd.append('price', String(data.price))
//   fd.append('unit', data.unit)
//   fd.append('rating', String(data.rating))
//   fd.append('discount', String(data.discount))
//   fd.append('stock', String(data.stock))

//   if (data.ingredients) {
//     fd.append(
//       'ingredients',
//       JSON.stringify(
//         data.ingredients.split(',').map((ing: string) => ing.trim())
//       )
//     )
//   }

//   // ✅ Multiple images
//   if (data.imageFiles && data.imageFiles.length > 0) {
//     for (const file of data.imageFiles) {
//       fd.append('images', file) // backend expects "images"
//     }
//   }

//   if (data.category === 'Vegetables') {
//     return api.patch(`/vegetables/${data.id}`, fd)
//   }

//   if (data.category === 'Meats') {
//     return api.patch(`/meats/${data.id}`, fd)
//   }

//   return api.patch(`/sets/${data.category}/${data.id}`, fd)
// }

// =====================
// DELETE
// =====================

export const deleteVegetable = (id: number) =>
  api.delete(`/vegetables/${id}`)

export const deleteMeat = (id: number) =>
  api.delete(`/meats/${id}`)

export const deleteSetItem = (category: string, id: number) =>
  api.delete(`/sets/${category}/${id}`)
