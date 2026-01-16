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
  max-width: 600px;
  margin: auto;
}
input, textarea {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
}
button {
  background: #53b400;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
}
.success {
  color: green;
  margin-top: 10px;
}
</style>
