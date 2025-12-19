import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyA1SjLJbVAerNhRdrQnZrXPiRRltdkYpHs",
  authDomain: "khmer-organic-food-afdc5.firebaseapp.com",
  projectId: "khmer-organic-food-afdc5",
  storageBucket: "khmer-organic-food-afdc5.appspot.com",
  messagingSenderId: "252098645120",
  appId: "1:252098645120:web:dfdbd69590b90e378c2a65"
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
