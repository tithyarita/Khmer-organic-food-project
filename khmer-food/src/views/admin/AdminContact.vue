<template>
  <div class="admin-contact">
    <h2>Admin Contact Info</h2>

    <label>Address</label>
    <input v-model="form.address" :disabled="!isEditing" />

    <label>Phone</label>
    <input v-model="form.phone" :disabled="!isEditing" />

    <label>Email</label>
    <input v-model="form.email" :disabled="!isEditing" />

    <label>Facebook</label>
    <input v-model="form.facebook" :disabled="!isEditing" />

    <label>Google Map Embed URL</label>
    <textarea
      v-model="form.mapUrl"
      rows="3"
      :disabled="!isEditing"
    ></textarea>

    <div class="actions">
      <button v-if="!isEditing" class="btn-edit" @click="enableEdit">
        ✏️ Edit
      </button>

      <button
        v-if="isEditing"
        class="btn-save"
        @click="save"
        :disabled="saving"
      >
        {{ saving ? "Saving..." : "Save Changes" }}
      </button>

      <button
        v-if="isEditing"
        class="btn-cancel"
        @click="cancelEdit"
        :disabled="saving"
      >
        Cancel
      </button>
    </div>

    <p v-if="success" class="success">Saved successfully ✔</p>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue"
import { db } from "../../firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"

const form = ref({
  address: "",
  phone: "",
  email: "",
  facebook: "",
  mapUrl: ""
})

const originalData = ref({ ...form.value })

const isEditing = ref(false)
const saving = ref(false)
const success = ref(false)

onMounted(async () => {
  const snap = await getDoc(doc(db, "site", "contact"))
  if (snap.exists()) {
    Object.assign(form.value, snap.data())
    originalData.value = { ...form.value }
  }
})

function enableEdit() {
  isEditing.value = true
}

function cancelEdit() {
  form.value = { ...originalData.value }
  isEditing.value = false
}

async function save() {
  saving.value = true
  await setDoc(doc(db, "site", "contact"), {
    ...form.value,
    updatedAt: new Date()
  })
  originalData.value = { ...form.value }
  saving.value = false
  isEditing.value = false
  success.value = true
  setTimeout(() => (success.value = false), 2000)
}
</script>
<style scoped>
.admin-contact {
  max-width: 800px;
  margin: 40px auto;
  background: #ffffff;
  padding: 28px 30px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  font-family: 'Quicksand', sans-serif;
}

.admin-contact h2 {
  text-align: center;
  margin-bottom: 24px;
  font-size: 24px;
  font-weight: 700;
  color: #3a3a3a;
}

label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 600;
  color: #555;
}

input,
textarea {
  width: 100%;
  padding: 12px 14px;
  margin-bottom: 18px;
  border-radius: 10px;
  border: 1px solid #ddd;
  font-size: 14px;
  font-family: 'Quicksand', sans-serif;
}

input:disabled,
textarea:disabled {
  background: #f6f6f6;
  color: #888;
  cursor: not-allowed;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #6ec007;
  box-shadow: 0 0 0 3px rgba(110, 192, 7, 0.15);
}

.actions {
  display: flex;
  gap: 12px;
  margin-top: 10px;
}

.btn-edit {
  width: 100%;
  background: #eceff1;
  color: #37474f;
  padding: 12px;
  border-radius: 999px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.btn-save {
  flex: 1;
  background: linear-gradient(135deg, #6ec007, #53b400);
  color: white;
  padding: 12px;
  border-radius: 999px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

.btn-cancel {
  flex: 1;
  background: #f1f1f1;
  color: #666;
  padding: 12px;
  border-radius: 999px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

button:hover {
  transform: translateY(-2px);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.success {
  margin-top: 16px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #2e7d32;
  background: #e8f5e9;
  padding: 10px;
  border-radius: 10px;
}
</style>
