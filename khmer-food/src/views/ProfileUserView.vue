<template>
  <div class="profile-page">

    <!-- LEFT PANEL -->
    <aside class="left-panel">
      <div class="avatar" @click="editing && fileInput.click()">
        <img :src="avatarPreview || defaultAvatar" alt="avatar" />
        <input
          type="file"
          ref="fileInput"
          hidden
          accept="image/*"
          @change="onFileChange"
        />
      </div>

      <p v-if="editing" class="hint">Click photo to change</p>

      <button class="btn" @click="toggleEdit">
        {{ editing ? 'Cancel' : 'Edit' }}
      </button>

      <button v-if="editing" class="btn save-btn" @click="saveChanges">
        Save
      </button>
    </aside>

    <!-- RIGHT PANEL -->
    <main class="right-panel">
      <h1 class="title">My Profile</h1>

      <form class="form">
        <label class="field">
          <span class="label-text">Name</span>
          <input v-model="form.name" :disabled="!editing" />
        </label>

        <label class="field">
          <span class="label-text">Phone Number</span>
          <input v-model="form.phone" :disabled="!editing" />
        </label>

        <label class="field">
          <span class="label-text">Email</span>
          <input v-model="form.email" disabled />
        </label>

        <div class="actions">
          <button type="button" class="orders-btn" @click="goToOrders">
            My Orders
          </button>
          <button type="button" class="signout" @click="signOut">
            Sign Out
          </button>
        </div>
      </form>
    </main>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db, auth } from '../firebase'
import { getUserStorage, logoutUser, saveUserStorage } from '../loginstorage'
import { useCartStore } from '../stores/cart'
import { useFavoriteStore } from '../stores/favorite'

const router = useRouter()
const editing = ref(false)

const defaultAvatar = '/forProfile/profile.png'
const avatarPreview = ref('')
const avatarBase64 = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

const form = ref({
  name: '',
  phone: '',
  email: '',
})

const toggleEdit = () => {
  editing.value = !editing.value
}

const onFileChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    avatarPreview.value = reader.result as string
    avatarBase64.value = reader.result as string
  }
  reader.readAsDataURL(file)
}

onMounted(async () => {
  const user = getUserStorage()
  if (!user?.uid) return router.replace('/login')

  form.value.email = user.email

  const snap = await getDoc(doc(db, 'users', user.uid))
  const data = snap.data()

  form.value.name = data?.name || ''
  form.value.phone = data?.phone || ''
  avatarPreview.value = data?.avatar || ''
})

const saveChanges = async () => {
  const user = getUserStorage()
  if (!user) return

  const avatar = avatarBase64.value || avatarPreview.value

  await updateDoc(doc(db, 'users', user.uid), {
    name: form.value.name,
    phone: form.value.phone,
    avatar
  })

  saveUserStorage({
    ...user,
    name: form.value.name,
    phone: form.value.phone,
    avatar
  })

  editing.value = false
  alert('Profile updated 💚')
}

const signOut = async () => {
  const cart = useCartStore()
  const favorite = useFavoriteStore()

  await auth.signOut()
  logoutUser()
  cart.items = []
  favorite.clearFavorites()
  router.replace('/loginSignup')
}

const goToOrders = () => {
  router.push('/orders')
}
</script>

<style scoped>
.profile-page {
  display: flex;
  min-height: 90vh;
  font-family: 'Baloo Tammudu 2', cursive;
  background: linear-gradient(180deg, #f7fff0, #ffffff);
}

/* LEFT PANEL */
.left-panel {
  width: 32%;
  background: linear-gradient(180deg, #7ed957, #b7f397);
  padding: 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0 40px 40px 0;
}

.avatar {
  width: 14rem;
  height: 14rem;
  border-radius: 50%;
  background: white;
  padding: 6px;
  cursor: pointer;
}

.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.hint {
  margin-top: 10px;
  color: white;
  font-size: 0.9rem;
}

.btn {
  margin-top: 1.5rem;
  background: white;
  color: #3a7f1f;
  padding: 0.8rem 2rem;
  border-radius: 999px;
  font-weight: 700;
  border: none;
  cursor: pointer;
}

.save-btn {
  background: #4caf50;
  color: white;
}

/* RIGHT PANEL */
.right-panel {
  flex: 1;
  padding: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 2.6rem;
  color: #4caf50;
  margin-bottom: 2rem;
}

.form {
  width: 100%;
  max-width: 420px;
  background: white;
  padding: 2.5rem;
  border-radius: 24px;
}

.field {
  margin-bottom: 1.3rem;
}

.label-text {
  display: block;
  font-weight: 600;
  margin-bottom: 0.4rem;
}

input {
  width: 100%;
  padding: 0.8rem;
  border-radius: 999px;
  border: 2px solid #e2f5d9;
}

.actions {
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
}

.orders-btn {
  background: #2196f3;
  color: white;
  border-radius: 999px;
  padding: 0.7rem 1.5rem;
  border: none;
}

.signout {
  background: #ff5252;
  color: white;
  border-radius: 999px;
  padding: 0.7rem 1.5rem;
  border: none;
}
</style>
