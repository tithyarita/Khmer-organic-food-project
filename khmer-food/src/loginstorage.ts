// loginstorage.ts
export interface UserData {
  uid: string
  email: string
  name?: string
  phone?: string
  role?: string
}

// Save user to localStorage
export const saveUserStorage = (user: UserData) => {
  localStorage.setItem('user', JSON.stringify(user))
}

// Get user from localStorage
export const getUserStorage = (): UserData | null => {
  const data = localStorage.getItem('user')
  return data ? JSON.parse(data) : null
}

// Remove user from localStorage
export const logoutUser = () => {
  localStorage.removeItem('user')
}
