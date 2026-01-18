import { collection, addDoc, getDocs, query, orderBy, where } from 'firebase/firestore'
import { db } from '../firebase.js'
import { doc, getDoc } from 'firebase/firestore'

type OrderItem = {
  id: number | string
  name?: string
  price: number
  qty: number
  category?: string
}

export async function createOrder(order: {
  user?: any
  items: OrderItem[]
  subtotal: number
  delivery: number
  discount: number
  total: number
  paymentMethod?: string
  status?: string
}) {
  const col = collection(db, 'orders')
  const payload = {
    ...order,
    userId: order.user?.uid,
    status: order.status || 'pending',
    createdAt: new Date(),
  }

  const docRef = await addDoc(col, payload)
  return { id: docRef.id, ...payload }
}

export async function getAllOrders() {
  const col = collection(db, 'orders')
  const q = query(col, orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => {
    const data = d.data() as any
    // normalize createdAt
    const createdAt = data.createdAt && typeof (data.createdAt as any).toDate === 'function'
      ? (data.createdAt as any).toDate()
      : data.createdAt

    return { id: d.id, ...data, createdAt }
  })
}

export async function getOrdersByUser(uid: string) {
  const allOrders = await getAllOrders()
  return allOrders.filter(o => o.userId === uid || o.user?.uid === uid)
}

export async function getOrderById(orderId: string) {
  const ref = doc(db, 'orders', orderId)
  const snap = await getDoc(ref)
  if (!snap.exists()) return null
  const data = snap.data() as any
  // normalize createdAt
  const createdAt = data.createdAt && typeof (data.createdAt as any).toDate === 'function'
    ? (data.createdAt as any).toDate()
    : data.createdAt

  return { id: snap.id, ...data, createdAt }
}
