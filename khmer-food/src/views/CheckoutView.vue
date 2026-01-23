<template>
  <div class="checkout-page">
    <h1>Checkout</h1>

    <!-- Shipping Address -->
    <section class="box">
      <h3>Shipping Address</h3>

      <div v-if="!shippingEditable" class="address">
        <div>
          <strong class="name">{{ shipping.name || 'Guest' }}</strong>
          <p class="contact">{{ shipping.phone || '-' }}</p>
          <p class="location">{{ shipping.address || 'No address provided' }}</p>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <button class="order-btn" style="padding:8px 12px;width:auto" @click="shippingEditable = true">Edit</button>
        </div>
      </div>

      <div v-else class="address-edit">
        <label class="field"><span class="label-text">Name</span>
          <input type="text" v-model="shipping.name" />
        </label>

        <label class="field"><span class="label-text">Phone</span>
          <input type="text" v-model="shipping.phone" />
        </label>

        <label class="field"><span class="label-text">Address</span>
          <textarea v-model="shipping.address" rows="3"></textarea>
        </label>

        <div style="display:flex;gap:8px;margin-top:8px">
          <button class="order-btn" :disabled="savingAddress" @click="saveShipping">{{ savingAddress ? 'Saving...' : 'Save Address' }}</button>
          <button class="order-btn" style="background:#ccc;color:#111" @click="shippingEditable = false">Cancel</button>
        </div>
      </div>

    </section>

<!-- Payment Method -->
<section class="box">
  <h3>Payment Method</h3>
  <div class="payment-options">
    <label class="payment-item">
      <input type="radio" value="card" v-model="selectedPayment" />
      💳 Visa / MasterCard
    </label>
    <label class="payment-item">
      <input type="radio" value="aba" v-model="selectedPayment" />
      ABA
    </label>
    <label class="payment-item">
      <input type="radio" value="acleda" v-model="selectedPayment" />
      Acleda
    </label>
    <label class="payment-item">
      <input type="radio" value="wing" v-model="selectedPayment" />
      Wing
    </label>
  </div>

  <!-- Payment Details -->
  <div class="payment-details" v-if="selectedPayment">

    <!-- CARD -->
    <div v-if="selectedPayment === 'card'">
      <input type="text" placeholder="Card Number" v-model="paymentDetails.cardNumber" />
    </div>

    <!-- ABA QR -->
    <div v-else-if="selectedPayment === 'aba'" class="qr-box">
      <img src="/images/aba-qr.png" alt="ABA QR Code" />
      <p class="qr-text">Scan with ABA Mobile to pay</p>

      <!-- Upload Screenshot -->
      <label class="upload-label">
        Upload Payment Screenshot:
        <input type="file" accept="image/*" @change="handleQRUpload($event)" />
      </label>

      <div v-if="paymentDetails.qrImage">
        <p>Preview:</p>
        <img :src="paymentDetails.qrImage" class="qr-preview" />
      </div>
    </div>

    <!-- ACLEDA QR -->
    <div v-else-if="selectedPayment === 'acleda'" class="qr-box">
      <img src="/images/acleda-qr.png" alt="ACLEDA QR Code" />
      <p class="qr-text">Scan with ACLEDA Mobile to pay</p>

      <!-- Upload Screenshot -->
      <label class="upload-label">
        Upload Payment Screenshot:
        <input type="file" accept="image/*" @change="handleQRUpload($event)" />
      </label>

      <div v-if="paymentDetails.qrImage">
        <p>Preview:</p>
        <img :src="paymentDetails.qrImage" class="qr-preview" />
      </div>
    </div>

    <!-- WING -->
    <div v-else-if="selectedPayment === 'wing'">
      <input type="text" placeholder="Wing Account Number" v-model="paymentDetails.accountNumber" />
    </div>

  </div>
</section>



    <!-- Price Summary -->
    <section class="summary">
      <div class="summary-row">
        <span>Selected Items</span>
        <span>{{ selectedItems.length }}</span>
      </div>
      <div class="summary-row">
        <span>Sub Total</span>
        <span>${{ subtotal.toFixed(2) }}</span>
      </div>
      <div class="summary-row">
        <span>Delivery Charge</span>
        <span>${{ delivery.toFixed(2) }}</span>
      </div>
      <div class="summary-row">
        <span>Discount</span>
        <span class="discount">- ${{ discount.toFixed(2) }}</span>
      </div>
      <hr />
      <div class="total">
        <span>Total</span>
        <span>${{ total.toFixed(2) }}</span>
      </div>
    </section>

    <!-- Place Order Button -->
    <button class="order-btn" :disabled="isProcessing || subtotal === 0" @click="placeOrder">
      <span v-if="!isProcessing">Place Your Order</span>
      <span v-else class="btn-with-spinner">
        <span class="spinner" /> Processing...
      </span>
    </button>

    <!-- Processing Modal -->
    <div v-if="isProcessing" class="modal-overlay">
      <div class="modal-card">
        <div class="spinner large" />
        <h3>Processing payment</h3>
        <p>Please wait while we confirm your payment and save your order.</p>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="orderSuccess" class="modal-overlay" @click.self="closeSuccess">
      <div class="modal-card success">
        <div class="check">✓</div>
        <h3>Payment Successful</h3>
        <p>Your order has been placed successfully.</p>
        <div class="modal-actions">
          <button class="order-btn" @click="goHome">Continue Shopping</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useCartStore } from '../stores/cart'
import axios from 'axios'
// import router from '../router/index'
import { useRouter } from 'vue-router'

import { createOrder } from '../services/orderService'
import { auth, db } from '../firebase.js'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { getUserStorage, saveUserStorage } from '../loginstorage'

const router = useRouter()
const cart = useCartStore()

/* ✅ Only selected items from cart */
const selectedItems = computed(() =>
  cart.items.filter(item => item.selected)
)

/* Totals based on selected items */
const subtotal = computed(() =>
  selectedItems.value.reduce((sum, item) => sum + item.price * item.qty, 0)
)

const DELIVERY_FEE = 1.06
const delivery = computed(() => (subtotal.value > 0 ? DELIVERY_FEE : 0))
// const discount = computed(() => subtotal.value * 0.07)

const getDiscountedPrice = (item: CartItem) =>
  item.discount && item.discount > 0
    ? item.price - (item.price * item.discount) / 100
    : item.price


const discount = computed(() =>
  selectedItems.value.reduce((sum, item) => {
    const originalTotal = item.price * item.qty
    const discountedTotal = getDiscountedPrice(item) * item.qty
    return sum + (originalTotal - discountedTotal)
  }, 0)
)

// const delivery = computed(() => (subtotal.value > 0 ? 1.06 : 0))
// const total = computed(() => subtotal.value + delivery.value - discount.value)
const total = computed(() => subtotal.value + delivery.value - discount.value)

// Payment state
const selectedPayment = ref('')
const paymentDetails = ref({
  cardNumber: '',
  expiry: '',
  cvv: '',
  accountNumber: '',
  qrImage: '',
})
function handleQRUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // Preview image
  const reader = new FileReader()
  reader.onload = e => {
    paymentDetails.value.qrImage = e.target?.result as string
  }
  reader.readAsDataURL(file)
}
// UI and order state
const isProcessing = ref(false)
const orderSuccess = ref(false)
const errorMessage = ref('')

// Shipping info (loaded from users collection)
const shipping = ref({ name: '', phone: '', address: '' })
const shippingEditable = ref(false)
const savingAddress = ref(false)

onMounted(async () => {
  try {
    const user = getUserStorage()
    if (!user?.uid) return

    const snap = await getDoc(doc(db, 'users', user.uid))
    if (!snap.exists()) return

    const data: any = snap.data()
    shipping.value.name = data.name || user.name || ''
    shipping.value.phone = data.phone || user.phone || ''
    shipping.value.address = data.address || (data.shipping && data.shipping.address) || ''
  } catch (e) {
    console.warn('Failed to load shipping info:', e)
  }
})

async function saveShipping() {
  const user = getUserStorage()
  if (!user?.uid) {
    alert('Please login to save shipping information')
    return
  }

  savingAddress.value = true
  try {
    await updateDoc(doc(db, 'users', user.uid), {
      name: shipping.value.name,
      phone: shipping.value.phone,
      address: shipping.value.address,
      updatedAt: new Date()
    })

    saveUserStorage({ ...user, name: shipping.value.name, phone: shipping.value.phone, address: shipping.value.address })

    shippingEditable.value = false
    alert('Shipping address saved')
  } catch (e) {
    console.error('Failed to save shipping info', e)
    alert('Failed to save address. Try again.')
  } finally {
    savingAddress.value = false
  }
}

async function placeOrder() {
  // 1️⃣ Must select items
  if (selectedItems.value.length === 0) {
    alert('You need to select the product')
    return
  }

  // 2️⃣ Must select payment method
  if (!selectedPayment.value) {
    alert('Please select a payment method.')
    return
  }

  // 3️⃣ QR payment must have uploaded screenshot
  if (
    (selectedPayment.value === 'aba' || selectedPayment.value === 'acleda') &&
    !paymentDetails.value.qrImage
  ) {
    alert('Please Pay Money and Upload your payment screenshot')
    return
  }

  // 4️⃣ Card or Wing payment validations (optional)
  if (selectedPayment.value === 'card' && !paymentDetails.value.cardNumber) {
    alert('Please enter your card number')
    return
  }

  if (selectedPayment.value === 'wing' && !paymentDetails.value.accountNumber) {
    alert('Please enter your Wing account number')
    return
  }

  // 5️⃣ Continue normal order flow
  const user = auth.currentUser
  if (!user) {
    alert('Please log in to place an order.')
    return
  }

  // Proceed with processing...
  isProcessing.value = true
  try {
    // Your existing order logic here...
    // e.g., send paymentDetails.qrImage to backend or save in Firestore
    const order = await createOrder({
      user: { uid: user.uid, email: user.email, name: user.displayName },
      items: selectedItems.value,
      subtotal: subtotal.value,
      delivery: delivery.value,
      discount: discount.value,
      total: total.value,
      paymentMethod: selectedPayment.value,
      qrImage: paymentDetails.value.qrImage, // Save uploaded QR screenshot
      status: selectedPayment.value === 'card' ? 'paid' : 'pending' // optional
    })

    cart.clear()
    router.push(`/thankyou/${order.id}`)

  } catch (e) {
    console.error('Order failed', e)
    alert('Failed to place the order. Try again.')
  } finally {
    isProcessing.value = false
  }
}

function closeSuccess() {
  orderSuccess.value = false
}

function goReview() {
  orderSuccess.value = false
  router.push('/ReviewPage')
}

function goHome() {
  orderSuccess.value = false
  router.push('/')
}

</script>
<style scoped>
/* ===== PAGE ===== */
.checkout-page {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 2rem;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  font-family: 'Roboto', sans-serif;
}

/* ===== TITLE ===== */
h1 {
  text-align: center;
  font-size: 2.4rem;
  margin-bottom: 2rem;
  color: #6ec007;
  font-weight: 700;
}

/* ===== SECTION BOX ===== */
.box {
  background: #fafafa;
  padding: 1.6rem;
  border-radius: 12px;
  margin-bottom: 1.8rem;
  border: 1px solid #e5e5e5;
}

.box h3 {
  font-size: 1.3rem;
  margin-bottom: 1.2rem;
  color: #6ec007;
  font-weight: 600;
}

/* ===== ADDRESS ===== */
.address {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #ddd;
}

.address .name {
  font-weight: 600;
  font-size: 1.05rem;
  color: #222;
}

.address .contact,
.address .location {
  font-size: 0.95rem;
  color: #666;
}

/* Edit button */
.address .order-btn {
  background: transparent;
  color: #007bff;
  font-weight: 600;
  padding: 0;
}
.address .order-btn:hover {
  text-decoration: underline;
}

/* ===== ADDRESS FORM ===== */
.address-edit .field {
  margin-bottom: 1rem;
}

.address-edit label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #555;
  margin-bottom: 0.3rem;
  display: block;
}

.address-edit input,
.address-edit textarea {
  width: 100%;
  padding: 0.7rem 0.9rem;
  border-radius: 8px;
  border: 1px solid #ccc;
  font-size: 0.95rem;
}

.address-edit input:focus,
.address-edit textarea:focus {
  border-color: #007bff;
  outline: none;
}

/* ===== PAYMENT ===== */
.payment-options {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.payment-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #fff;
  cursor: pointer;
}

.payment-item:hover {
  background: #f5f7fa;
}

/* Payment inputs */
.payment-details input {
  width: 100%;
  padding: 0.8rem;
  margin-top: 0.7rem;
  border-radius: 8px;
  border: 1px solid #ccc;
}

/* ===== QR ===== */
.qr-box {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 10px;
  background: #ffffff;
  border: 1px dashed #ccc;
  text-align: center;
}

.qr-box img {
  max-width: 200px;
}

.qr-text {
  margin-top: 0.6rem;
  font-size: 0.9rem;
  color: #555;
}

/* ===== SUMMARY ===== */
.summary {
  background: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #ddd;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
  color: #222;
}

.total {
  display: flex;
  justify-content: space-between;
  font-size: 1.3rem;
  font-weight: 700;
  color: #ff0000;
  margin-top: 1rem;
}

/* ===== PLACE ORDER ===== */
.order-btn {
  display: block;
  width: 20%;
  padding: 1rem;
  margin: 2rem auto 0; /* center horizontally */
  border-radius: 10px;
  background: #6ec007;
  color: #fff;
  border: none;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
}


.order-btn:hover {
  background: #0069d9;
}

.order-btn:disabled {
  background: #aaa;
  cursor: not-allowed;
}

/* ===== MODAL ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-card {
  background: #fff;
  padding: 2rem;
  border-radius: 14px;
  max-width: 420px;
  width: 100%;
  text-align: center;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 480px) {
  .checkout-page {
    padding: 1.2rem;
  }
}
.discount {
  color: #6ec007;
}
</style>

