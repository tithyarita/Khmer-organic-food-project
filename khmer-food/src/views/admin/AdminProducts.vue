<template>
  <div class="admin-inventory">

    <!-- ACTIONS -->
    <div class="actions">
      <div class="action-box add" @click="openAddModal">
        <span>Add Item</span>
        <span class="icon">➕</span>
      </div>

      <div class="action-box update" @click="showLowStockOnly = false">
        <span>All Products</span>
        <span class="icon">📦</span>
      </div>

      <div class="action-box alert" @click="showLowStockOnly = !showLowStockOnly">
        <span>Low Stock</span>
        <span class="icon">⚠️</span>
      </div>
    </div>

    <!-- FILTERS -->
    <div class="filter-bar">
      <input type="text" v-model="searchTerm" placeholder="Search product..." />
      <select v-model="selectedCategory">
        <option value="">All Categories</option>
        <option>Vegetables</option>
        <option>Meats</option>
        <option>Soup</option>
        <option>Fried (Chha)</option>
        <option>Steamed</option>
      </select>
    </div>

    <!-- INVENTORY TABLE -->
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th><input type="checkbox" v-model="selectAll" @change="toggleSelectAll" /></th>
            <th>ID</th>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in filteredProducts" :key="item.category + item.id">
            <td><input type="checkbox" v-model="selectedProducts" :value="item.id" /></td>
            <td>{{ item.id }}</td>
            <td>
              <img :src="item.image || placeholderImg" class="thumbnail" />
              {{ item.name }}
            </td>
            <td>{{ item.category }}</td>
            <td>${{ item.price }}</td>
            <td>{{ item.stock }}</td>
            <td>
              <span
                class="badge"
                :class="item.stock === 0 ? 'warning' : item.stock <= (item.minStock || LOW_STOCK_LIMIT) ? 'low' : 'success'"
              >
                {{
                  item.stock === 0
                    ? 'Out of Stock'
                    : item.stock <= (item.minStock || LOW_STOCK_LIMIT)
                    ? 'Low Stock'
                    : 'In Stock'
                }}
              </span>
            </td>
            <td>
              <button class="btn-edit" @click="openEdit(item)">Edit</button>
              <button class="btn-delete" @click="deleteProduct(item)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- BULK ACTIONS -->
      <div v-if="selectedProducts.length" class="bulk-actions">
        <button @click="deleteSelected" class="btn-delete">Delete Selected</button>
      </div>

    </div>

    <!-- ADD PRODUCT MODAL -->
    <div v-if="showAddModal" class="modal-overlay">
      <div class="modal">
        <h2>Add Product</h2>

        <label>Name</label>
        <input type="text" v-model="form.name" />

        <label>Price</label>
        <input type="number" v-model.number="form.price" />

        <label>Unit</label>
        <select v-model="form.unit">
          <option value="kg">kg</option>
          <option value="set">set</option>
        </select>

        <label>Category</label>
        <select v-model="form.category">
          <option>Vegetables</option>
          <option>Meats</option>
          <option>Soup</option>
          <option>Fried (Chha)</option>
          <option>Steamed</option>
        </select>

        <!-- <label>Rating</label>
        <input type="number" min="0" max="5" v-model.number="form.rating" /> -->

        <label>Stock</label>
        <input type="number" v-model.number="form.stock" min="0" />

        <label>Image</label>
        <input type="file" @change="onFileChange" />
        <div v-if="form.imageFile">
          <img :src="URL.createObjectURL(form.imageFile)" class="preview-img" />
        </div>

        <div class="modal-actions">
          <button class="btn-save" @click="saveProduct">Save</button>
          <button class="btn-cancel" @click="showAddModal = false">Cancel</button>
        </div>
      </div>
    </div>

    <!-- EDIT MODAL -->
    <div v-if="showEditModal" class="modal-overlay">
      <div class="modal">
        <h2>Edit Product</h2>

        <label>Name</label>
        <input v-model="form.name" type="text" />

        <label>Price</label>
        <input v-model.number="form.price" type="number" />

        <label>Category</label>
        <select v-model="form.category">
          <option>Vegetables</option>
          <option>Meats</option>
          <option>Soup</option>
          <option>Fried (Chha)</option>
          <option>Steamed</option>
        </select>

        <!-- <label>Rating</label>
        <input v-model.number="form.rating" type="number" min="0" max="5" /> -->

        <label>Stock</label>
        <input type="number" v-model.number="form.stock" min="0" />

        <label>Image</label>
        <input type="file" @change="onFileChange" />
        <div v-if="form.imageFile">
          <img :src="URL.createObjectURL(form.imageFile)" class="preview-img" />
        </div>

        <div class="modal-actions">
          <button class="btn-save" @click="updateProductAction">Save</button>
          <button class="btn-cancel" @click="closeEdit">Cancel</button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  getVegetables,
  getMeats,
  getSets,
  addProduct,
  updateProduct,
  deleteVegetable,
  deleteMeat,
  deleteSetItem
} from '../../services/adminService'

const showAddModal = ref(false)
const showEditModal = ref(false)
const showLowStockOnly = ref(false)

const form = ref({
  id: null,
  name: '',
  price: 0,
  unit: 'kg',
  rating: 0,
  stock: 0,
  category: 'Vegetables',
  imageFile: null as File | null
})

const vegetables = ref<any[]>([])
const meats = ref<any[]>([])
const sets = ref<any[]>([])

const loadProducts = async () => {
  vegetables.value = (await getVegetables()).data
  meats.value = (await getMeats()).data
  sets.value = (await getSets()).data
}

onMounted(loadProducts)

const allProducts = computed(() => [
  ...vegetables.value.map(v => ({ ...v, category: 'Vegetables' })),
  ...meats.value.map(m => ({ ...m, category: 'Meats' })),
  ...sets.value.flatMap(s => s.items.map(i => ({ ...i, category: s.title })))
])

const LOW_STOCK_LIMIT = 5
const selectedProducts = ref<string[]>([])
const selectAll = ref(false)

const searchTerm = ref('')
const selectedCategory = ref('')

const filteredProducts = computed(() => {
  return allProducts.value.filter(item => {
    const matchesStock = showLowStockOnly.value ? item.stock < LOW_STOCK_LIMIT : true
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    const matchesCategory = selectedCategory.value ? item.category === selectedCategory.value : true
    return matchesStock && matchesSearch && matchesCategory
  })
})

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedProducts.value = filteredProducts.value.map(p => p.id)
  } else {
    selectedProducts.value = []
  }
}

// ---------------- Add/Edit ----------------
const openAddModal = () => {
  form.value = { id: null, name: '', price: 0, unit: 'kg', rating: 0, stock: 0, category: 'Vegetables', imageFile: null }
  showAddModal.value = true
}

const openEdit = (item: any) => {
  form.value = { ...item, imageFile: null }
  showEditModal.value = true
}

const closeEdit = () => { showEditModal.value = false }

const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    form.value.imageFile = target.files[0]
  }
}

const saveProduct = async () => {
  if (!form.value.imageFile) {
    alert('Please select an image')
    return
  }

  await addProduct(form.value)
  showAddModal.value = false
  await loadProducts()
}


const updateProductAction = async () => {
  await updateProduct(form.value)
  showEditModal.value = false
  await loadProducts()
}

// ---------------- DELETE ----------------
const deleteProduct = async (item: any) => {
  if (item.category === 'Vegetables') await deleteVegetable(item.id)
  else if (item.category === 'Meats') await deleteMeat(item.id)
  else await deleteSetItem(item.category, item.id)
  await loadProducts()
}

// ---------------- BULK DELETE ----------------
const deleteSelected = async () => {
  for (const id of selectedProducts.value) {
    const product = allProducts.value.find(p => p.id === id)
    if (product) await deleteProduct(product)
  }
  selectedProducts.value = []
}
const placeholderImg = '/placeholder.png'
</script>

<style scoped>
/* Keeping your original design */
.admin-inventory { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }

.actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px,1fr)); gap: 20px; margin-bottom: 20px; }
.action-box { padding: 20px; color: white; font-weight: bold; display: flex; justify-content: space-between; align-items: center; border-radius: 6px; cursor: pointer; }
.action-box.add { background: linear-gradient(135deg, #53b400, #4a9a00); }
.action-box.update { background: linear-gradient(135deg, #3498db, #2980b9); }
.action-box.alert { background: linear-gradient(135deg, #f39c12, #e67e22); }

.filter-bar { display: flex; gap: 15px; margin-bottom: 20px; }
.filter-bar input, .filter-bar select { padding: 8px; border-radius: 6px; border: 1px solid #ccc; }

.table-wrapper { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: 12px; text-align: left; border-bottom: 1px solid #e0e0e0; }
tr:hover { background-color: #f9f9f9; }

.btn-edit { background-color: #3498db; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; margin-right: 6px; }
.btn-delete { background-color: #e74c3c; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; }

.thumbnail { width: 50px; height: 50px; object-fit: cover; border-radius: 4px; margin-right: 8px; }
.preview-img { width: 100px; height: 100px; object-fit: cover; border-radius: 6px; margin-top: 8px; }

.badge { padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
.badge.success { background-color: #53b400; color: white; }
.badge.low { background-color: #f79b2a; color: white; }
.badge.warning { background-color: #f93535; color: white; }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; }
.modal { background: white; padding: 25px; border-radius: 8px; width: 400px; display: flex; flex-direction: column; gap: 10px; }
.modal input, .modal select { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; }
.btn-save { background: #53b400; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
.btn-cancel { background: #e74c3c; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
.bulk-actions { margin-top: 10px; }
</style>
