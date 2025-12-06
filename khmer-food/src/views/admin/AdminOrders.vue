<template>
  <div class="admin-orders">
    <div class="actions">
      <div class="action-box">
        <span>New Order</span>
        <span class="icon">➕</span>
      </div>
      <div class="action-box">
        <span>Pending Orders</span>
        <span class="icon">⏳</span>
      </div>
      <div class="action-box">
        <span>Export Orders</span>
        <span class="icon">📥</span>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="orders-table">
      <table>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Customer Name</th>
            <th>Order Date</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>#ORD001</td>
            <td>Sophia Chen</td>
            <td>2025-12-01</td>
            <td>$250.00</td>
            <td><span class="badge badge-pending">Pending</span></td>
            <td>
              <button class="btn-view">View</button>
              <button class="btn-edit">Edit</button>
            </td>
          </tr>
          <tr>
            <td>#ORD002</td>
            <td>David Kim</td>
            <td>2025-12-02</td>
            <td>$180.50</td>
            <td><span class="badge badge-shipped">Shipped</span></td>
            <td>
              <button class="btn-view">View</button>
              <button class="btn-edit">Edit</button>
            </td>
          </tr>
          <tr>
            <td>#ORD003</td>
            <td>Maria Santos</td>
            <td>2025-12-03</td>
            <td>$420.00</td>
            <td><span class="badge badge-delivered">Delivered</span></td>
            <td>
              <button class="btn-view">View</button>
              <button class="btn-edit">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.admin-orders {
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
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  padding: 20px 25px;
  color: white;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(52, 152, 219, 0.3);
}

.action-box .icon {
  font-size: 26px;
}

.orders-table {
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
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badge-pending {
  background-color: #f39c12;
  color: white;
}

.badge-shipped {
  background-color: #3498db;
  color: white;
}

.badge-delivered {
  background-color: #27ae60;
  color: white;
}

.btn-view,
.btn-edit {
  padding: 6px 12px;
  margin-right: 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.btn-view {
  background-color: #3498db;
  color: white;
}

.btn-view:hover {
  background-color: #2980b9;
}

.btn-edit {
  background-color: #f39c12;
  color: white;
}

.btn-edit:hover {
  background-color: #e67e22;
}
</style>
