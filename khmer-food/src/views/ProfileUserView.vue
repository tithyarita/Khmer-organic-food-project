<template>
  <div class="profile-page">
    <!-- LEFT PANEL -->
    <aside class="left-panel">
      <div
        class="avatar"
        :class="{ disabled: !editing }"
        @click="onAvatarClick"
      >
        <img :src="avatarPreview || form.avatarUrl" alt="Profile picture" />

        <div
          v-if="editing"
          class="change-avatar-btn"
          @click.stop="triggerFileInput"
        >
          Click to change photo
        </div>
      </div>

      <input
        v-if="editing"
        ref="fileInput"
        type="file"
        accept="image/*"
        hidden
        @change="handleAvatarChange"
      />

      <h3 class="role">User 🌿</h3>

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

        <!-- PASSWORD SECTION -->
        <template v-if="editing">
          <label class="field">
            <span class="label-text">Current Password</span>
            <div class="password-row">
              <input
                :type="showCurrent ? 'text' : 'password'"
                v-model="currentPassword"
              />
              <button type="button" class="eye" @click="showCurrent = !showCurrent">
                <i :class="showCurrent ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </label>

          <label class="field">
            <span class="label-text">New Password</span>
            <div class="password-row">
              <input
                :type="showNew ? 'text' : 'password'"
                v-model="newPassword"
              />
              <button type="button" class="eye" @click="showNew = !showNew">
                <i :class="showNew ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </label>

          <label class="field">
            <span class="label-text">Confirm New Password</span>
            <input
              :type="showNew ? 'text' : 'password'"
              v-model="confirmPassword"
            />
          </label>
        </template>

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
import { getUserStorage, saveUserStorage, logoutUser } from '../loginstorage'
import { useCartStore } from '../stores/cart'
import { useFavoriteStore } from '../stores/favorite'
import defaultAvatar from '../assets/forProfile/profile.png'
import { updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth'

const router = useRouter()
const editing = ref(false)

const fileInput = ref<HTMLInputElement | null>(null)
const avatarPreview = ref('')
const avatarBase64 = ref('')

const showCurrent = ref(false)
const showNew = ref(false)

const form = ref({
  name: '',
  phone: '',
  email: '',
  avatarUrl: defaultAvatar
})

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

let backup: typeof form.value | null = null

const toggleEdit = () => {
  if (!editing.value) {
    backup = { ...form.value }
    editing.value = true
  } else {
    if (backup) form.value = { ...backup }
    avatarPreview.value = ''
    avatarBase64.value = ''
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    editing.value = false
  }
}

const onAvatarClick = (e: MouseEvent) => {
  if (!editing.value) return
  e.stopPropagation()
  triggerFileInput()
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleAvatarChange = (e: Event) => {
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
  form.value.avatarUrl = data?.avatar || defaultAvatar
})

const saveChanges = async () => {
  const user = getUserStorage()
  if (!user) return

  const currentUser = auth.currentUser
  if (!currentUser) return

  const avatar = avatarBase64.value || form.value.avatarUrl

  try {
    // Update Firestore: name, phone, avatar
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

    // Update password if provided
    if (currentPassword.value && newPassword.value) {
      if (newPassword.value !== confirmPassword.value) {
        alert('New password and confirm password do not match ❌')
        return
      }

      const credential = EmailAuthProvider.credential(
        currentUser.email!,
        currentPassword.value
      )
      await reauthenticateWithCredential(currentUser, credential)
      await updatePassword(currentUser, newPassword.value)
      alert('Password updated successfully ✅')
    }

    // Reset fields and editing state
    editing.value = false
    avatarPreview.value = ''
    avatarBase64.value = ''
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''

    alert('Your profile has been successfully updated! ✅')
  } catch (err: any) {
    console.error(err)
    alert('Error updating profile: ' + err.message)
  }
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
  min-height: 100vh;
  gap: 2.5rem;
  font-family: 'Quicksand', sans-serif;
  padding: 3rem;
  background: #f7fff0;
}

/* LEFT */

.left-panel {
  width: 300px;
  background: #bdeca9;
  border-radius: 22px;
  padding: 2.5rem 2rem;
  box-shadow: 0 12px 28px rgba(0,0,0,0.07);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar {
  width: 14rem;
  height: 14rem;
  border-radius: 50%;
  background: #ffd700;
  padding: 6px;
  cursor: pointer;
  position: relative;
}

.avatar.disabled {
  cursor: default;
}

.avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 6px solid #fff;
}

.role {
  margin: 1.2rem 0 1.6rem;
  font-size: 1.4rem;
  font-weight: 700;
  color: #7dbb4a;
}

.change-avatar-btn {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.6);
  color: white;
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 0.85rem;
  cursor: pointer;
  white-space: nowrap;
  
}

.btn {
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 14px;
  border: none;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  margin-bottom: 0.8rem;
  transition: all 0.25s ease;
}

.save-btn { background: #7dbb4a; color: #ffffff; }


/* RIGHT */
.right-panel {
  flex: 1;
  background: white;
  border-radius: 22px;
  padding: 3rem;
  box-shadow: 0 12px 28px rgba(0,0,0,0.07);
}

.title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #7dbb4a;
  margin-bottom: 2rem;
  text-align: center;
}

.form {
  max-width: 460px;
  margin: 0 auto;
}

.label-text {
  display: block;
  font-weight: 600; 
  margin: 0.7rem 0.2rem;
}

 /* 🔒 Hide browser's black eye icon */
input {
  width: 100%;
  padding: 0.8rem;
  border-radius: 12px;
  border: 1px solid #6ec007;
}

/* Close icon eye */
input::-ms-reveal,
input::-webkit-credentials-auto-fill-button {
  display: none !important;
}

/* Arround box color */
input:focus {
  outline: none;
  border-color: #4f9a07;
  box-shadow: 0 0 8px rgba(110, 192, 7, 0.3);
}

/* Can't Edit email */
input:disabled {
  background: #f3f3f3;
  cursor: not-allowed;
}

.password-row {
  display: flex;
  align-items: center;
}

.eye {
  margin-left: -40px;
  background: none;
  border: none;
  color: #6ec007;
  cursor: pointer;
}

.actions {
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
}

.orders-btn {
  background: #2196f3;
  color: white;
  padding: 0.7rem 1.5rem;
  border-radius: 13px;
  border: none;
}

.signout {
  background: #ff5252;
  color: white;
  padding: 0.7rem 1.5rem;
  border-radius: 13px;
  border: none;
}
</style>





