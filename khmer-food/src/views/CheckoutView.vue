<template>
  <div class="checkout-page">
    <h1>Checkout</h1>

    <!-- Shipping Address -->
    <section class="box">
      <h3>Shipping Address</h3>
      <div class="address">
        <div>
          <strong class="name">Tithyarita</strong>
          <p class="contact">+885 17213337</p>
          <p class="location">Sen Sok, Aeon2, Phnom Penh</p>
        </div>
        <span class="arrow">›</span>
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
    <button class="order-btn" @click="placeOrder">Place Your Order</button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCartStore } from '../stores/cart'

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

// Place order
function placeOrder() {
  if (!selectedPayment.value) {
    alert('Please select a payment method.')
    return
  }

  if (selectedPayment.value === 'card') {
    if (!paymentDetails.value.cardNumber || !paymentDetails.value.expiry || !paymentDetails.value.cvv) {
      alert('Please fill all card details.')
      return
    }
  } else {
    if (!paymentDetails.value.accountNumber) {
      alert(`Please enter your ${selectedPayment.value.toUpperCase()} account number.`)
      return
    }
  }

  alert(`Payment successful using ${selectedPayment.value.toUpperCase()}!`)
}
</script>

<style scoped>
.checkout-page {
  max-width: 720px;
  margin: 2rem auto;
  padding: 2.5rem;
  font-family: 'Roboto', sans-serif;
  background: #fdfdfd;
  border-radius: 15px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.12);
}

/* Title */
h1 {
  text-align: center;
  color: #4caf50;
  font-family: 'Baloo Tammudu 2', cursive;
  font-size: 3rem;
  margin-bottom: 2.5rem;
  line-height: 1.2;
}

/* Box Sections */
.box {
  margin-bottom: 3rem;
  background: #fff;
  padding: 2.5rem 2rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
}

.box h3 {
  margin-bottom: 1.5rem;
  font-size: 1.6rem;
  color: #333;
  font-weight: 700;
  letter-spacing: 0.5px;
}

/* Address */
.address {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem;
  background: #f9f9f9;
  border-radius: 10px;
  cursor: pointer;
}

.address .name {
  font-size: 1.2rem;
  font-weight: 600;
}

.arrow {
  font-size: 1.8rem;
  color: #4caf50;
}

/* Payment */
.payment-options {
  display: flex;
  flex-direction: column;
}

.payment-item {
  display: flex;
  align-items: center;
  padding: 1rem 0;
  font-size: 1.05rem;
  border-bottom: 1px solid #eee;
  cursor: pointer;
}

.payment-item input {
  margin-right: 12px;
}

.payment-details input {
  width: 100%;
  padding: 1rem;
  margin-top: 0.8rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 10px;
}

.payment-details input:focus {
  border-color: #4caf50;
  outline: none;
}

/* Price Summary */
.summary {
  background: #fff;
  padding: 2rem 1.8rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.08);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 1.05rem;
  color: #555;
}

.discount {
  color: #4caf50;
}

.total {
  display: flex;
  justify-content: space-between;
  font-size: 1.45rem;
  font-weight: 700;
  color: #e53935;
  margin-top: 1.2rem;
}

/* Place Order Button */
.order-btn {
  display: block;
  width: 220px;
  padding: 1.1rem;
  margin: 2.5rem auto 0 auto;
  background: #4caf50;
  color: white;
  border: none;
  border-radius: 15px;
  font-size: 18.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.order-btn:hover {
  background: #43a047;
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0,0,0,0.15);
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
