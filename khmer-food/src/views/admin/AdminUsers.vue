<template>
  <div class="admin-users">
    <!-- STATS -->
    <div class="stats">
      <div class="stat-box">
        <span class="count">{{ totalUsers }}</span>
        <span class="label">Total Users</span>
      </div>
      <div class="stat-box">
        <span class="count">{{ totalAdmins }}</span>
        <span class="label">Admins</span>
      </div>
      <div class="stat-box">
        <span class="count">{{ totalCustomers }}</span>
        <span class="label">Customers</span>
      </div>
    </div>

    <!-- ACTIONS -->
    <div class="actions">
      <div class="action-box add" @click="openAddUser">
        <span>Add User</span>
        <span class="icon">➕</span>
      </div>
      <div class="action-box import" @click="importCSV">
        <span>Import CSV</span>
        <span class="icon">📥</span>
        <input
          type="file"
          ref="fileInput"
          style="display: none"
          @change="handleFileUpload"
          accept=".csv"
        />
      </div>
      <div class="action-box export" @click="exportCSV">
        <span>Export CSV</span>
        <span class="icon">📤</span>
      </div>
    </div>

    <!-- USERS TABLE -->
    <div class="users-table">
      <div class="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.docId">
              <td>#{{ user.userId }}</td>
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>{{ user.phone }}</td>
              <td>
                <span class="role" :class="user.role">{{ user.role }}</span>
              </td>
              <td>
                <span
                  :class="['badge', user.status === 'active' ? 'badge-active' : 'badge-inactive']"
                >
                  {{ user.status }}
                </span>
              </td>
              <td>{{ formatDate(user.createdAt) }}</td>
              <td>
                <button class="btn-view" @click="openViewUser(user)">View</button>
                <button class="btn-edit" @click="openEditUser(user)">Edit</button>
              </td>
            </tr>
            <tr v-if="users.length === 0">
              <td colspan="8" style="text-align: center">No users found</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- USER MODAL -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>
            {{
              modalMode === 'add'
                ? 'Add New User'
                : modalMode === 'edit'
                  ? 'Edit User'
                  : 'User Details'
            }}
          </h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="saveUser">
            <div class="form-group">
              <label>Full Name</label>
              <input
                v-model="userForm.name"
                type="text"
                required
                :disabled="modalMode === 'view'"
                placeholder="Enter full name"
              />
            </div>

            <div class="form-group">
              <label>Email Address</label>
              <input
                v-model="userForm.email"
                type="email"
                required
                :disabled="modalMode === 'view'"
                placeholder="Enter email"
              />
            </div>

            <div class="form-group">
              <label>Phone Number</label>
              <input
                v-model="userForm.phone"
                type="tel"
                required
                :disabled="modalMode === 'view'"
                placeholder="Enter phone number"
              />
            </div>

            <div class="form-group" v-if="modalMode === 'add'">
              <label>Password</label>
              <input
                v-model="userForm.password"
                type="password"
                required
                placeholder="Enter password"
              />
            </div>

            <div class="form-group">
              <label>Role</label>
              <select v-model="userForm.role" :disabled="modalMode === 'view'">
                <option value="customer">Customer</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div class="form-group">
              <label>Status</label>
              <select v-model="userForm.status" :disabled="modalMode === 'view'">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div class="modal-actions" v-if="modalMode !== 'view'">
              <button type="button" class="btn-cancel" @click="closeModal">Cancel</button>
              <button type="submit" class="btn-save" :disabled="loading">
                {{ loading ? 'Saving...' : 'Save User' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  addDoc,
  runTransaction,
} from 'firebase/firestore'
import { db } from '../../firebase'

// User type
interface User {
  docId: string // Firestore doc id
  userId: number // Auto-increment numeric ID
  name: string
  email: string
  phone: string
  role: 'admin' | 'manager' | 'customer'
  status: 'active' | 'inactive'
  createdAt?: Timestamp
  password?: string
}

const users = ref<User[]>([])
const totalUsers = ref(0)
const totalAdmins = ref(0)
const totalCustomers = ref(0)
const fileInput = ref<HTMLInputElement | null>(null)
const showModal = ref(false)
const modalMode = ref<'add' | 'edit' | 'view'>('add')
const loading = ref(false)
const editingDocId = ref<string | null>(null)

const userForm = ref({
  name: '',
  email: '',
  phone: '',
  role: 'customer' as User['role'],
  status: 'active' as User['status'],
  password: '',
})

// Fetch users
onMounted(() => {
  const q = query(collection(db, 'users'), orderBy('userId', 'desc'))
  onSnapshot(q, (snapshot) => {
    users.value = snapshot.docs.map((doc) => ({
      docId: doc.id,
      ...(doc.data() as Omit<User, 'docId'>),
    }))
    updateCounts()
  })
})

// Open modals
const openAddUser = () => {
  modalMode.value = 'add'
  userForm.value = {
    name: '',
    email: '',
    phone: '',
    role: 'customer',
    status: 'active',
    password: '',
  }
  editingDocId.value = null
  showModal.value = true
}

const openEditUser = (user: User) => {
  modalMode.value = 'edit'
  userForm.value = {
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    password: '', // do not show password
  }
  editingDocId.value = user.docId
  showModal.value = true
}

const openViewUser = (user: User) => {
  modalMode.value = 'view'
  userForm.value = {
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    status: user.status,
    password: '',
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  userForm.value = {
    name: '',
    email: '',
    phone: '',
    role: 'customer',
    status: 'active',
    password: '',
  }
}

// Save user with auto-increment ID
const saveUser = async () => {
  loading.value = true
  try {
    if (modalMode.value === 'add') {
      // Transaction to increment userId
      const newUserId = await runTransaction(db, async (transaction) => {
        const counterRef = doc(db, 'counters', 'users')
        const counterSnap = await transaction.get(counterRef)
        let nextId = 1
        if (!counterSnap.exists()) {
          transaction.set(counterRef, { lastId: 1 })
          nextId = 1
        } else {
          const lastId = counterSnap.data().lastId as number
          nextId = lastId + 1
          transaction.update(counterRef, { lastId: nextId })
        }
        return nextId
      })

      await addDoc(collection(db, 'users'), {
        userId: newUserId,
        ...userForm.value,
        createdAt: Timestamp.now(),
      })

      alert(`User added successfully! User ID: ${newUserId}`)
    } else if (modalMode.value === 'edit' && editingDocId.value) {
      await updateDoc(doc(db, 'users', editingDocId.value), {
        name: userForm.value.name,
        email: userForm.value.email,
        phone: userForm.value.phone,
        role: userForm.value.role,
        status: userForm.value.status,
      })
      alert('User updated successfully!')
    }

    closeModal()
  } catch (error) {
    console.error('Error saving user:', error)
    alert('Failed to save user. Please try again.')
  } finally {
    loading.value = false
  }
}

// Update stats
const updateCounts = () => {
  totalUsers.value = users.value.length
  totalAdmins.value = users.value.filter((u) => u.role === 'admin').length
  totalCustomers.value = users.value.filter((u) => u.role === 'customer').length
}

// Format date
const formatDate = (timestamp?: Timestamp) => {
  if (!timestamp?.seconds) return '-'
  return new Date(timestamp.seconds * 1000).toLocaleDateString()
}

// CSV export/import remains same
const exportCSV = () => {
  const headers = ['UserID', 'Name', 'Email', 'Phone', 'Role', 'Status', 'CreatedAt']
  const rows = users.value.map((u) => [
    u.userId,
    u.name,
    u.email,
    u.phone,
    u.role,
    u.status,
    formatDate(u.createdAt),
  ])
  const csvContent = [headers, ...rows].map((e) => e.join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.setAttribute('download', 'users.csv')
  a.click()
  URL.revokeObjectURL(url)
}

const importCSV = () => fileInput.value?.click()
const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = async (e) => {
    const text = e.target?.result as string
    const lines = text.split('\n')
    const headers = lines[0].split(',')
    const usersFromCSV = lines.slice(1).map((line) => {
      const values = line.split(',')
      const userObj: any = {}
      headers.forEach((header, idx) => (userObj[header.trim()] = values[idx]?.trim()))
      return userObj
    })
    for (const u of usersFromCSV) {
      if (!u.userId) continue
      const userRef = doc(db, 'users', u.userId)
      await setDoc(
        userRef,
        {
          ...u,
          createdAt: u.createdAt ? Timestamp.fromDate(new Date(u.createdAt)) : Timestamp.now(),
        },
        { merge: true },
      )
    }
    alert('CSV imported successfully!')
  }
  reader.readAsText(file)
}
</script>

<style scoped>
/* STYLES SAME AS BEFORE */
.admin-users {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.stats {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}
.stat-box {
  flex: 1;
  background: #f5f5f5;
  padding: 15px 20px;
  border-radius: 8px;
  text-align: center;
}
.stat-box .count {
  font-size: 24px;
  font-weight: bold;
  color: #53b400;
}
.stat-box .label {
  display: block;
  margin-top: 5px;
  color: #333;
  font-weight: 500;
}
.actions {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}
.action-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #53b400;
  color: white;
  font-weight: bold;
  padding: 15px 20px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}
.action-box.import {
  background: #3498db;
}
.action-box.export {
  background: #f39c12;
}
.action-box:hover {
  transform: translateY(-2px);
}
.icon {
  font-size: 22px;
  margin-left: 5px;
}
.users-table {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 12px 15px;
  text-align: left;
}
th {
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e0e0e0;
}
tr:hover {
  background-color: #f9f9f9;
}
.btn-view,
.btn-edit {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 6px;
  color: white;
}
.btn-view {
  background-color: #3498db;
}
.btn-view:hover {
  background-color: #2980b9;
}
.btn-edit {
  background-color: #9b59b6;
}
.btn-edit:hover {
  background-color: #8e44ad;
}
.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}
.badge-active {
  background-color: #53b400;
  color: white;
}
.badge-inactive {
  background-color: #f39c12;
  color: white;
}
.role.admin {
  color: #53b400;
  font-weight: bold;
}
.role.manager {
  color: #3498db;
  font-weight: bold;
}
.role.customer {
  color: #f39c12;
  font-weight: bold;
}

/* MODAL STYLES */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.modal-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 24px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #7f8c8d;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #e74c3c;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #34495e;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #53b400;
  outline: none;
}

.form-group input:disabled,
.form-group select:disabled {
  background-color: #f5f6fa;
  cursor: not-allowed;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 30px;
}

.btn-cancel {
  padding: 10px 20px;
  background: #ecf0f1;
  border: none;
  border-radius: 6px;
  color: #7f8c8d;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-cancel:hover {
  background: #bdc3c7;
}

.btn-save {
  padding: 10px 20px;
  background: #53b400;
  border: none;
  border-radius: 6px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-save:hover {
  background: #469600;
}

.btn-save:disabled {
  background: #a8d5a2;
  cursor: not-allowed;
}
</style>
