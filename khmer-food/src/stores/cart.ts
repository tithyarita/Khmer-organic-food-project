// stores/cart.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { auth, db } from '../firebase'
import { getUserStorage, saveUserStorage } from '../loginstorage'
import { doc, getDoc, setDoc } from 'firebase/firestore'

/* eslint-disable @typescript-eslint/no-explicit-any */
export const useCartStore = defineStore('cart', () => {
  const items = ref<any[]>([])

  // Resolve a stable key for cart documents. Prefer numeric userId, fall back to uid.
  const resolveUserKey = async (): Promise<string | null> => {
    const storage = getUserStorage()
    if (storage?.userId) return String(storage.userId)

    const uid = auth.currentUser?.uid ?? storage?.uid
    if (!uid) return null

    try {
      const userSnap = await getDoc(doc(db, 'users', uid))
      if (userSnap.exists()) {
        const data: any = userSnap.data()
        if (data.userId) {
          saveUserStorage({ ...storage, userId: data.userId, uid })
          return String(data.userId)
        }
      }
    } catch (e) {
      console.error('Failed to resolve cart user key:', e)
    }

    return String(uid)
  }

  const loadCart = async () => {
    const key = await resolveUserKey()
    if (!key) return
    const docRef = doc(db, 'carts', key)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      items.value = docSnap.data().items || []
    } else {
      items.value = []
      await setDoc(docRef, { items: [] })
    }
  }

  const saveCart = async () => {
    const key = await resolveUserKey()
    if (!key) return
    const docRef = doc(db, 'carts', key)
    await setDoc(docRef, { items: items.value })
  }

  const addItem = async (product: any) => {
    const existing = items.value.find(i => i.id === product.id)
    if (existing) {
      existing.qty = (existing.qty || 1) + (product.qty || 1)
    } else {
      items.value.push({ ...product, qty: product.qty || 1 })
    }
    await saveCart()
  }

  const updateQty = async (index: number, qty: number) => {
    if (index == null || index < 0 || index >= items.value.length) return
    items.value[index].qty = qty
    await saveCart()
  }

  // remove by index (used by CartView) or by id
  const removeItem = async (indexOrId: number | string) => {
    if (typeof indexOrId === 'number') {
      items.value.splice(indexOrId, 1)
    } else {
      items.value = items.value.filter(i => i.id !== indexOrId)
    }
    await saveCart()
  }

  const clear = async () => {
    items.value = []
    await saveCart()
  }

  // load cart on store init (best-effort, don't block)
  loadCart().catch((e) => console.warn('Failed to load cart on init', e))

  return { items, loadCart, saveCart, addItem, removeItem, updateQty, clear }
})
