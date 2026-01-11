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
        <span class="count">{{ totalManagers }}</span>
        <span class="label">Managers</span>
      </div>
      <div class="stat-box">
        <span class="count">{{ totalCustomers }}</span>
        <span class="label">Customers</span>
      </div>
    </div>

    <!-- ACTIONS & FILTERS -->
    <div class="actions-filters">
      <div class="actions">
        <div class="action-box add" @click="openAddUser">➕ Add User</div>
        <div class="action-box import" @click="importCSV">📥 Import CSV
          <input type="file" ref="fileInput" style="display:none" @change="handleFileUpload" accept=".csv" />
        </div>
        <div class="action-box export" @click="exportCSV">📤 Export CSV</div>
      </div>

      <div class="filters">
        <input type="text" v-model="searchTerm" placeholder="Search by name, email, phone..." @input="applyFilters" />
        <select v-model="filterRole" @change="applyFilters">
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="customer">Customer</option>
        </select>
        <select v-model="filterStatus" @change="applyFilters">
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>

    <!-- USERS TABLE -->
    <div class="users-table">
      <table>
        <thead>
          <tr>
            <th @click="sortBy('userId')">User ID</th>
            <th @click="sortBy('name')">Name</th>
            <th @click="sortBy('email')">Email</th>
            <th @click="sortBy('phone')">Phone</th>
            <th @click="sortBy('role')">Role</th>
            <th @click="sortBy('status')">Status</th>
            <th @click="sortBy('createdAt')">Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.docId">
            <td>#{{ user.userId }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.phone }}</td>
            <td><span class="role" :class="user.role">{{ user.role }}</span></td>
            <td>
              <span :class="['badge', user.status === 'active' ? 'badge-active':'badge-inactive']">{{ user.status }}</span>
            </td>
            <td>{{ formatDate(user.createdAt) }}</td>
            <td>
              <button class="btn-view" @click="openViewUser(user)">View</button>
              <button class="btn-edit" @click="openEditUser(user)">Edit</button>
            </td>
          </tr>
          <tr v-if="filteredUsers.length === 0">
            <td colspan="8" style="text-align:center">No users found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- USER MODAL -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ modalMode==='add'? 'Add New User' : modalMode==='edit'? 'Edit User' : 'User Details' }}</h3>
          <button class="close-btn" @click="closeModal">×</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveUser">
            <div class="form-group">
              <label>Full Name</label>
              <input v-model="userForm.name" type="text" :disabled="modalMode==='view'" required />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="userForm.email" type="email" :disabled="modalMode==='view'" required />
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input v-model="userForm.phone" type="tel" :disabled="modalMode==='view'" required />
            </div>
            <div class="form-group" v-if="modalMode==='add'">
              <label>Password</label>
              <input v-model="userForm.password" type="password" placeholder="Enter password" required />
            </div>
            <div class="form-group">
              <label>Role</label>
              <select v-model="userForm.role" :disabled="modalMode==='view'">
                <option value="customer">Customer</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div class="form-group">
              <label>Status</label>
              <select v-model="userForm.status" :disabled="modalMode==='view'">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div class="modal-actions" v-if="modalMode!=='view'">
              <button type="button" class="btn-cancel" @click="closeModal">Cancel</button>
              <button type="submit" class="btn-save" :disabled="loading">{{ loading?'Saving...':'Save User' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { collection, query, orderBy, onSnapshot, addDoc, updateDoc, doc, runTransaction, Timestamp } from 'firebase/firestore'
import { db } from '../../firebase'

interface User {
  docId: string
  userId: number
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
const totalManagers = ref(0)
const totalCustomers = ref(0)
const showModal = ref(false)
const modalMode = ref<'add' | 'edit' | 'view'>('add')
const editingDocId = ref<string | null>(null)
const loading = ref(false)
const userForm = ref({name:'',email:'',phone:'',role:'customer',status:'active',password:''})
const searchTerm = ref('')
const filterRole = ref('')
const filterStatus = ref('')

// --- Firestore ---
onMounted(()=>{
  const q=query(collection(db,'users'),orderBy('userId','desc'))
  onSnapshot(q,snapshot=>{
    users.value = snapshot.docs.map(doc=>({docId:doc.id,...doc.data() as Omit<User,'docId'>}))
    updateCounts()
  })
})

// --- Filters & Sorting ---
const filteredUsers = computed(()=>{
  return users.value.filter(u=>{
    if(filterRole.value && u.role!==filterRole.value) return false
    if(filterStatus.value && u.status!==filterStatus.value) return false
    if(searchTerm.value){
      const t=searchTerm.value.toLowerCase()
      if(!u.name.toLowerCase().includes(t)&&!u.email.toLowerCase().includes(t)&&!u.phone.includes(t)) return false
    }
    return true
  })
})
function applyFilters(){}

// --- Modals ---
function openAddUser(){modalMode.value='add';userForm.value={name:'',email:'',phone:'',role:'customer',status:'active',password:''};editingDocId.value=null;showModal.value=true}
function openEditUser(user:User){modalMode.value='edit';userForm.value={name:user.name,email:user.email,phone:user.phone,role:user.role,status:user.status,password:''};editingDocId.value=user.docId;showModal.value=true}
function openViewUser(user:User){modalMode.value='view';userForm.value={name:user.name,email:user.email,phone:user.phone,role:user.role,status:user.status,password:''};showModal.value=true}
function closeModal(){showModal.value=false;userForm.value={name:'',email:'',phone:'',role:'customer',status:'active',password:''}}

// --- Save User ---
async function saveUser(){
  loading.value=true
  try{
    if(modalMode.value==='add'){
      const newId = await runTransaction(db,async tx=>{
        const counterRef = doc(db,'counters','users')
        const snap = await tx.get(counterRef)
        let nextId=1
        if(!snap.exists()) tx.set(counterRef,{lastId:1})
        else nextId=(snap.data().lastId as number)+1, tx.update(counterRef,{lastId:nextId})
        return nextId
      })
      await addDoc(collection(db,'users'),{userId:newId,...userForm.value,createdAt:Timestamp.now()})
      alert('User added successfully!')
    } else if(modalMode.value==='edit' && editingDocId.value){
      await updateDoc(doc(db,'users',editingDocId.value),{...userForm.value})
      alert('User updated successfully!')
    }
    closeModal()
  }catch(err){console.error(err);alert('Failed to save user.')}
  finally{loading.value=false}
}

// --- Stats ---
function updateCounts(){
  totalUsers.value=users.value.length
  totalAdmins.value=users.value.filter(u=>u.role==='admin').length
  totalManagers.value=users.value.filter(u=>u.role==='manager').length
  totalCustomers.value=users.value.filter(u=>u.role==='customer').length
}

// --- Utilities ---
function formatDate(timestamp?:Timestamp){
  if(!timestamp?.seconds) return '-'
  return new Date(timestamp.seconds*1000).toLocaleDateString()
}

// --- CSV ---
const fileInput = ref<HTMLInputElement|null>(null)
function exportCSV(){
  const headers=['UserID','Name','Email','Phone','Role','Status','CreatedAt']
  const rows=users.value.map(u=>[u.userId,u.name,u.email,u.phone,u.role,u.status,formatDate(u.createdAt)])
  const csv=[headers,...rows].map(e=>e.join(',')).join('\n')
  const blob=new Blob([csv],{type:'text/csv'})
  const url=URL.createObjectURL(blob)
  const a=document.createElement('a'); a.href=url; a.setAttribute('download','users.csv'); a.click(); URL.revokeObjectURL(url)
}
function importCSV(){fileInput.value?.click()}
function handleFileUpload(e:Event){
  const file=(e.target as HTMLInputElement).files?.[0]; if(!file) return
  const reader=new FileReader()
  reader.onload=async ev=>{
    const text=ev.target?.result as string
    const lines=text.split('\n')
    const headers=lines[0].split(',')
    const usersFromCSV=lines.slice(1).map(line=>{
      const values=line.split(',')
      const obj:any={}
      headers.forEach((h,i)=>obj[h.trim()]=values[i]?.trim())
      return obj
    })
    for(const u of usersFromCSV){
      if(!u.userId) continue
      const userRef=doc(db,'users',u.userId)
      await setDoc(userRef,{...u,createdAt:u.createdAt?Timestamp.fromDate(new Date(u.createdAt)):Timestamp.now()},{merge:true})
    }
    alert('CSV imported successfully!')
  }
  reader.readAsText(file)
}
</script>

<style scoped>
/* Styles same as previous, keep table scrollable */
.admin-users{background:white;padding:30px;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.1);}
.stats{display:flex;gap:20px;margin-bottom:20px;flex-wrap:wrap;}
.stat-box{flex:1;background:#f5f5f5;padding:15px 20px;border-radius:8px;text-align:center;}
.stat-box .count{font-size:24px;font-weight:bold;color:#53b400;}
.stat-box .label{display:block;margin-top:5px;color:#333;font-weight:500;}
.actions-filters{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;flex-wrap:wrap;gap:10px;}
.actions{display:flex;gap:10px;flex-wrap:wrap;}
.action-box{padding:10px 15px;background:#53b400;color:white;border-radius:6px;cursor:pointer;font-weight:bold;}
.action-box.import{background:#3498db;}
.action-box.export{background:#f39c12;}
.action-box:hover{transform:translateY(-2px);}
.filters{display:flex;gap:10px;align-items:center;flex-wrap:wrap;}
.filters input, .filters select{padding:6px 10px;border-radius:6px;border:1px solid #ccc;}
.users-table{overflow-x:auto;max-height:600px;overflow-y:auto;}
table{width:100%;border-collapse:collapse;}
th,td{padding:10px;text-align:left;}
th{cursor:pointer;font-weight:600;color:#2c3e50;border-bottom:2px solid #e0e0e0;}
tr:hover{background:#f9f9f9;}
.btn-view, .btn-edit{padding:5px 10px;border:none;border-radius:4px;color:white;cursor:pointer;margin-right:5px;}
.btn-view{background:#3498db;}
.btn-view:hover{background:#2980b9;}
.btn-edit{background:#9b59b6;}
.btn-edit:hover{background:#8e44ad;}
.badge{padding:4px 12px;border-radius:20px;font-size:12px;font-weight:600;}
.badge-active{background:#53b400;color:white;}
.badge-inactive{background:#f39c12;color:white;}
.role.admin{color:#53b400;font-weight:bold;}
.role.manager{color:#3498db;font-weight:bold;}
.role.customer{color:#f39c12;font-weight:bold;}
.modal-overlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:1000;backdrop-filter:blur(4px);}
.modal-content{background:white;padding:30px;border-radius:12px;width:100%;max-width:500px;box-shadow:0 10px 25px rgba(0,0,0,0.2);}
.modal-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;}
.close-btn{background:none;border:none;font-size:28px;cursor:pointer;color:#7f8c8d;}
.close-btn:hover{color:#e74c3c;}
.form-group{margin-bottom:15px;}
.form-group label{display:block;margin-bottom:6px;font-weight:500;color:#34495e;}
.form-group input, .form-group select{width:100%;padding:8px 10px;border:1px solid #ddd;border-radius:6px;font-size:14px;}
.form-group input:focus, .form-group select:focus{border-color:#53b400;outline:none;}
.modal-actions{display:flex;justify-content:flex-end;gap:10px;margin-top:20px;}
.btn-cancel{padding:8px 15px;background:#ecf0f1;border:none;border-radius:6px;color:#7f8c8d;font-weight:600;cursor:pointer;}
.btn-cancel:hover{background:#bdc3c7;}
.btn-save{padding:8px 15px;background:#53b400;border:none;border-radius:6px;color:white;font-weight:600;cursor:pointer;}
.btn-save:hover{background:#469600;}
.btn-save:disabled{background:#a8d5a2;cursor:not-allowed;}
</style>
