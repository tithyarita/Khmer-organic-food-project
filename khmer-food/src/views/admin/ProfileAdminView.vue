<template>
  <div class="profile-page">

    <!-- LEFT PANEL -->
    <aside class="left-panel">
      <label class="avatar-upload">
        <img :src="avatarPreview || defaultAvatar" alt="avatar" />
        <input
          v-if="editing"
          type="file"
          accept="image/*"
          hidden
          @change="onImageChange"
        />
        <span v-if="editing" class="upload-text">Change Photo</span>
      </label>

      <h3 class="role">Admin 🌿</h3>

      <button class="btn edit" @click="toggleEdit">
        {{ editing ? 'Cancel' : 'Edit Profile' }}
      </button>

      <button class="btn save" :disabled="!editing" @click="saveChanges">
        Save Changes
      </button>

      <button class="btn logout" @click="signOut">
        Sign Out
      </button>
    </aside>

    <!-- RIGHT PANEL -->
    <main class="right-panel">
      <h1 class="title">My Profile</h1>

      <form class="form">
        <div class="field">
          <label>Name</label>
          <input v-model="form.name" :disabled="!editing" />
        </div>

        <div class="field">
          <label>Phone</label>
          <input v-model="form.phone" :disabled="!editing" />
        </div>

        <div class="field">
          <label>Email</label>
          <input v-model="form.email" disabled />
        </div>
      </form>
    </main>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '../../firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { signOut as firebaseSignOut } from 'firebase/auth'
import { getUserStorage, saveUserStorage } from '../../loginstorage'
import defaultAvatar from '@/assets/forProfile/profile.png'

const router = useRouter()
const user = getUserStorage()

const editing = ref(false)
const avatarPreview = ref<string | null>(null)

const form = ref({
  name: '',
  phone: '',
  email: '',
  avatar: ''
})

onMounted(() => {
  if (!user) return
  form.value.name = user.name || ''
  form.value.phone = user.phone || ''
  form.value.email = user.email || ''
  form.value.avatar = user.avatar || ''
  avatarPreview.value = user.avatar || null
})

const toggleEdit = () => {
  editing.value = !editing.value
}

const onImageChange = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    avatarPreview.value = reader.result as string
    form.value.avatar = avatarPreview.value
  }
  reader.readAsDataURL(file)
}

const saveChanges = async () => {
  if (!editing.value || !user) return

  const collection = user.role === 'admin' ? 'admins' : 'users'
  const avatarToSave = form.value.avatar || user.avatar || ''

  await updateDoc(doc(db, collection, user.uid), {
    name: form.value.name,
    phone: form.value.phone,
    avatar: avatarToSave
  })

  saveUserStorage({
    ...user,
    name: form.value.name,
    phone: form.value.phone,
    avatar: avatarToSave
  })

  editing.value = false
  alert('Profile updated 💚')
}

const signOut = async () => {
  await firebaseSignOut(auth)
  localStorage.removeItem('user')
  router.push('/login')
}
</script>

<style scoped>
/* PAGE LAYOUT */
.profile-page {
  min-height: 100vh;
  padding: 6rem 4rem 2rem;
  display: flex;
  gap: 3rem;
  background: #f9fff3;
  font-family: 'Baloo Tammudu 2', cursive;
}

/* LEFT PANEL */
.left-panel {
  width: 280px;
  background: white;
  border-radius: 1.5rem;
  padding: 2rem 1.5rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.avatar-upload {
  position: relative;
  cursor: pointer;
}

.avatar-upload img {
  width: 160px;
  height: 160px;
  border-radius: 50%;
  border: 5px solid #6ec007;
  object-fit: cover;
}

.upload-text {
  position: absolute;
  bottom: 0;
  width: 100%;
  background: rgba(110,192,7,0.85);
  color: white;
  text-align: center;
  font-size: 0.9rem;
  padding: 0.3rem 0;
  border-radius: 0 0 50% 50%;
}

.role {
  margin: 1rem 0;
  color: #6ec007;
  font-size: 1.4rem;
}

/* BUTTONS */
.btn {
  width: 100%;
  margin-top: 0.7rem;
  padding: 0.7rem;
  border-radius: 1rem;
  border: none;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
}

.edit {
  background: #ffd54f;
}

.save {
  background: #6ec007;
  color: white;
}

.save:disabled {
  opacity: 0.5;
}

.logout {
  background: #e53935;
  color: white;
}

/* RIGHT PANEL */
.right-panel {
  flex: 1;
  background: white;
  border-radius: 1.5rem;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.08);
}

.title {
  color: #6ec007;
  font-size: 2.6rem;
  margin-bottom: 2rem;
}

/* FORM */
.form {
  max-width: 500px;
}

.field {
  margin-bottom: 1.5rem;
}

.field label {
  font-size: 1.2rem;
  font-weight: bold;
}

.field input {
  width: 100%;
  padding: 0.8rem;
  border-radius: 1rem;
  border: 1px solid #6ec007;
  font-size: 1.1rem;
}
</style>
