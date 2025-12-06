<template>
  <div class="admin-stocks">
    <div class="header">
      <h2>Stocks Management</h2>
      <p>Monitor and manage product stock levels</p>
    </div>

    <div class="actions">
      <div class="action-box">
        <span>Add Stock</span>
        <span class="icon">➕</span>
      </div>
      <div class="action-box">
        <span>Update Stock</span>
        <span class="icon">⚙️</span>
      </div>
      <div class="action-box">
        <span>Low Stock Alert</span>
        <span class="icon">⚠️</span>
      </div>
    </div>

    <!-- Stocks Table -->
    <div class="stocks-table">
      <table>
        <thead>
          <tr>
            <th>Product ID</th>
            <th>Product Name</th>
            <th>Stock Quantity</th>
            <th>Minimum Level</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Organic Tomato</td>
            <td>45</td>
            <td>20</td>
            <td><span class="badge badge-success">In Stock</span></td>
            <td><button class="btn-edit">Edit</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.admin-stocks {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.header {
  margin-bottom: 30px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 20px;
}

.header h2 {
  margin: 0 0 5px 0;
  color: #2c3e50;
  font-size: 24px;
}

.header p {
  margin: 0;
  color: #7f8c8d;
  font-size: 14px;
}

.actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.action-box {
  background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%);
  padding: 20px 25px;
  color: white;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(243, 156, 18, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(243, 156, 18, 0.3);
}

.action-box .icon {
  font-size: 26px;
}

.stocks-table {
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

.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badge-success {
  background-color: #53b400;
  color: white;
}

.btn-edit {
  padding: 6px 12px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-edit:hover {
  background-color: #2980b9;
}
</style>
