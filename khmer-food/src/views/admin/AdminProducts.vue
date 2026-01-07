<template>
  <div class="admin-inventory">

    <!-- ACTIONS -->
    <div class="actions">
      <div class="action-box add" @click="openAddModal">
        <span>Add Item</span>
        <span class="icon">➕</span>
      </div>
      <!-- <div class="action-box update">
        <span>Update Item</span>
        <span class="icon">⚙️</span>
      </div> -->
      <div class="action-box update" @click="showLowStockOnly = false">
        <span>All Proudcts</span>
        <span class="icon">📦 </span>
      </div>

      <div class="action-box alert" @click="showLowStockOnly = !showLowStockOnly">
        <span>Low Stock</span>
        <span class="icon">⚠️</span>
      </div>

    </div>

    <!-- INVENTORY TABLE -->
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <!-- <th>Min Level</th> -->
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>

          <tr
            v-for="item in (showLowStockOnly ? lowStockProducts : allProducts)"
            :key="item.category + item.id"
          >

            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.category }}</td>
            <td>${{ item.price }}</td>

            <!-- show stock number -->
            <td>{{ item.stock }}</td>
            <!-- <td>10</td> -->
            <!-- stock status -->
            <td>
              <span
                class="badge"
                :class="
                  item.stock === 0
                    ? 'warning'
                    : item.stock < 5
                    ? 'low'
                    : 'success'
                "
              >
                {{
                  item.stock === 0
                    ? 'Out of Stock'
                    : item.stock < 5
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

    <label>Rating</label>
    <input type="number" min="0" max="5" v-model.number="form.rating" />

    <label>Stock</label>
    <input type="number" v-model.number="form.stock" min="0" />


    <label>Image</label>
    <input type="file" @change="onFileChange" />

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

    <label>Rating</label>
    <input v-model.number="form.rating" type="number" min="0" max="5" />

    <label>Stock</label>
    <input type="number" v-model.number="form.stock" min="0" />


    <div class="modal-actions">
      <button class="btn-save" @click="updateProductAction">Save</button>
      <button class="btn-cancel" @click="closeEdit">Cancel</button>
    </div>
  </div>
</div>


    </div>

  </div>
</template>

<script setup lang="ts">
import axios from 'axios' 
import api from '@/services/api'
import { ref, onMounted, computed } from 'vue'
import {
  getVegetables,
  getMeats,
  getSets,
  addProduct,
  updateProduct,
  deleteVegetable,
  deleteMeat,
  deleteSetItem,
  
} from '../../services/adminService'

// ---------------- UI STATE ----------------
const showAddModal = ref(false)
const showEditModal = ref(false)

const showLowStockOnly = ref(false)

// ---------------- FORM ----------------
const onFileChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    form.value.imageFile = target.files[0]
  }
}


const form = ref({
  id: null,
  name: '',
  price: 0,
  unit: 'kg',
  rating: 0,
  stock: 0,              // ✅ replace inStock
  category: 'Vegetables',
  imageFile: null as File | null
})


// ---------------- DATA ----------------
const vegetables = ref<any[]>([])
const meats = ref<any[]>([])
const sets = ref<any[]>([])

// ---------------- LOAD DATA ----------------
const loadProducts = async () => {
  vegetables.value = (await getVegetables()).data
  meats.value = (await getMeats()).data
  sets.value = (await getSets()).data
}
onMounted(async () => {
  await loadProducts()
})

// onMounted(loadProducts)

// ---------------- COMBINED PRODUCTS ----------------
const allProducts = computed(() => [
  ...vegetables.value.map(v => ({ ...v, category: 'Vegetables' })),
  ...meats.value.map(m => ({ ...m, category: 'Meats' })),
  ...sets.value.flatMap(s =>
    s.items.map(i => ({ ...i, category: s.title }))
  )
])

// ---------------- ADD ----------------
const openAddModal = () => {
  form.value = {
    id: null,
    name: '',
    price: 0,
    unit: 'kg',
    rating: 0,
    stock: 0,
    category: 'Vegetables',
    imageFile: null
  }
  showAddModal.value = true
}


// Add product
const saveProduct = async () => {
  try {
    const formData = new FormData()

    formData.append('name', form.value.name)
    formData.append('price', String(form.value.price))
    formData.append('unit', form.value.unit)
    formData.append('rating', String(form.value.rating))
    formData.append('stock', String(form.value.stock)) // ✅ works
    formData.append('image', form.value.imageFile!)

    let url = ''
    if (form.value.category === 'Vegetables') url = '/vegetables'
    else if (form.value.category === 'Meats') url = '/meats'
    else url = '/sets'
    formData.append('category', form.value.category)

    await axios.post(`http://localhost:3000${url}`, formData)

    showAddModal.value = false
    await loadProducts() // ✅ already exists

  } catch (err) {
    console.error('Add product failed:', err)
  }
}





// ---------------- EDIT ----------------
const openEdit = (item: any) => {
  form.value = { ...item }
  showEditModal.value = true
}

const closeEdit = () => {
  showEditModal.value = false
}

const updateProductAction = async () => {
  try {
    await updateProduct(form.value)
    alert('Product updated successfully')
    showEditModal.value = false
    await loadProducts()
  } catch (error) {
    console.error('Update failed', error)
  }
}

// ---------------- DELETE ----------------
const deleteProduct = async (item: any) => {
  console.log('Deleting item:', item)

  try {
    if (item.category === 'Vegetables') {
      await deleteVegetable(item.id)
    } else if (item.category === 'Meats') {
      await deleteMeat(item.id)
    } else {
      await deleteSetItem(item.category, item.id)
    }

    alert('Deleted successfully')
    await loadProducts()
  } catch (err: any) {
    console.error('DELETE ERROR:', err)
    console.error('RESPONSE:', err?.response)
    alert('Delete failed: ' + err?.response?.status)
  }

}

const LOW_STOCK_LIMIT = 5

const lowStockProducts = computed(() =>
  allProducts.value.filter(item => item.stock < LOW_STOCK_LIMIT)
)



</script>


<style scoped>

.badge.low {
  background-color: #f79b2a;
  color: white;
}

.admin-inventory {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* ACTION BAR */
.actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 35px;
}

.action-box {
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

.action-box.add {
  background: linear-gradient(135deg, #53b400, #4a9a00);
}

.action-box.update {
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.action-box.alert {
  background: linear-gradient(135deg, #f39c12, #e67e22);
}

.icon {
  font-size: 26px;
}

/* TABLE */
.table-wrapper {
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

/* BUTTONS */
.btn-edit {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 6px;
}
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 25px;
  border-radius: 10px;
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal h2 {
  margin-bottom: 10px;
}

.modal input,
.modal select {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}

.btn-save {
  background: #53b400;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
}

.btn-cancel {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 5px;
}


.btn-edit:hover {
  background-color: #2980b9;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-delete:hover {
  background-color: #c0392b;
}

/* BADGES */
.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badge.success {
  background-color: #53b400;
  color: white;
}

.badge.warning {
  background-color: #f93535;
  color: white;
}

/* Add button */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  padding: 25px;
  border-radius: 8px;
  width: 400px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal input,
.modal select {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-save {
  background: #53b400;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-cancel {
  background: #e74c3c;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

</style>
