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
.thumb { width:50px; border-radius:6px }
.preview { width:200px; margin-top:10px }
</style>

<style scoped>
.admin-blog{
  max-width: 900px;
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
