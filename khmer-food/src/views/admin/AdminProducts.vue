<template>
  <div class="admin-inventory">

    <!-- ACTIONS -->
    <div class="actions">
      <div class="action-box add">
        <span>Add Item</span>
        <span class="icon">➕</span>
      </div>
      <div class="action-box update">
        <span>Update Item</span>
        <span class="icon">⚙️</span>
      </div>
      <div class="action-box alert">
        <span>Low Stock</span>
        <span class="icon">⚠️</span>
      </div>
    </div>

    <!-- INVENTORY TABLE -->
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Min Level</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>1</td>
            <td>Organic Tomato</td>
            <td>Vegetables</td>
            <td>$5.00</td>
            <td>45</td>
            <td>20</td>
            <td>
              <span class="badge success">In Stock</span>
            </td>
            <td>
              <button class="btn-edit">Edit</button>
              <button class="btn-delete">Delete</button>
            </td>
          </tr>

          <tr>
            <td>2</td>
            <td>Fresh Lettuce</td>
            <td>Vegetables</td>
            <td>$3.00</td>
            <td>8</td>
            <td>15</td>
            <td>
              <span class="badge warning">Low</span>
            </td>
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

<script setup lang="ts">
</script>

<style scoped>
.admin-inventory {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* ACTION BAR */
.actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 35px;
}

.action-box {
  padding: 20px 25px;
  color: white;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 6px;
  cursor: pointer;
  transition: 0.3s ease;
}

.action-box:hover {
  transform: translateY(-2px);
}

.action-box.add {
  background: linear-gradient(135deg, #53b400, #4a9a00);
}

.action-box.update {
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.action-box.alert {
  background: linear-gradient(135deg, #f39c12, #e67e22);
}

.icon {
  font-size: 26px;
}

/* TABLE */
.table-wrapper {
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
}

td {
  padding: 15px;
  border-bottom: 1px solid #e0e0e0;
}

tr:hover {
  background-color: #f9f9f9;
}

/* BUTTONS */
.btn-edit {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 6px;
}

.btn-edit:hover {
  background-color: #2980b9;
}

.btn-delete {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.btn-delete:hover {
  background-color: #c0392b;
}

/* BADGES */
.badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badge.success {
  background-color: #53b400;
  color: white;
}

.badge.warning {
  background-color: #f39c12;
  color: white;
}
</style>
