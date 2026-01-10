// Save logged-in user
export const saveUserStorage = (user) => {
  if (!user) return
  try {
    const existing = getUserStorage() || {}
    const merged = { ...existing, ...user }
    localStorage.setItem('user', JSON.stringify(merged))
  } catch (e) {
    // Fallback to overwrite on error
    localStorage.setItem('user', JSON.stringify(user))
  }
}

// Get logged-in user
export const getUserStorage = () => {
  const data = localStorage.getItem('user')
  return data ? JSON.parse(data) : null
}

// Check login status
export const isLoggedIn = () => {
  return !!localStorage.getItem('user')
}

// Logout
export const logoutUser = () => {
  localStorage.removeItem('user')
}
