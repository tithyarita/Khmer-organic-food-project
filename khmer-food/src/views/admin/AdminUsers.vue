<template>
  <div class="admin-users">
    <div class="actions">
      <div class="action-box">
        <span>Add User</span>
        <span class="icon">➕</span>
      </div>
      <div class="action-box">
        <span>Active Users</span>
        <span class="icon">✅</span>
      </div>
      <div class="action-box">
        <span>Export Users</span>
        <span class="icon">📥</span>
      </div>
    </div>

    <!-- Users Table -->
    <div class="users-table">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Status</th>
            <th>Joined Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>#U001</td>
            <td>John Doe</td>
            <td>john@example.com</td>
            <td>+855 12 345 678</td>
            <td><span class="role admin">Admin</span></td>
            <td><span class="badge badge-active">Active</span></td>
            <td>2024-01-15</td>
            <td>
              <button class="btn-view">View</button>
              <button class="btn-edit">Edit</button>
            </td>
          </tr>
          <tr>
            <td>#U002</td>
            <td>Jane Smith</td>
            <td>jane@example.com</td>
            <td>+855 98 765 432</td>
            <td><span class="role customer">Customer</span></td>
            <td><span class="badge badge-active">Active</span></td>
            <td>2024-03-20</td>
            <td>
              <button class="btn-view">View</button>
              <button class="btn-edit">Edit</button>
            </td>
          </tr>
          <tr>
            <td>#U003</td>
            <td>Robert Johnson</td>
            <td>robert@example.com</td>
            <td>+855 87 654 321</td>
            <td><span class="role manager">Manager</span></td>
            <td><span class="badge badge-active">Active</span></td>
            <td>2024-05-10</td>
            <td>
              <button class="btn-view">View</button>
              <button class="btn-edit">Edit</button>
            </td>
          </tr>
          <tr>
            <td>#U004</td>
            <td>Emily Brown</td>
            <td>emily@example.com</td>
            <td>+855 76 543 210</td>
            <td><span class="role customer">Customer</span></td>
            <td><span class="badge badge-inactive">Inactive</span></td>
            <td>2024-06-12</td>
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
.admin-users {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 25px;
}

.actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.action-box {
  background: linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%);
  padding: 20px 25px;
  color: white;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(155, 89, 182, 0.2);
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-box:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(155, 89, 182, 0.3);
}

.action-box .icon {
  font-size: 26px;
}

.users-table {
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

.role {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.role.admin {
  background-color: #ffe5e5;
  color: #c0392b;
}

.role.manager {
  background-color: #fff4e5;
  color: #d68910;
}

.role.customer {
  background-color: #e5f5ff;
  color: #0984e3;
}

.badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.badge-active {
  background-color: #d4edda;
  color: #155724;
}

.badge-inactive {
  background-color: #f8d7da;
  color: #721c24;
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
  background-color: #9b59b6;
  color: white;
}

.btn-edit:hover {
  background-color: #8e44ad;
}
</style>
