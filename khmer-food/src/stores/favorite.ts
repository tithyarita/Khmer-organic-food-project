// stores/favorite.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { db, auth } from '../firebase'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { getUserStorage, saveUserStorage } from '../loginstorage.js'
import router from '../router'

export const useFavoriteStore = defineStore('favorite', () => {
  const items = ref<any[]>([])

  // Resolve a stable user key for favorites collection.
  // Prefer numeric `userId` (from users doc/localStorage), fall back to auth.uid.
  const resolveUserKey = async (): Promise<string | null> => {
    const storage = getUserStorage()
    if (storage?.userId) return String(storage.userId)

    const uid = auth.currentUser?.uid ?? storage?.uid
    if (!uid) return null

    // Try to read users doc to obtain numeric userId
    try {
      const userSnap = await getDoc(doc(db, 'users', uid))
      if (userSnap.exists()) {
        const data: any = userSnap.data()
        if (data.userId) {
          // persist numeric userId into localStorage for future fast lookup
          saveUserStorage({ ...storage, userId: data.userId, uid })
          return String(data.userId)
        }
      }
    } catch (e) {
      console.error('Failed to resolve user key:', e)
    }

    // Fallback to uid string
    return String(uid)
  }

  // Load favorites for logged-in user
  const loadFavorites = async () => {
    const key = await resolveUserKey()
    if (!key) {
      items.value = []
      return
    }

    const refDoc = doc(db, 'favorites', key)
    const snap = await getDoc(refDoc)

    if (snap.exists()) {
      items.value = snap.data().items || []
    } else {
      items.value = []
      await setDoc(refDoc, { items: [] })
    }
  }

  // Save favorites to Firebase
  const saveFavorites = async () => {
    const key = await resolveUserKey()
    if (!key) return

    const refDoc = doc(db, 'favorites', key)
    await setDoc(refDoc, { items: items.value })
  }

  // Add product to favorites
  const addFavorite = async (product: any) => {
    const key = await resolveUserKey()

    // If user not logged in, prompt
    if (!key) {
      const goLogin = confirm('Please login first. Go to login page?')
      if (goLogin) router.push('/loginSignup')
      return
    }

    // If product not already in favorites
    const exists = items.value.find(p => p.id === product.id)
    if (!exists) {
      items.value.push(product)
      await saveFavorites() // save automatically
    }
  }

  const removeFavorite = async (id: string) => {
    items.value = items.value.filter(p => p.id !== id)
    await saveFavorites()
  }

  const clearFavorites = () => {
    items.value = []
  }

  return {
    items,
    loadFavorites,
    addFavorite,
    removeFavorite,
    clearFavorites
  }
})
