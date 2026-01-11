<template>
  <div class="admin-login">
    <h2>Admin Login</h2>
    <form @submit.prevent="loginAdmin">
      <div class="form-group">
        <label>Email</label>
        <input v-model="email" type="email" placeholder="Enter admin email" required />
      </div>
      <div class="form-group">
        <label>Password</label>
        <input v-model="password" type="password" placeholder="Enter password" required />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '../../firebase'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'


// ---------------- Firebase Config ----------------
const firebaseConfig = {
  apiKey: 'AIzaSyA1SjLJbVAerNhRdrQnZrXPiRRltdkYpHs',
  authDomain: 'khmer-organic-food-afdc5.firebaseapp.com',
  projectId: 'khmer-organic-food-afdc5',
  storageBucket: 'khmer-organic-food-afdc5.appspot.com',
  messagingSenderId: '252098645120',
  appId: '1:252098645120:web:dfdbd69590b90e378c2a65',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

// ---------------- Component State ----------------
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')
const router = useRouter()

// ---------------- Login Function ----------------
// const loginAdmin = async () => {
//   loading.value = true
//   errorMessage.value = ''

//   try {
//     // Query Firestore Admin collection for this email
//     const q = query(collection(db, 'Admin'), where('email', '==', email.value))
//     const querySnapshot = await getDocs(q)

//     if (querySnapshot.empty) {
//       throw new Error('Admin user not found')
//     }

//     const userDoc = querySnapshot.docs[0]
//     const UserData = userDoc.data()

//     // Check password
//     if (UserData.password !== password.value) {
//       throw new Error('Invalid email or password')
//     }

//     // Save admin info to localStorage for router guard
//     saveUserStorage({
//       email: UserData.email,
//       name: UserData.name,
//       role: UserData.role,
//       uid: ''
//     })

//     // Redirect to admin dashboard
//     router.push('/admin/sales')
//   } catch (error: unknown) {
//     console.error(error)
//     if (error instanceof Error) errorMessage.value = error.message
//     else errorMessage.value = 'Login failed. Please try again.'
//   } finally {
//     loading.value = false
//   }
// }

// Initialize Firebase Auth
const auth = getAuth(app)

const loginAdmin = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    // 1️⃣ Login with Firebase Auth
    const res = await signInWithEmailAndPassword(auth, email.value, password.value)
    const user = res.user

    // 2️⃣ Load admin document from Firestore
    const adminRef = doc(db, 'admin', user.uid)
    const adminSnap = await getDoc(adminRef)

    if (!adminSnap.exists()) {
      alert('You are not an admin')
      await auth.signOut()
      return
    }

    const adminData = adminSnap.data()

    if (adminData.role !== 'admin') {
      alert('Access denied')
      await auth.signOut()
      return
    }

    // ✅ SUCCESS
    router.push('/admin')

  } catch (err: any) {
    alert(err.message || 'Login failed')
  } finally {
    loading.value = false
  }
}


</script>


<style scoped>
.admin-login {
  max-width: 400px;
  margin: 8rem auto;
  padding: 2rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 6px 15px rgba(0,0,0,0.1);
}
h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #53b400;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}
button {
  width: 100%;
  padding: 0.75rem;
  background: #53b400;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: bold;
  cursor: pointer;
}
button:disabled {
  background: #a8d5a2;
  cursor: not-allowed;
}
.error {
  color: red;
  margin-top: 1rem;
  text-align: center;
}
</style>
