<template>
  <div class="cart-page">
    <h1 class="title">MY CART</h1>

    <!-- CART ITEMS -->
    <div
      v-for="(item, index) in cart.items"
      :key="index"
      class="cart-item"
    >
    <button class="remove-btn" @click="cart.removeItem(index)"><i class="fa-solid fa-xmark"></i></button>

      <img :src="item.image" class="item-img" />

      <div class="item-info">
        <div class="main-row">
          <div class="name-price">
            <h3 class="item-name">{{ item.name }}</h3>
            <!-- ✅ show selected quantity instead of static weight -->
            <p class="weight">{{ item.qty }} {{ item.unit }}</p>
          </div>

          <div class="qty-block">
            <label>Quantity</label>
            <select
              v-model.number="item.qty"
              @change="cart.updateQty(index, item.qty)"
            >
              <option
                v-for="w in item.unit === 'kg' ? weights : sets"
                :key="w"
                :value="w"
              >
                {{ w }} {{ item.unit }}
              </option>
            </select>
          </div>
        </div>

        <p class="price">${{ (item.price * item.qty).toFixed(2) }}</p>
      </div>
    </div>

    <!-- SUMMARY -->
    <div class="summary-box">
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
      <button class="checkout-btn">Checkout</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useCartStore } from '../stores/cart';

const cart = useCartStore();
const weights = [0.5, 1, 1.5, 2];
const sets = [1, 2, 3, 4];

const subtotal = computed(() =>
  cart.items.reduce((sum, item) => sum + item.price * item.qty, 0)
);
const discount = computed(() => subtotal.value * 0.07);
const delivery = computed(() => (subtotal.value > 0 ? 1.06 : 0));
const total = computed(() => subtotal.value + delivery.value - discount.value);
</script>

<style scoped>
.cart-page {
  width: 100%;
  margin: auto;
  max-width: 600px;
  font-family: Arial;
}
.title {
  text-align: center;
  color: #4aa016;
  margin: 20px 0;
}
.cart-item {
  position: relative;
  display: flex;
  align-items: flex-start;
  background: #fafafa;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 15px;
}
.item-img {
  width: 7.5rem;
  margin-right: 20px;
}
.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.main-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.name-price {
  display: flex;
  flex-direction: column;
}
.item-name {
  margin: 0;
  font-size: 1.1rem;
  color:#333;
  font-weight:bold;
}
.price {
  font-size: 1rem;
  font-weight: bold;
  color: #333;
  margin-top: 4px;
}
.qty-block {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 40px;
}
.qty-block label {
  font-size: 0.9rem;
  font-weight: bold;
  margin-bottom: 4px;
}
.qty-block select {
  padding: 5px;
  border-radius: 8px;
  border: 1px solid #888;
}
.remove-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  color: red !important;
  cursor: pointer;
  z-index: 2;
}
.weight {
  color: red;
  font-weight: bold;
  margin-top: 10px;
}
.summary-box {
  margin-top: 40px;
  font-size: 1.1rem;
  font-weight: bold;
  color:#548D0C;
}
.row {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
}
.total-row {
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  font-size: 1.3rem;
  color:red;
}
.discount {
  color:#548D0C;
}
.total {
  color: red;
  font-weight: bold;
  font-size: 22px;
}
.checkout-btn {
  display: block;
  margin: 30px auto;
  padding: 12px 30px;
  background: #8cc84b;
  color: white;
  font-size: 18px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
}
</style>
