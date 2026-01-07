<template>
  <div class="profile-page">
    <aside class="left-panel">
      <div class="avatar">
        <img src="@/assets/forProfile/profile.png" alt="avatar" />
      </div>

      <button class="btn" @click="toggleEdit">{{ editing ? 'Cancel' : 'Edit' }}</button>
      <button class="btn secondary" @click="saveChanges" :disabled="!editing">Save Changes</button>
    </aside>

    <main class="right-panel">
      <h1 class="title">My Profile</h1>

      <form @submit.prevent="saveChanges" class="form">
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
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { getUserStorage, logoutUser } from '../loginstorage'

interface UserForm {
  name: string
  phone: string
  email: string
}

const router = useRouter()
const editing = ref(false)
const form = ref<UserForm>({ name: '', phone: '', email: '' })
let backupForm: UserForm | null = null

const toggleEdit = () => {
  if (!editing.value) {
    backupForm = { ...form.value }
    editing.value = true
  } else {
    if (backupForm) form.value = { ...backupForm }
    editing.value = false
  }
}

const saveChanges = async () => {
  if (!editing.value) return
  const user = getUserStorage()
  if (!user?.uid) {
    router.replace('/login')
    return
  }

  try {
    const userRef = doc(db, 'users', user.uid)
    await updateDoc(userRef, {
      name: form.value.name,
      phone: form.value.phone,
    })
    editing.value = false
    backupForm = null
    alert('Profile updated successfully!')
  } catch (err: unknown) {
    if (err instanceof Error) {
      alert(err.message)
    } else {
      alert('Failed to update profile.')
    }
  }
}

const signOut = () => {
  logoutUser()
  router.replace('/loginSignup')
}

onMounted(async () => {
  const user = getUserStorage()
  if (!user?.uid) {
    router.replace('/login')
    return
  }

  form.value.email = user.email || ''

  try {
    const userRef = doc(db, 'users', user.uid)
    const userSnap = await getDoc(userRef)
    if (!userSnap.exists()) {
      logoutUser()
      router.replace('/login')
      return
    }

    const data = userSnap.data()
    form.value.name = data.name || ''
    form.value.phone = data.phone || ''
  } catch (err: unknown) {
    if (err instanceof Error) alert(err.message)
    else alert('Failed to load profile.')
    logoutUser()
    router.replace('/login')
  }
})
</script>

<style scoped>
.profile-page {
  display: flex;
  min-height: 90vh;
  font-family: 'Baloo Tammudu 2', sans-serif;
}

/* Left Panel */
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
  font-weight: bold;
  cursor: pointer;
}

.btn.secondary {
  background: #76c642;
}

/* Right Panel */
.right-panel {
  flex: 1;
  padding: 2.3rem 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  color: #6ec007;
  font-size: 2.6rem;
  margin-bottom: 1.25rem;
}

.form {
  width: 50%;
  max-width: 40rem;
  display: flex;
  flex-direction: column;
}

.field {
  margin-bottom: 1.125rem;
}

.label-text {
  font-weight: 600;
  font-size: 1.2rem;
  margin-bottom: 0.3rem;
}

input {
  width: 100%;
  padding: 0.8rem;
  border-radius: 0.625rem;
  border: 1px solid #6ec007;
  font-size: 1.1rem;
  outline: none;
}

input:focus {
  border-color: #4caf50;
  box-shadow: 0 0 0 0.125rem rgba(76, 175, 80, 0.2);
}

.actions {
  margin-top: 1.3rem;
  display: flex;
  justify-content: center;
}

.signout {
  background: #e53935;
  color: white;
  padding: 1.1rem;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  width: 100%;
}

/* Mobile */
@media (max-width: 600px) {
  .profile-page {
    flex-direction: column;
  }
  .left-panel {
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
  }
  .avatar {
    width: 6rem;
    height: 6rem;
  }
  .avatar img {
    width: 5rem;
    height: 5rem;
  }
  .right-panel {
    padding: 1rem;
  }
  .title {
    font-size: 1.75rem;
  }
}
</style>
