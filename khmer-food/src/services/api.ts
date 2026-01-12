// import axios from 'axios'

// // Base Axios instance
// const api = axios.create({
//   baseURL: 'http://localhost:3000', // <-- your backend API
//   headers: {
//     'Content-Type': 'application/json',
//   },
// })

// // Optional: Add interceptors (for auth / logging)
// api.interceptors.request.use((config) => {
//   // Example: Add token if you have auth
//   // config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
//   return config
// })

// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error('API error:', error)
//     return Promise.reject(error)
//   },
// )

// export default api



import axios from 'axios'

// Base Axios instance
const api = axios.create({
  baseURL: 'http://localhost:3000', // backend API
  // ❌ DO NOT set Content-Type here
})

// Optional interceptors (safe)
api.interceptors.request.use((config) => {
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error.response?.data || error)
    return Promise.reject(error)
  },
)

export default api
