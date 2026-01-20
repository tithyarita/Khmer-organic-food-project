<template>
  <div class="profile-page">
    <!-- LEFT PANEL -->
    <aside class="left-panel">
      <div class="avatar">
        <img src="@/assets/forProfile/profile.png" alt="avatar" />
      </div>

      <button class="btn" @click="toggleEdit">
        {{ editing ? 'Cancel' : 'Edit' }}
      </button>

      <button class="btn secondary" @click="saveChanges" :disabled="!editing">Save Change</button>
    </aside>

    <!-- RIGHT PANEL -->
    <main class="right-panel">
      <div class="title-wrapper">
        <h1 class="title">My Profile</h1>
        <div class="admin-icon" @click="goToAdminProducts">
          <i class="fas fa-user"></i>
        </div>
      </div>

      <form class="form" @submit.prevent="saveChanges">
        <label class="field">
          <span class="label-text">Name</span>
          <input type="text" v-model="form.name" :disabled="!editing" />
        </label>

        <label class="field">
          <span class="label-text">Phone Number</span>
          <input type="text" v-model="form.phone" :disabled="!editing" />
        </label>

        <label class="field">
          <span class="label-text">Email</span>
          <input type="email" v-model="form.email" disabled />
        </label>

        <div class="actions">
          <button type="button" class="signout" @click="signOut">Sign Out</button>
        </div>
      </form>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { auth, db } from '../../firebase'
import { signOut as firebaseSignOut } from 'firebase/auth'
import { doc, updateDoc } from 'firebase/firestore'
import { getUserStorage, saveUserStorage } from '../../loginstorage'

const router = useRouter()

/* STATE */
const editing = ref(false)
const showPassword = ref(false)

const form = ref({
  name: '',
  phone: '',
  email: '',
  password: '',
})

let backupForm: typeof form.value | null = null

/* METHODS */
onMounted(() => {
  const user = getUserStorage()
  if (user) {
    form.value.name = user.name || ''
    form.value.phone = user.phone || ''
    form.value.email = user.email || ''
  }
})

const toggleEdit = () => {
  if (!editing.value) {
    backupForm = { ...form.value }
    editing.value = true
  } else {
    if (backupForm) {
      form.value = { ...backupForm }
      backupForm = null
    }
    editing.value = false
  }
}

const saveChanges = async () => {
  const user = getUserStorage()
  if (user && editing.value) {
    try {
      const collection = user.role === 'admin' ? 'admins' : 'users'
      await updateDoc(doc(db, collection, user.uid), {
        name: form.value.name,
        phone: form.value.phone,
      })
      // Update localStorage
      saveUserStorage({ ...user, name: form.value.name, phone: form.value.phone })
      editing.value = false
      backupForm = null
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile.')
    }
  }
}

const goToAdminProducts = () => {
  router.push('/admin/products')
}

const signOut = async () => {
  try {
    await firebaseSignOut(auth)
    localStorage.removeItem('user')
    router.push('/login')
  } catch (error) {
    console.error('Error signing out:', error)
  }
}
</script>

<style scoped>
/* --- SAME STYLES YOU HAD --- */
.profile-page {
  display: flex;
  min-height: 90vh;
  background: #ffffff;
  border-radius: 0.375rem;
  overflow: hidden;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.05);
  font-family: 'Baloo Tammudu 2', sans-serif;
}

.left-panel {
  width: 30%;
  background: #bbe18a;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.125rem;
}

.avatar {
  width: 15rem;
  height: 15rem;
  border-radius: 50%;
  background: #ffd700;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar img {
  width: 14rem;
  height: 14rem;
  border-radius: 50%;
  object-fit: cover;
  border: 0.375rem solid #fff;
}

.btn {
  width: 60%;
  padding: 0.75rem;
  border: none;
  border-radius: 0.5rem;
  background: #6ec007;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  cursor: pointer;
}

.btn.secondary {
  background: #76c642;
}

.right-panel {
  flex: 1;
  padding: 2.3rem 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title-wrapper {
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.title {
  color: #6ec007;
  font-size: 2.6rem;
}

.admin-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: #6ec007;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.form {
  width: 50%;
  max-width: 40rem;
}

.field {
  margin-bottom: 1.125rem;
}

.label-text {
  font-size: 1.2rem;
  font-weight: 600;
}

input {
  width: 100%;
  padding: 0.8rem;
  border-radius: 0.625rem;
  border: 1px solid #6ec007;
  font-size: 1.1rem;
}

.password-row {
  display: flex;
  align-items: center;
}

.eye {
  margin-left: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.4rem;
  color: #6ec007;
}

.actions {
  margin-top: 1.3rem;
}

.signout {
  width: 100%;
  padding: 1.1rem;
  background: #e53935;
  color: white;
  border: none;
  border-radius: 1rem;
  font-size: 1.2rem;
  cursor: pointer;
}
</style>
