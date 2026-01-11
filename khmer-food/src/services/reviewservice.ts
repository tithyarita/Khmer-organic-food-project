import { collection, addDoc, getDocs, query, where } from 'firebase/firestore'
import { db } from '../firebase'

export async function addReview(review: {
  userId: string
  orderId: string
  productId: string | number
  productName?: string
  rating: number
  comment: string
}) {
  const col = collection(db, 'reviews')
  return await addDoc(col, {
    ...review,
    createdAt: new Date(),
  })
}

export async function getReviewsByProduct(productId: string | number) {
  const col = collection(db, 'reviews')
  const q = query(col, where('productId', '==', productId))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}
