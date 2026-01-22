import { collection, addDoc, getDocs, query, orderBy, where, updateDoc, doc } from 'firebase/firestore'
import { db } from '../firebase.js'
import { doc as docRef, getDoc } from 'firebase/firestore'

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
  paymentStatus?: string
}) {
  const col = collection(db, 'orders')
  const payload = {
    ...order,
    userId: order.user?.uid,
    status: order.status || 'pending',
    paymentStatus: order.paymentStatus || 'unpaid',
    createdAt: new Date(),
    paymentDate: order.paymentStatus === 'paid' ? new Date() : null,
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
    // normalize paymentDate
    const paymentDate = data.paymentDate && typeof (data.paymentDate as any).toDate === 'function'
      ? (data.paymentDate as any).toDate()
      : data.paymentDate

    return { id: d.id, ...data, createdAt, paymentDate }
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
  // normalize paymentDate
  const paymentDate = data.paymentDate && typeof (data.paymentDate as any).toDate === 'function'
    ? (data.paymentDate as any).toDate()
    : data.paymentDate

  return { id: snap.id, ...data, createdAt, paymentDate }
}

export async function updateOrderStatus(orderId: string, status: string) {
  const ref = doc(db, 'orders', orderId)
  await updateDoc(ref, { status, updatedAt: new Date() })
}

export async function autoUpdateOrderStatuses() {
  const allOrders = await getAllOrders()
  const now = new Date()

  for (const order of allOrders) {
    if (order.paymentStatus !== 'paid' || !order.paymentDate) continue

    const paymentDate = new Date(order.paymentDate)
    const daysSincePaid = (now.getTime() - paymentDate.getTime()) / (1000 * 60)

    let newStatus = order.status

    if (daysSincePaid >= 5) {
      newStatus = 'completed'
    } else if (daysSincePaid >= 3) {
      newStatus = 'delivering'
    } else if (daysSincePaid >= 1) {
      newStatus = 'preparing'
    }

    if (newStatus !== order.status) {
      await updateOrderStatus(order.id, newStatus)
    }
  }
}

export async function updateOrderRated(orderId: string, rated: boolean) {
  const ref = doc(db, 'orders', orderId)
  await updateDoc(ref, { rated, updatedAt: new Date() })
}
