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
  fd.append('stock', String(data.stock))
  fd.append('image', data.imageFile)

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
  fd.append('stock', String(data.stock))

  if (data.imageFile) {
    fd.append('image', data.imageFile)
  }

  if (data.category === 'Vegetables') {
    return api.patch(`/vegetables/${data.id}`, fd)
  }

  if (data.category === 'Meats') {
    return api.patch(`/meats/${data.id}`, fd)
  }

  return api.patch(`/sets/${data.category}/${data.id}`, fd)
}

// =====================
// DELETE
// =====================
export const deleteVegetable = (id: number) =>
  api.delete(`/vegetables/${id}`)

export const deleteMeat = (id: number) =>
  api.delete(`/meats/${id}`)

export const deleteSetItem = (category: string, id: number) =>
  api.delete(`/sets/${category}/${id}`)
