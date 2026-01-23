<template>
  <div class="admin-contact">
    <h2>Website Contact Info</h2>

    <label>Address</label>
    <input v-model="form.address" />

    <label>Phone</label>
    <input v-model="form.phone" />

    <label>Email</label>
    <input v-model="form.email" />

    <label>Facebook</label>
    <input v-model="form.facebook" />

    <label>Google Map Embed URL</label>
    <textarea v-model="form.mapUrl" rows="3"></textarea>

    <button @click="save" :disabled="saving">
      {{ saving ? "Saving..." : "Save Changes" }}
    </button>

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

const saving = ref(false)
const success = ref(false)

onMounted(async () => {
  const snap = await getDoc(doc(db, "site", "contact"))
  if (snap.exists()) {
    Object.assign(form.value, snap.data())
  }
})

async function save() {
  saving.value = true
  await setDoc(doc(db, "site", "contact"), {
    ...form.value,
    updatedAt: new Date()
  })
  saving.value = false
  success.value = true
  setTimeout(() => success.value = false, 2000)
}
</script>

<style scoped>
.admin-contact {
  max-width: 800px;
  height: auto;
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
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
  font-family: 'Quicksand', sans-serif;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #6ec007;
  box-shadow: 0 0 0 3px rgba(110, 192, 7, 0.15);
}

textarea {
  resize: vertical;
  min-height: 80px;
}

button {
  width: 100%;
  background: linear-gradient(135deg, #6ec007, #53b400);
  color: #fff;
  padding: 12px 20px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(83, 180, 0, 0.25);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
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
