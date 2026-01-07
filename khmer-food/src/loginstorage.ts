export interface UserStorage {
  uid: string
  name: string
  phone: string
  email: string
}

const STORAGE_KEY = 'user'

export const saveUserStorage = (user: UserStorage): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export const getUserStorage = (): UserStorage | null => {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : null
}

export const logoutUser = (): void => {
  localStorage.removeItem(STORAGE_KEY)
}
