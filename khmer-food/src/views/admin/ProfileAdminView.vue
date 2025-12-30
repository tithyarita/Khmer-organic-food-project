<template>
  <div class="profile-page">
    <aside class="left-panel">
      <div class="avatar">
        <img src="@/assets/forProfile/profile.png" alt="avatar" />
      </div>

      <button class="btn" @click="toggleEdit">{{ editing ? 'Cancel' : 'Edit' }}</button>
      <button class="btn secondary" @click="saveChanges">Save Change</button>
    </aside>

    <main class="right-panel">
      <div class="title-wrapper">
        <h1 class="title">My Profile</h1>
        <div class="admin-icon" @click="goToAdminProducts">
          <i class="fas fa-user"></i>
        </div>
      </div>

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
          <input type="email" v-model="form.email" :disabled="!editing" />
        </label>

        <label class="field password-field">
          <span class="label-text">Password</span>
          <div class="password-row">
            <input
              :type="showPassword ? 'text' : 'password'"
              v-model="form.password"
              :disabled="!editing"
            />
            <button type="button" class="eye" @click="showPassword = !showPassword">
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const editing = ref(false)
const showPassword = ref(false)
const form = ref({
  name: 'Ming Ming',
  phone: '0123456789',
  email: 'ming@example.com',
  password: 'password123'
})

let _backup = null

const toggleEdit = () => {
  if (!editing.value) {
    _backup = { ...form.value }
    editing.value = true
  } else {
    if (_backup) {
      form.value = { ..._backup }
      _backup = null
    }
    editing.value = false
  }
}

const saveChanges = () => {
  editing.value = false
  _backup = null
  // alert('Changes saved!')
}

const goToAdminProducts = () => {
  router.push('/admin/') // or your actual admin route
}

const signOut = () => {
  router.push('/loginSignup')
}
</script>

<style scoped>
.profile-page {
  display: flex;
  min-height: 90vh;
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
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.125rem;
}

.avatar {
  position: relative;
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
  padding: 0.75rem 0.62rem;
  border: none;
  border-radius: 0.5rem;
  background: #6ec007;
  color: white;
  font-weight: bold;
  cursor: pointer;
  font-size: 1.2rem;
  font-family: 'Baloo Tammudu 2', sans-serif;
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
  justify-content: center;
  align-items: center;
}

.title-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 1.25rem;
}

.title {
  color: #6ec007;
  font-size: 2.6rem;
  margin: 0;
  text-align: center;
}

.admin-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: #6ec007;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
  cursor: pointer;
}

.form {
  max-width: 40rem;
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}

.field {
  display: block;
  margin-bottom: 1.125rem;
}

.label-text {
  display: block;
  font-weight: 600;
  font-size: 1.2rem;
  margin-bottom: 0.3rem;
  font-family: 'Baloo Tammudu 2', sans-serif;
}

input[type='text'],
input[type='email'],
input[type='password'] {
  width: 100%;
  padding: 0.8rem 0.875rem;
  border-radius: 0.625rem;
  border: 0.0625rem solid #6ec007;
  outline: none;
  box-sizing: border-box;
  font-family: 'Baloo Tammudu 2', sans-serif;
  font-size: 1.1rem;
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
  font-size: 1.4rem;
  color: #6ec007;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
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
  font-family: 'Baloo Tammudu 2', sans-serif;
  font-size: 1.2rem;
  width: 100%;
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
  .title-wrapper {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  .title {
    text-align: left;
    font-size: 1.75rem;
  }
  .admin-icon {
    align-self: flex-end;
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