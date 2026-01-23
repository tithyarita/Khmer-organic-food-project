<template>
  <div class="admin-blog">
    <h2>Admin Blog Dashboard</h2>

    <div class="actions">
      <button class="btn-add" @click="openAddBlog">➕ Add Blog</button>
    </div>

    <div class="blogs-table">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Created</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="blog in blogs" :key="blog.id">
            <td>{{ blog.title }}</td>
            <td>{{ formatDate(blog.createdAt) }}</td>
            <td>
              <img v-if="blog.image" :src="blog.image" class="thumb" />
            </td>
            <td>
              <button class="btn-edit" @click="openEditBlog(blog)">Edit</button>
              <button class="btn-delete" @click="deleteBlog(blog)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-card">
        <h3>{{ modalMode === 'add' ? 'Add Blog' : 'Edit Blog' }}</h3>

        <form @submit.prevent="saveBlog">
          <input v-model="blogForm.title" placeholder="Title" required />
          <textarea v-model="blogForm.content" placeholder="Content" required />

          <input type="file" accept="image/*" @change="handleImageUpload" />
          <img v-if="imagePreview" :src="imagePreview" class="preview"/>

          <div class="modal-actions">
            <button type="button" @click="closeModal">Cancel</button>
            <button type="submit">{{ loading ? 'Saving...' : 'Save' }}</button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { collection, addDoc, onSnapshot, updateDoc, deleteDoc, doc, Timestamp } from 'firebase/firestore'
import { db } from '../../firebase'

interface Blog {
  id?: number | string
  title: string
  content: string
  image?: string
  createdAt?: Timestamp
}

const blogs = ref<Blog[]>([])
const showModal = ref(false)
const modalMode = ref<'add' | 'edit'>('add')
const editingBlogId = ref<string | null>(null)
const loading = ref(false)

const blogForm = ref<Blog>({
  title: '',
  content: '',
  image: ''
})

const imagePreview = ref<string | null>(null)

onMounted(() => {
  const q = collection(db, 'blogs')
  onSnapshot(q, snap => {
    blogs.value = snap.docs.map(d => ({ id: d.id, ...(d.data() as Blog) }))
  })
})

function handleImageUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    blogForm.value.image = reader.result as string
    imagePreview.value = reader.result as string
  }
  reader.readAsDataURL(file)
}

function openAddBlog() {
  modalMode.value = 'add'
  blogForm.value = { title: '', content: '', image: '' }
  imagePreview.value = null
  editingBlogId.value = null
  showModal.value = true
}

function openEditBlog(blog: Blog) {
  modalMode.value = 'edit'
  blogForm.value = { ...blog }
  editingBlogId.value = blog.id!
  imagePreview.value = blog.image || null
  showModal.value = true
}

function closeModal() {
  showModal.value = false
  imagePreview.value = null
}

async function saveBlog() {
  loading.value = true
  try {
    if (modalMode.value === 'add') {
      await addDoc(collection(db, 'blogs'), {
        ...blogForm.value,
        createdAt: Timestamp.now()
      })
    } else {
      await updateDoc(doc(db, 'blogs', editingBlogId.value!), blogForm.value)
    }
    closeModal()
  } catch {
    alert('Save failed')
  }
  loading.value = false
}

async function deleteBlog(blog: Blog) {
  if (confirm('Delete blog?')) {
    await deleteDoc(doc(db, 'blogs', blog.id!))
  }
}

function formatDate(ts?: Timestamp) {
  return ts ? new Date(ts.seconds * 1000).toLocaleDateString() : '-'
}
</script>

<style scoped>
/* ================= ADMIN BLOG ================= */
.admin-blog{
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #fffde7; /* soft cozy cream */
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
  font-family: 'Baloo 2', cursive;
}

h2 {
  text-align: center;
  font-size: 2rem;
  color: #48742C; /* friendly green */
  margin-bottom: 1.5rem;
}

/* ================= ACTIONS ================= */
.actions{
  margin-bottom: 20px;
  text-align: right;
}
.btn-add{
  padding: 10px 18px;
  background: #6ec007;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.25s ease, transform 0.25s ease;
}
.btn-add:hover{
  background: #57a500;
  transform: translateY(-2px);
}

/* ================= BLOG TABLE ================= */
.blogs-table{
  overflow-x:auto;
  max-height:500px;
  overflow-y:auto;
  border-radius: 12px;
}
table{
  width:100%;
  border-collapse:collapse;
}
th, td{
  padding:12px 10px;
  border-bottom:1px solid #e0e0e0;
  text-align: center;
}
th{
  background: #f9fbe7; /* soft green header */
  color: #48742C;
  font-weight: 600;
}
tr:hover{
  background: #f1f8e9; /* soft hover */
}

.btn-edit, .btn-delete{
  padding:6px 12px;
  border:none;
  border-radius:8px;
  color:white;
  cursor:pointer;
  margin-right:5px;
  font-weight: 500;
  transition: transform 0.2s ease;
}
.btn-edit{
  background:#42a5f5;
}
.btn-edit:hover{
  background:#1e88e5;
  transform: translateY(-2px);
}
.btn-delete{
  background:#ef5350;
}
.btn-delete:hover{
  background:#e53935;
  transform: translateY(-2px);
}

.thumb {
  width: 50px;
  border-radius: 8px;
}
.preview {
  width: 200px;
  margin-top: 10px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* ================= MODAL ================= */
.modal-overlay{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1rem;
  overflow-y: auto;
}

.modal-card{
  background: #fffde7;
  padding: 25px;
  border-radius: 20px;
  width: 95%;
  max-width: 600px;
  box-shadow: 0 12px 35px rgba(0,0,0,0.12);
  animation: fadeIn 0.3s ease forwards;
}

.modal-card h3{
  text-align: center;
  color: #48742C;
  margin-bottom: 1.5rem;
  font-family: 'Baloo 2', cursive;
  font-size: 1.8rem;
}

form input, form textarea{
  width: 100%;
  padding: 12px 15px;
  margin-bottom: 15px;
  border-radius: 12px;
  border: 1px solid #cddc39;
  font-size: 1rem;
  font-family: 'Baloo 2', cursive;
  background: #f9fff3;
  transition: border 0.25s ease, box-shadow 0.25s ease;
}
form input:focus, form textarea:focus{
  outline: none;
  border-color: #6ec007;
  box-shadow: 0 0 8px rgba(110,192,7,0.3);
}

textarea {
  resize: vertical;
  min-height: 120px;
}

/* ================= MODAL ACTIONS ================= */
.modal-actions{
  display:flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}
.modal-actions button{
  padding: 10px 18px;
  border:none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
}
.modal-actions .btn-cancel{
  background:#efefef;
  color:#7f8c8d;
}
.modal-actions .btn-cancel:hover{
  background:#e0e0e0;
  transform: translateY(-2px);
}
.modal-actions .btn-save{
  background:#6ec007;
  color:white;
}
.modal-actions .btn-save:hover{
  background:#57a500;
  transform: translateY(-2px);
}

/* ================= ANIMATION ================= */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>


<style scoped>
.admin-blog{
  max-width: 1200px;
  margin:0 auto;
  padding:20px;
  background:white;
  border-radius:8px;
  box-shadow:0 2px 12px rgba(0,0,0,0.1);
}

.actions{margin-bottom:20px;}
.btn-add{padding:8px 15px; background:#53b400; color:white; border:none; border-radius:6px; cursor:pointer;}
.btn-add:hover{background:#469600;}

.blogs-table{overflow-x:auto; max-height:500px; overflow-y:auto;}
table{width:100%; border-collapse:collapse;}
th,td{padding:12px 10px; border-bottom:1px solid #e0e0e0;}
th{background:#f5f5f5;}
tr:hover{background:#f9f9f9;}
.btn-edit, .btn-delete{padding:5px 10px; border:none; border-radius:4px; color:white; cursor:pointer; margin-right:5px;}
.btn-edit{background:#3498db;} .btn-edit:hover{background:#2980b9;}
.btn-delete{background:#e74c3c;} .btn-delete:hover{background:#c0392b;}
tbody{
  text-align: center;
}

/* Modal */
.modal-overlay{position:fixed; inset:0;background:rgba(0,0,0,0.45);display:flex;align-items:center;justify-content:center; z-index:2000; padding:1rem; overflow-y:auto;}
.modal-card{background:white;padding:20px; border-radius:10px; width:95%; max-width:600px;}
.form-group{margin-bottom:15px;}
.form-group label{display:block;margin-bottom:5px;font-weight:600;}
.form-group input, .form-group textarea{width:100%;padding:8px 10px;border:1px solid #ddd;border-radius:6px; font-size:14px;}
.modal-actions{display:flex; justify-content:flex-end; gap:10px;}
.btn-cancel{padding:8px 15px;border:none;border-radius:6px;background:#ecf0f1;cursor:pointer;color:#7f8c8d;}
.btn-save{padding:8px 15px;border:none;border-radius:6px;background:#53b400;color:white; cursor:pointer;}
.btn-save:hover{background:#469600;}
</style>
