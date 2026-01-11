import { collection, doc, setDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

export async function addOrderReview({
  userId,
  orderId,
  productId,
  productName,
  rating,
  comment
}: {
  userId: string
  orderId: string
  productId: string | number
  productName?: string
  rating: number
  comment: string
}) {
  const reviewRef = doc(db, 'reviews', orderId) // One doc per order

  const snap = await getDoc(reviewRef)

  if (snap.exists()) {
    // Order doc exists → append or update product review
    const data = snap.data()
    const products = data.products || []

    const existingIndex = products.findIndex((p: any) => p.productId === productId)
    if (existingIndex !== -1) {
      // Update existing product review
      products[existingIndex] = { productId, productName, rating, comment }
    } else {
      // Add new product review
      products.push({ productId, productName, rating, comment })
    }

    await setDoc(reviewRef, { ...data, products }, { merge: true })
  } else {
    // Create new document
    await setDoc(reviewRef, {
      orderId,
      userId,
      products: [{ productId, productName, rating, comment }],
      createdAt: new Date()
    })
  }
}

export async function getReviewsByOrder(orderId: string) {
  const reviewRef = doc(db, 'reviews', orderId)
  const snap = await getDoc(reviewRef)
  return snap.exists() ? snap.data() : null
}
