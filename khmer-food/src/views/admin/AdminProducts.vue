<template>
  <div class="admin-products">
    <div class="actions">
      <div class="action-box">
        <span>Add Product</span>
        <span class="icon">➕</span>
      </div>
      <div class="action-box">
        <span>Update Product</span>
        <span class="icon">⚙️</span>
      </div>
      <div class="action-box">
        <span>Delete Product</span>
        <span class="icon">🗑️</span>
      </div>
    </div>

    <!-- Products Table -->
    <div class="products-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Organic Tomato</td>
            <td>$5.00</td>
            <td>Vegetables</td>
            <td>
              <button class="btn-edit">Edit</button>
              <button class="btn-delete">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.admin-products {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.action-box {
  background: linear-gradient(135deg, #53b400 0%, #4a9a00 100%);
  padding: 20px 25px;
  color: white;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(83, 180, 0, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(83, 180, 0, 0.3);
}

.action-box .icon {
  font-size: 26px;
}

.products-table {
  margin-top: 30px;
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
  border-bottom: 2px solid #e0e0e0;
}

td {
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
}

tr:hover {
  background-color: #f9f9f9;
}

.btn-edit,
.btn-delete {
  padding: 6px 12px;
  margin-right: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-edit {
  background-color: #3498db;
  color: white;
}

.btn-edit:hover {
  background-color: #2980b9;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
}

.btn-delete:hover {
  background-color: #c0392b;
}
</style>
