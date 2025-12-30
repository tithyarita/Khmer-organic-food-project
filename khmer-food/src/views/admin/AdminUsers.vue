<template>
  <div class="admin-users">
    <!-- USER COUNTS -->
    <div class="user-counts">
      <span>Total Users: {{ users.length }}</span>
      <span>Admin: {{ roleCounts.manager }}</span>
      <span>Managers: {{ roleCounts.admin }}</span>
      <span>Customers: {{ roleCounts.customer }}</span>
    </div>

    <!-- ACTIONS -->
    <div class="actions">
      <div class="action-box" @click="showAddModal = true">
        <span>Add User</span>
        <span class="icon">➕</span>
      </div>

      <div class="action-box" @click="toggleActiveUsers">
        <span>Active Users</span>
        <span class="icon">✅</span>
      </div>

      <div class="action-box">
        <span>Filter Role:</span>
        <select v-model="selectedRole">
          <option value="">All</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="customer">Customer</option>
        </select>
      </div>

      <div class="action-box" @click="exportUsers">
        <span>Export Users</span>
        <span class="icon">📥</span>
      </div>
    </div>

    <!-- USERS TABLE -->
    <div class="users-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Status</th>
            <th>Joined Date</th>
            <th>Actions</th>
          </tr>
        </thead>
<tbody>
  <tr v-for="user in filteredUsers" :key="user.id">
    <td>#{{ user.userId }}</td>
    <td>{{ user.name }}</td>
    <td>{{ user.email }}</td>
    <td>{{ user.phone }}</td>
    <!-- Show role as a badge/text only -->
    <td><span class="role" :class="user.role">{{ user.role }}</span></td>
    <td>
      <span class="badge" :class="user.status === 'active' ? 'badge-active' : 'badge-inactive'">
        {{ user.status }}
      </span>
    </td>
    <td>{{ formatDate(user.createdAt) }}</td>
    <td>
      <button class="btn-view" @click="viewUser(user)">View</button>
      <button class="btn-edit" @click="editUser(user)">Edit</button>
    </td>
  </tr>
  <tr v-if="filteredUsers.length === 0">
    <td colspan="8" style="text-align: center">No users found</td>
  </tr>
</tbody>

      </table>
    </div>

    <!-- VIEW MODAL -->
    <div v-if="showViewModal" class="modal">
      <div class="modal-content">
        <h3>User Details</h3>
        <p><b>Name:</b> {{ selectedUser?.name }}</p>
        <p><b>Email:</b> {{ selectedUser?.email }}</p>
        <p><b>Phone:</b> {{ selectedUser?.phone }}</p>
        <p><b>Role:</b> {{ selectedUser?.role }}</p>
        <p><b>Status:</b> {{ selectedUser?.status }}</p>
        <button @click="showViewModal = false">Close</button>
      </div>
    </div>

    <!-- EDIT MODAL -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <h3>Edit User</h3>
        <label>Name:</label>
        <input v-model="selectedUser!.name" />
        <label>Phone:</label>
        <input v-model="selectedUser!.phone" />
        <label>Role:</label>
        <select v-model="selectedUser!.role">
          <option>admin</option>
          <option>manager</option>
          <option>customer</option>
        </select>
        <label>Status:</label>
        <select v-model="selectedUser!.status">
          <option>active</option>
          <option>inactive</option>
        </select>
        <button @click="saveUser">Save</button>
        <button @click="showEditModal = false">Cancel</button>
      </div>
    </div>

    <!-- ADD MODAL -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h3>Add User</h3>
        <label>Name:</label>
        <input v-model="newUser.name" />
        <label>Email:</label>
        <input v-model="newUser.email" type="email" />
        <label>Phone:</label>
        <input v-model="newUser.phone" />
        <label>Password:</label>
        <input v-model="newUser.password" type="password" placeholder="Enter initial password" />
        <label>Role:</label>
        <select v-model="newUser.role">
          <option>admin</option>
          <option>manager</option>
          <option>customer</option>
        </select>
        <label>Status:</label>
        <select v-model="newUser.status">
          <option>active</option>
          <option>inactive</option>
        </select>
        <button @click="addUser">Add</button>
        <button @click="showAddModal = false">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { collection, onSnapshot, query, orderBy, doc, addDoc, updateDoc, runTransaction, Timestamp } from 'firebase/firestore'
import { db, auth } from '@/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'

interface User {
  id: string
  userId: number
  uid: string
  name: string
  email: string
  phone: string
  role: 'admin' | 'manager' | 'customer'
  status: 'active' | 'inactive'
  createdAt?: Timestamp
  lastLogin?: Timestamp
}

const users = ref<User[]>([])
const showActiveOnly = ref(false)
const selectedRole = ref('')
const selectedUser = ref<User | null>(null)
const showViewModal = ref(false)
const showEditModal = ref(false)
const showAddModal = ref(false)
const newUser = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  role: 'customer' as 'admin' | 'manager' | 'customer',
  status: 'active' as 'active' | 'inactive'
})

// FETCH USERS
onMounted(() => {
  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'))
  onSnapshot(q, snapshot => {
    users.value = snapshot.docs.map(docSnap => {
      const data = docSnap.data() as any
      return {
        id: docSnap.id,
        uid: data.uid,
        userId: data.userId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role ?? 'customer',
        status: data.status ?? 'active',
        createdAt: data.createdAt,
        lastLogin: data.lastLogin
      } as User
    })
  })
})

// FILTERED USERS
const filteredUsers = computed(() => {
  return users.value.filter(u => {
    const statusMatch = showActiveOnly.value ? u.status === 'active' : true
    const roleMatch = selectedRole.value ? u.role === selectedRole.value : true
    return statusMatch && roleMatch
  })
})

// USER COUNTS
const roleCounts = computed(() => ({
  admin: users.value.filter(u => u.role === 'admin').length,
  manager: users.value.filter(u => u.role === 'manager').length,
  customer: users.value.filter(u => u.role === 'customer').length
}))

// ACTIONS
const toggleActiveUsers = () => { showActiveOnly.value = !showActiveOnly.value }
const viewUser = (user: User) => { selectedUser.value = user; showViewModal.value = true }
const editUser = (user: User) => { selectedUser.value = { ...user }; showEditModal.value = true }
const saveUser = async () => {
  if (!selectedUser.value) return
  await updateDoc(doc(db, 'users', selectedUser.value.id), {
    name: selectedUser.value.name,
    phone: selectedUser.value.phone,
    role: selectedUser.value.role,
    status: selectedUser.value.status
  })
  showEditModal.value = false
}
const onRoleChange = async (user: User, event: Event) => {
  const newRole = (event.target as HTMLSelectElement).value as 'admin' | 'manager' | 'customer'
  user.role = newRole
  await updateDoc(doc(db, 'users', user.id), { role: newRole })
}

// ADD USER
const addUser = async () => {
  try {
    if (!newUser.value.email || !newUser.value.password) return alert('Email and password are required')
    const userCredential = await createUserWithEmailAndPassword(auth, newUser.value.email, newUser.value.password)
    const uid = userCredential.user.uid
    let newUserId = 1
    await runTransaction(db, async transaction => {
      const counterRef = doc(db, 'counters', 'users')
      const counterSnap = await transaction.get(counterRef)
      if (!counterSnap.exists()) transaction.set(counterRef, { lastId: 1 })
      else { newUserId = counterSnap.data().lastId + 1; transaction.update(counterRef, { lastId: newUserId }) }
    })
    await addDoc(collection(db, 'users'), {
      userId: newUserId, uid,
      name: newUser.value.name,
      email: newUser.value.email,
      phone: newUser.value.phone,
      role: newUser.value.role,
      status: newUser.value.status,
      createdAt: Timestamp.now(),
      lastLogin: Timestamp.now()
    })
    showAddModal.value = false
    newUser.value = { name: '', email: '', phone: '', password: '', role: 'customer', status: 'active' }
    alert('User added successfully!')
  } catch (error) { console.error(error); alert('Failed to add user') }
}

// EXPORT USERS
const exportUsers = () => {
  const csv = [
    ['ID','Name','Email','Phone','Role','Status'],
    ...users.value.map(u => [u.userId,u.name,u.email,u.phone,u.role,u.status])
  ].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = 'users.csv'
  a.click()
}

const formatDate = (ts?: Timestamp) => !ts ? '-' : ts.toDate().toLocaleDateString()
</script>


<style scoped>
/* Styles remain mostly the same as before for modal, table, actions */
.admin-users { background: white; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); padding: 25px; }
.actions { display: grid; grid-template-columns: repeat(auto-fit,minmax(200px,1fr)); gap:20px; margin-bottom:40px; }
.action-box { background: linear-gradient(135deg,#9b59b6,#8e44ad); padding:20px 25px; color:white; font-weight:bold; display:flex; justify-content:space-between; align-items:center; border-radius:6px; cursor:pointer; transition:0.3s ease; }
.action-box:hover { transform: translateY(-2px); }
.icon { font-size:26px; }
.users-table { overflow-x:auto; }
table { width:100%; border-collapse:collapse; }
th { background-color:#f5f5f5; padding:15px; text-align:left; font-weight:600; color:#2c3e50; }
td { padding:15px; border-bottom:1px solid #e0e0e0; }
tr:hover { background-color:#f9f9f9; }
.role { padding:4px 12px; border-radius:20px; font-size:12px; font-weight:600; }
.role.admin { background-color:#ffe5e5; color:#c0392b; }
.role.manager { background-color:#fff4e5; color:#d68910; }
.role.customer { background-color:#e5f5ff; color:#0984e3; }
.badge { padding:6px 12px; border-radius:20px; font-size:12px; font-weight:600; }
.badge-active { background-color:#d4edda; color:#155724; }
.badge-inactive { background-color:#f8d7da; color:#721c24; }
.btn-view, .btn-edit { padding:6px 12px; margin-right:8px; border:none; border-radius:4px; cursor:pointer; }
.btn-view { background-color:#3498db; color:white; }
.btn-edit { background-color:#9b59b6; color:white; }

/* Modal */
.modal { position:fixed; top:0; left:0; width:100%; height:100%; background: rgba(0,0,0,0.5); display:flex; align-items:center; justify-content:center; z-index:1000; }
.modal-content { background:white; padding:20px; border-radius:10px; min-width:300px; max-width:400px; }
.modal-content input, .modal-content select { width:100%; padding:5px; margin-bottom:10px; border-radius:5px; border:1px solid #ccc; }
.modal-content button { margin-right:5px; padding:5px 10px; border:none; border-radius:5px; cursor:pointer; }
</style>
