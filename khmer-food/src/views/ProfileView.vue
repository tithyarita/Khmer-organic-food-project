<template>
  <div class="profile-page">
    <aside class="left-panel">
      <div class="avatar">
        <img src="@/assets/forProfile/profile.png" alt="avatar" />
      </div>
      <button class="btn" @click="toggleEdit">{{ editing ? 'Cancel' : 'Edit' }}</button>
      <button class="btn secondary" @click="saveChanges" :disabled="!editing">Save Change</button>
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

        <label class="field password-field">
          <span class="label-text">Password</span>
          <div class="password-row">
            <input type="password" value="********" disabled />
          </div>
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
import { getUserStorage, logoutUser } from '../loginstorage'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

interface UserForm {
  name: string
  phone: string
  email: string
}

const router = useRouter()
const editing = ref(false)
const form = ref<UserForm>({
  name: '',
  phone: '',
  email: ''
})

let _backup: UserForm | null = null

const toggleEdit = () => {
  if (!editing.value) {
    _backup = { ...form.value }
    editing.value = true
  } else {
    if (_backup) form.value = { ..._backup }
    editing.value = false
  }
}

const saveChanges = async () => {
  editing.value = false
  _backup = null
  alert('Changes saved!')
  // You can update Firestore here if needed
}

const signOut = async () => {
  const confirmed = confirm("Are you sure you want to sign out?")
  if (!confirmed) return // user canceled

  await logoutUser()
  router.push('/#') // redirect after logout
}


onMounted(async () => {
  const user = getUserStorage()
  if (!user) {
    router.push('/loginSignup')
    return
  }

  form.value.email = user.email || ''

  try {
    const docRef = doc(db, 'users', user.uid)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const data = docSnap.data()
      form.value.name = data.name || ''
      form.value.phone = data.phone || ''
    }
  } catch (err) {
    console.error('Error fetching user info:', err)
  }
})
</script>


<style scoped>
.profile-page {
  display: flex;
  min-height: 82vh;
  background: #ffffff;
  border-radius: 0.375rem;
  overflow: hidden;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.05);
  font-family: 'Baloo Tammudu 2', sans-serif;
}

/* Left Panel */
.left-panel {
  width: 30%;
  background: #BBE18A;
  padding: 2rem 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.125rem;
}

.avatar {
  position: relative;
  width: 8.75rem;
  height: 8.75rem;
  border-radius: 50%;
  background: #ffd700;
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar img {
  width: 7.5rem;
  height: 7.5rem;
  border-radius: 50%;
  object-fit: cover;
  border: 0.375rem solid #fff;
}

.btn {
  width: 80%;
  padding: 0.75rem 0.625rem;
  border: none;
  border-radius: 0.5rem;
  background: #6ec007;
  color: white;
  font-weight: bold;
  cursor: pointer;
  font-family: 'Baloo Tammudu 2', sans-serif;
}

.btn.secondary {
  background: #76c642;
}

/* Right Panel */
.right-panel {
  flex: 1;
  padding: 2.25rem 3rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.title {
  color: #6ec007;
  font-size: 2.125rem;
  margin: 0 0 1.25rem 0;
  text-align: center;
}

.form {
  max-width: 40rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.field {
  display: block;
  margin-bottom: 1.125rem;
}

.label-text {
  display: block;
  font-weight: 700;
  margin-bottom: 0.5rem;
  font-family: 'Baloo Tammudu 2', sans-serif;
}

input[type='text'],
input[type='email'],
input[type='password'] {
  width: 100%;
  padding: 0.75rem 0.875rem;
  border-radius: 0.625rem;
  border: 0.0625rem solid #6ec007;
  outline: none;
  box-sizing: border-box;
  font-family: 'Baloo Tammudu 2', sans-serif;
}

input:focus {
  border-color: #4caf50;
  box-shadow: 0 0 0 0.125rem rgba(76, 175, 80, 0.2);
}

.password-row {
  display: flex;
  align-items: center;
}

.password-row input {
  flex: 1;
}

.eye {
  margin-left: 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.125rem;
  color: #6ec007;
}

.actions {
  margin-top: 1.625rem;
  display: flex;
  justify-content: center;
}

.signout {
  background: #e53935;
  color: white;
  padding: 1.5rem;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  font-family: 'Baloo Tammudu 2', sans-serif;
  font-weight: bold;
  width: 100%;
  max-width: 50rem;
  margin-top: 2rem;
}

/* Mobile Responsive */
@media (max-width: 37.5rem) {
  .profile-page {
    flex-direction: column;
  }
  .left-panel {
    width: 100%;
    flex-direction: row;
    justify-content: space-around;
    padding: 1.125rem;
    gap: 1rem;
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
    padding: 1.25rem;
    align-items: stretch;
  }
  .title {
    text-align: left;
    font-size: 1.75rem;
  }
  .form {
    align-items: stretch;
  }
  .signout {
    padding: 1rem;
    font-size: 1rem;
  }
}
</style>
