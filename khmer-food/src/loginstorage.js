// loginstorage.js

// Save user info to localStorage after login
export const saveUserStorage = (user) => {
  if (!user) return
  localStorage.setItem('user', JSON.stringify(user))
}

// Get currently logged-in user from localStorage
export const getUserStorage = () => {
  const user = localStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

// Log out user and remove data from localStorage
export const logoutUser = () => {
  localStorage.removeItem('user')
}
