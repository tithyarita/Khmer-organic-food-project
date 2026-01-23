import { collection, addDoc, getDocs, query, orderBy, where, updateDoc, doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase.js'

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
    const minutesSincePaid = (now.getTime() - paymentDate.getTime()) / (1000 * 60) // Convert to minutes

    let newStatus = order.status

    if (minutesSincePaid >= 5) { // 5 minutes -> completed
      newStatus = 'completed'
    } else if (minutesSincePaid >= 3) { // 3 minutes -> delivering
      newStatus = 'delivering'
    } else if (minutesSincePaid >= 1) { // 1 minute -> preparing
      newStatus = 'preparing'
    }

    if (newStatus !== order.status) {
      await updateOrderStatus(order.id, newStatus)
      console.log(`Order ${order.id} status updated to ${newStatus} (${minutesSincePaid.toFixed(1)} minutes since payment)`)
    }
  }
}

export async function updateOrderRated(orderId: string, rated: boolean) {
  const ref = doc(db, 'orders', orderId)
  await updateDoc(ref, { rated, updatedAt: new Date() })
}

export async function getTopProducts(limit: number = 4, dateRange: 'today' | 'all' = 'today') {
  const allOrders = await getAllOrders()
  console.log('All orders:', allOrders.length)

  let startDate: Date | null = null
  let endDate: Date | null = null

  if (dateRange === 'today') {
    // Get today's date (start of day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    startDate = today
    endDate = new Date(today)
    endDate.setDate(endDate.getDate() + 1)
    console.log('Filtering orders from:', startDate.toISOString(), 'to:', endDate.toISOString())
  } else {
    // All time - no date filter
    console.log('No date filter - using all orders')
  }

  const productMap: Record<string, { id: string | number, name: string, qty: number, revenue: number, image?: string, price: number }> = {}

  allOrders.forEach(order => {
    // Apply date filter if specified
    const orderDate = new Date(order.createdAt)
    const dateMatches = !startDate || !endDate || (orderDate >= startDate && orderDate < endDate)

    if (dateMatches && order.items) {
      order.items.forEach((item: any) => {
        const key = item.id
        if (!productMap[key]) {
          productMap[key] = {
            id: item.id,
            name: item.name || 'Unknown Product',
            qty: 0,
            revenue: 0,
            image: item.image || '',
            price: item.price || 0
          }
        }
        productMap[key].qty += item.qty || 0
        productMap[key].revenue += (item.qty || 0) * (item.price || 0)
      })
    }
  })

  console.log('Product map after filtering:', Object.keys(productMap).length)

  return Object.values(productMap)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, limit)
}
