<template>
  <div class="cart-page">
    <h1 class="title">MY CART</h1>

    <div v-if="cart.items.length > 0">
      <!-- CART ITEMS -->
      <div
        v-for="(item, index) in cart.items"
        :key="index"
        class="cart-item"
      >
      <!--Select Item Checkbox-->
      <input
        type="checkbox"
        class="select-item"
        v-model="item.selected"
        />
        <button class="remove-btn" @click="cart.removeItem(index)">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <img :src="item.image" class="item-img" />

        <div class="item-info">
          <div class="name-price">
            <h3 class="item-name">{{ item.name }}</h3>
            <!-- <p class="unit-price">${{ item.price.toFixed(1) }} per {{ item.unit }}</p> -->
          
            <p class="unit-price">
              <template v-if="item.discount && item.discount > 0">
                <span class="old-price">${{ item.price.toFixed(2) }}/{{ item.unit }}</span>
                <span class="new-price">
                  ${{ (item.price - (item.price * item.discount) / 100).toFixed(2) }}/{{ item.unit }}
                  <span class="discount-text">(-{{ item.discount }}%)</span>
                </span>
              </template>
              <template v-else>
                ${{ item.price.toFixed(1) }}/{{ item.unit }}
              </template>
            </p>

          </div>

          <div class="quantity-row">
            <label>Quantity:</label>
            <select 
              v-model="item.qty" 
              @change="updateQty(index, item.qty)"
            >
              <option 
                v-for="q in item.unit === 'kg' ? weights : sets" 
                :key="q" 
                :value="q"
              >
                {{ q }} {{ item.unit }}
              </option>
            </select>
          </div>

          <!-- <p class="total-price">Total: ${{ (item.price * item.qty).toFixed(1) }}</p> -->
          
          <p class="total-price">
            Total:
            <template v-if="item.discount && item.discount > 0">
              ${{ ((item.price - (item.price * item.discount) / 100) * item.qty).toFixed(2) }}
            </template>
            <template v-else>
              ${{ (item.price * item.qty).toFixed(2) }}
            </template>
          </p>
        
        </div>
      </div>

      <!-- SUMMARY -->
      <div class="summary-box">
        <h2>Order Summary</h2>
        <div class="row">
          <span>Selected Items</span>
          <span>{{ selectedItems.length }}</span>
        </div>
        <div class="row">
          <span>Sub Total</span>
          <span>${{ subtotal.toFixed(2) }}</span>
        </div>
        <div class="row">
          <span>Delivery Charge</span>
          <span>${{ delivery.toFixed(2) }}</span>
        </div>
        <div class="row">
          <span>Discount</span>
          <span class="discount">- ${{ discount.toFixed(2) }}</span>
        </div>
        <div class="total-row">
          <span>Total</span>
          <span class="total">${{ total.toFixed(2) }}</span>
        </div>
        <button class="checkout-btn" @click="goToCheckout"> Checkout</button>

        
      </div>
    </div>

    <div v-else class="empty-cart">
      <p>Your cart is empty!</p>
      <router-link to="/" class="shop-now-btn">Shop Now</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '../stores/cart'

const cart = useCartStore()
const router = useRouter()



const weights = [0.5, 1.0, 1.5, 2.0]
const sets = [1, 2, 3, 4]

const selectedItems = computed(() => cart.items.filter(item => item.selected))

const getDiscountedPrice = (item: CartItem) =>
  item.discount && item.discount > 0
    ? item.price - (item.price * item.discount) / 100
    : item.price

// const subtotal = computed(() =>
//   selectedItems.value.reduce(
//     (sum, item) => sum + getDiscountedPrice(item) * item.qty,
//     0
//   )
// )

const subtotal = computed(() =>
  selectedItems.value.reduce((sum, item) => sum + item.price * item.qty, 0)
)


const discount = computed(() =>
  selectedItems.value.reduce((sum, item) => {
    const originalTotal = item.price * item.qty
    const discountedTotal = getDiscountedPrice(item) * item.qty
    return sum + (originalTotal - discountedTotal)
  }, 0)
)

const DELIVERY_FEE = 1.06
const delivery = computed(() => (subtotal.value > 0 ? DELIVERY_FEE : 0))
const total = computed(() => subtotal.value + delivery.value- discount.value)
// const total = computed(() => subtotal.value)

const updateQty = (index: number, value: number) => {
  if (!cart.items[index]) return
  const qty = Number(value)
  const minQty = cart.items[index].unit === 'kg' ? 0.5 : 1
  cart.updateQty(index, qty < minQty ? minQty : qty)
}

const goToCheckout = () => {
  if (selectedItems.value.length === 0) {
    alert('You need to select the product')
    return
  }

  router.push({ name: 'Checkout' })
}


</script>

<style scoped>
.cart-page {
  max-width: 800px;
  margin: 0 auto;
  font-family: 'Roboto', sans-serif;
  padding: 20px;
}

.title {
  text-align: center;
  color: #6ec007;
  margin-bottom: 30px;
  font-size: 2rem;
}

.cart-item {
  display: flex;
  align-items: flex-start;
  background: #ffffff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  position: relative;
  transition: transform 0.2s;
}
.select-item {
  transform: scale(1.3);
  cursor: pointer;
  margin-top: 6px;
}
.cart-item:hover {
  transform: translateY(-3px);
}

.item-img {
  width: 120px;
  border-radius: 10px;
  margin-right: 20px;
  object-fit: cover;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.name-price {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.item-name {
  font-size: 1.2rem;
  color: #333;
  font-weight: bold;
  margin: 0;
}

.unit-price {
  color: #888;
  font-size: 0.9rem;
}

.quantity-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity-row select {
  width: 70px;
  padding: 5px;
  border-radius: 8px;
  border: 1px solid #888;
  text-align: center;
  cursor: pointer;
}

.total-price {
  font-weight: bold;
  color: #6ec007;
}

.remove-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  color: red;
  cursor: pointer;
}

.summary-box {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.summary-box h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #6ec007;
}

.row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.total-row {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 1.2rem;
  color: red;
  margin-top: 10px;
}

.discount {
  color: #6ec007;
}

.checkout-btn {
  display: block;             /* allow horizontal centering */
  width: 200px;               /* fixed width, adjust as needed */
  padding: 12px;
  background: #6ec007;
  color: white;
  font-size: 18px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  margin: 20px auto 0 auto;  /* top margin 20px, horizontally centered */
  transition: background 0.3s;
}

.checkout-btn:hover {
  background: #6ec007;
}

.empty-cart {
  text-align: center;
  padding: 50px 20px;
}

.shop-now-btn {
  display: inline-block;
  margin-top: 20px;
  padding: 12px 25px;
  background: #6ec007;
  color: white;
  border-radius: 10px;
  text-decoration: none;
  font-weight: bold;
  transition: background 0.3s;
}

.shop-now-btn:hover {
  background: #6ec007;
}

.old-price {
  text-decoration: line-through;
  color: #999;
  font-size: 0.9rem;
  margin-right: 0.3rem;
}

.new-price {
  color: #6ec007;
  font-weight: bold;
  font-size: 1rem;
}

.discount-text {
  color: #ff0000;
  font-weight: bold;
  margin-left: 0.3rem;
}


</style>
