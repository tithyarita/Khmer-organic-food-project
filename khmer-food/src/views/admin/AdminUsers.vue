<template>
  <div class="admin-users">
    <!-- ACTIONS -->
    <div class="actions">
      <div class="action-box">
        <span>Add User</span>
        <span class="icon">➕</span>
      </div>
      <div class="action-box">
        <span>Active Users</span>
        <span class="icon">✅</span>
      </div>
      <div class="action-box">
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
          <tr v-for="user in users" :key="user.id">
            <td>#{{ user.id.slice(0, 5) }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.phone }}</td>
            <td>
              <span class="role" :class="user.role">
                {{ user.role }}
              </span>
            </td>
            <td>
              <span
                class="badge"
                :class="user.status === 'active' ? 'badge-active' : 'badge-inactive'"
              >
                {{ user.status }}
              </span>
            </td>
            <td>{{ formatDate(user.createdAt) }}</td>
            <td>
              <button class="btn-view">View</button>
              <button class="btn-edit">Edit</button>
            </td>
          </tr>

          <tr v-if="users.length === 0">
            <td colspan="8" style="text-align:center;">
              No users found
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '@/firebase'

interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'admin' | 'manager' | 'customer'
  status: 'active' | 'inactive'
  createdAt?: any
}

const users = ref<User[]>([])

onMounted(() => {
  const q = query(
    collection(db, 'users'),
    orderBy('createdAt', 'desc')
  )

  onSnapshot(q, snapshot => {
    users.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as User[]
  })
})

const formatDate = (timestamp: any) => {
  if (!timestamp?.seconds) return '-'
  return new Date(timestamp.seconds * 1000).toLocaleDateString()
}
</script>

<style scoped>
.admin-users {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 25px;
}

.actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.action-box {
  background: linear-gradient(135deg, #9b59b6, #8e44ad);
  padding: 20px 25px;
  color: white;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s ease;
}

.action-box:hover {
  transform: translateY(-2px);
}

.icon {
  font-size: 26px;
}

.users-table {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  background-color: #f5f5f5;
  padding: 15px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
}

td {
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
}

tr:hover {
  background-color: #f9f9f9;
}

.role {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.role.admin {
  background-color: #ffe5e5;
  color: #c0392b;
}

.role.manager {
  background-color: #fff4e5;
  color: #d68910;
}

.role.customer {
  background-color: #e5f5ff;
  color: #0984e3;
}

.badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badge-active {
  background-color: #d4edda;
  color: #155724;
}

.badge-inactive {
  background-color: #f8d7da;
  color: #721c24;
}

.btn-view,
.btn-edit {
  padding: 6px 12px;
  margin-right: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-view {
  background-color: #3498db;
  color: white;
}

.btn-edit {
  background-color: #9b59b6;
  color: white;
}
</style>
