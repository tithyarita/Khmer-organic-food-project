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
/* 🌿 PAGE BACKGROUND */
.profile-page {
  min-height: 100vh;
  padding: 5rem 3rem;
  display: flex;
  gap: 2.5rem;
  font-family: 'Quicksand', sans-serif;
}

/* 🌿 LEFT CARD */
.left-panel {
  width: 300px;
  background: #ffffff;
  border-radius: 22px;
  padding: 2.5rem 2rem;
  box-shadow: 0 12px 28px rgba(0,0,0,0.07);
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

/* 🌿 AVATAR */
.avatar-upload {
  position: relative;
}

.avatar-upload img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  background: #f4ffe9;
  border: 5px dashed #8bdc65;
  padding: 6px;
}

.upload-text {
  margin-top: 10px;
  font-size: 0.85rem;
  color: #6ec007;
  text-align: center;
}

/* 🌿 ROLE */
.role {
  margin: 1.2rem 0 1.6rem;
  font-size: 1.4rem;
  font-weight: 700;
  color: #7dbb4a;
}

/* 🌿 BUTTON GROUP */
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

/* BUTTON STYLES */
.edit {
  background: #fdf1c7;
  color: #7a6400;
}

.save {
  background: #7dbb4a;
  color: #ffffff;
}

.save:disabled {
  background: #d9efc8;
  cursor: not-allowed;
}

.logout {
  background: #ffd2d2;
  color: #b80000;
}

.btn:hover {
  transform: translateY(-2px);
}

/* 🌿 RIGHT PANEL */
.right-panel {
  flex: 1;
  background: #ffffff;
  border-radius: 22px;
  padding: 3rem;
  box-shadow: 0 12px 28px rgba(0,0,0,0.07);
}

/* 🌿 TITLE */
.title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #7dbb4a;
  margin-bottom: 2rem;
}

/* 🌿 FORM */
.form {
  max-width: 460px;
}

.field {
  margin-bottom: 1.4rem;
}

.field label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #777;
  margin-bottom: 0.3rem;
  display: block;
}

.field input {
  width: 100%;
  padding: 0.9rem 1rem;
  border-radius: 14px;
  border: 1px solid #e0f2d5;
  font-size: 0.95rem;
  background: #fbfff7;
  transition: all 0.25s ease;
}

.field input:focus {
  outline: none;
  border-color: #7dbb4a;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(125, 187, 74, 0.2);
}

.field input:disabled {
  background: #f5f5f5;
  color: #aaa;
}

</style>
