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

      <!-- Payment Details Form -->
      <div class="payment-details" v-if="selectedPayment">
        <!-- Card Payment -->
        <div v-if="selectedPayment === 'card'">
          <input type="text" placeholder="Card Number" v-model="paymentDetails.cardNumber" />
        </div>

        <!-- ABA / Acleda / Wing Payment -->
        <div v-else>
          <input type="text" :placeholder="`${selectedPayment.toUpperCase()} Account Number`" v-model="paymentDetails.accountNumber" />
        </div>
      </div>
    </section>

    <!-- Price Summary -->
    <section class="summary">
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


// Computed totals
const subtotal = computed(() =>
  cart.items.reduce((sum, item) => sum + item.price * item.qty, 0)
)
const discount = computed(() => subtotal.value * 0.07)
const delivery = computed(() => (subtotal.value > 0 ? 1.06 : 0))
const total = computed(() => subtotal.value + delivery.value - discount.value)

// Payment state
const selectedPayment = ref('')
const paymentDetails = ref({
  cardNumber: '',
  expiry: '',
  cvv: '',
  accountNumber: '',
})

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

// Place order
async function placeOrder() {
  if (!selectedPayment.value) {
    alert('Please select a payment method.')
    return
  }

  if (cart.items.length === 0) {
    alert('Your cart is empty.')
    return
  }

  isProcessing.value = true
  errorMessage.value = ''

  try {
    // Normalize cart items for backend (ensure numeric id, clear category for sets)
    const normalizedItems = cart.items.map((item: any) => {
      const idNum = Number(item.id)
      const category = item.category
        ? String(item.category).toLowerCase()
        : (item.unit === 'set' ? 'sets' : undefined)

      return {
        id: Number.isNaN(idNum) ? item.id : idNum,
        category,
        quantity: item.qty,
        name: item.name || item.title || '',
        price: item.price
      }
    })

    // Call backend payment endpoint (best-effort)
    await axios.post('http://localhost:3000/payment-success', {
      items: normalizedItems.map(i => ({ id: i.id, category: i.category, quantity: i.quantity }))
    }).catch((e) => {
      // don't fail entire flow if local backend is down; log and continue
      console.warn('Payment backend call failed, continuing:', e.message || e)
    })

    // Persist order to Firestore (with basic user info if available)
    try {
      const user = auth.currentUser ? { uid: auth.currentUser.uid, email: auth.currentUser.email, name: auth.currentUser.displayName } : undefined
      // await createOrder({
      //   user,
      //   items: cart.items.map(i => ({ id: i.id, name: i.name || i.title || '', price: i.price, qty: i.qty, category: i.category })),
      //   subtotal: subtotal.value,
      //   delivery: delivery.value,
      //   discount: discount.value,
      //   total: total.value,
      //   paymentMethod: selectedPayment.value,
      //   status: 'paid'
      // })

      const order = await createOrder({
        user,
        items: normalizedItems.map(i => ({
          id: i.id,
          name: i.name,
          price: i.price,
          qty: i.quantity,
          category: i.category
        })),
        subtotal: subtotal.value,
        delivery: delivery.value,
        discount: discount.value,
        total: total.value,
        paymentMethod: selectedPayment.value,
        status: 'paid'
      })


      // Clear cart AFTER saved successfully
      cart.clear()

      // show success
      // orderSuccess.value = true

      // redirect to thank you page with orderId
      router.push(`/thankyou/${order.id}`)


    } catch (e) {
      console.error('Failed to save order to Firestore', e)
      errorMessage.value = 'Could not save order. Please contact support.'
    }
  }
  catch (error) {
    console.error('Payment failed:', error)
    errorMessage.value = 'Payment processing failed. Please try again.'
  }
  finally {
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
.checkout-page {
  max-width: 720px;
  margin: 2rem auto;
  padding: 2.5rem;
  font-family: 'Poppins', sans-serif;
  background: #fff8f0; /* soft pastel background */
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
}

/* Title */
h1 {
  text-align: center;
  color: #ff6f61;
  font-family: 'Baloo 2', cursive;
  font-size: 3rem;
  margin-bottom: 2.5rem;
  line-height: 1.2;
}

/* Box Sections */
.box {
  margin-bottom: 3rem;
  background: #fff3e6;
  padding: 2.5rem 2rem;
  border-radius: 18px;
  box-shadow: 0 6px 20px rgba(255,111,97,0.08);
  transition: all 0.3s ease;
}

.box h3 {
  margin-bottom: 1.5rem;
  font-size: 1.6rem;
  color: #ff6f61;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Address */
.address {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem;
  background: #fff7f0;
  border-radius: 15px;
  cursor: pointer;
}

.address .name {
  font-size: 1.2rem;
  font-weight: 600;
  color: #ff6f61;
}

.address .contact,
.address .location {
  font-size: 0.95rem;
  color: #555;
}

/* Edit Button */
.address .order-btn {
  background: #ffaf91;
  border-radius: 12px;
  padding: 8px 16px;
  color: #fff;
  font-weight: 600;
  transition: 0.3s;
}
.address .order-btn:hover {
  background: #ff6f61;
}

/* Editable Fields */
.address-edit .field {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
}

.address-edit .label-text {
  font-weight: 600;
  margin-bottom: 0.3rem;
  color: #ff6f61;
}

.address-edit input,
.address-edit textarea {
  padding: 0.8rem 1rem;
  border-radius: 12px;
  border: 1px solid #ffc1b0;
  outline: none;
  font-size: 1rem;
}
.address-edit input:focus,
.address-edit textarea:focus {
  border-color: #ff6f61;
  box-shadow: 0 0 8px rgba(255,111,97,0.2);
}

/* Edit Actions */
.address-edit button.order-btn {
  border-radius: 12px;
  font-weight: 600;
  transition: 0.3s;
}

.address-edit button[disabled] {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Payment Options */
.payment-options {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}
.payment-item {
  padding: 0.8rem 1rem;
  border-radius: 12px;
  background: #fff2e6;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  transition: 0.2s;
}
.payment-item:hover {
  background: #ffdac9;
}

/* Payment Input Fields */
.payment-details input {
  width: 100%;
  padding: 1rem;
  margin-top: 0.8rem;
  font-size: 1rem;
  border-radius: 12px;
  border: 1px solid #ffc1b0;
}
.payment-details input:focus {
  border-color: #ff6f61;
  box-shadow: 0 0 8px rgba(255,111,97,0.2);
}

/* Price Summary */
.summary {
  background: #fff5ed;
  padding: 2rem 1.8rem;
  border-radius: 18px;
  box-shadow: 0 4px 15px rgba(255,111,97,0.08);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 1.05rem;
  color: #555;
}

.discount {
  color: #ff6f61;
}

.total {
  display: flex;
  justify-content: space-between;
  font-size: 1.45rem;
  font-weight: 700;
  color: #ff4a3a;
  margin-top: 1.2rem;
}

/* Place Order Button */
.order-btn {
  display: block;
  width: 220px;
  padding: 1.1rem;
  margin: 2.5rem auto 0 auto;
  background: #ff6f61;
  color: white;
  border: none;
  border-radius: 20px;
  font-size: 18.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.order-btn:hover {
  background: #ff4a3a;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(255,111,97,0.15);
}

/* Spinner */
.spinner {
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 3px solid rgba(255,111,97,0.3);
  border-top-color: #ff6f61;
  animation: spin 1s linear infinite;
  vertical-align: middle;
}

.spinner.large {
  width: 56px;
  height: 56px;
  border-width: 5px;
  margin-bottom: 1rem;
}

@keyframes spin { to { transform: rotate(360deg) } }

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0,0,0,0.35);
  z-index: 2000;
  padding: 1.5rem;
}

.modal-card {
  background: #fff;
  padding: 2rem;
  border-radius: 18px;
  text-align: center;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
}

.modal-card.success { border-top: 6px solid #4BB543; }

.modal-card .check {
  font-size: 3.2rem;
  color: #4BB543;
  margin-bottom: 0.6rem;
}

.modal-actions button.order-btn {
  background: #4BB543;
}

/* Responsive */
@media (max-width: 480px) {
  .checkout-page {
    padding: 1.5rem;
  }
  .order-btn {
    width: 100%;
  }
}

</style>
