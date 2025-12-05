<template>
  <div class="dashboard-container">
    <!-- LEFT SIDEBAR -->
    <aside class="sidebar">
      <div class="welcome-box">
        <h1 class="welcome-title">Welcome to</h1>
        <h2 class="welcome-subtitle">Admin Dash broad</h2>
      </div>

      <nav class="menu">
        <div class="menu-item active">Products</div>
        <div class="menu-item">Stocks</div>
        <div class="menu-item">Orders</div>
        <div class="menu-item">Sales</div>
        <div class="menu-item">Info User</div>
      </nav>
    </aside>

    <!-- RIGHT CONTENT -->
    <section class="content">
      <div class="top-bar">
        <h1>Dash Broad</h1>
        <div class="search-bar">
          <input type="text" placeholder="Search" />
          <i class="fa-solid fa-magnifying-glass"></i>
        </div>
        <!-- <div class="user-info">User <img src="/images/user.png" /></div> -->
      </div>

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
    </section>
  </div>
</template>

<style scoped>
.dashboard-container {
  display: flex;
  min-height: 100vh;
  width: 100%;
  background: #e6e6e6;
  overflow-x: hidden;
  font-family: 'Baloo Tamma 2', sans-serif;
}

/* Sidebar */
.sidebar {
  width: 28%;
  background: #53b400;
  padding: 40px 20px;
  color: white;
}

.welcome-title {
  font-size: 32px;
  margin: 0;
}

.welcome-subtitle {
  font-size: 36px;
  margin: 0;
  font-weight: bold;
}

.menu {
  margin-top: 40px;
}

.menu-item {
  padding: 18px 0;
  text-align: center;
  font-size: 24px;
  cursor: pointer;
  color: white;
}

.menu-item.active {
  background: white;
  color: #53b400;
  border-radius: 5px;
}

/* Content */
.content {
  width: 72%;
  padding: 40px;
}

.top-bar {
  display: flex;
  align-items: center;
  gap: 20px;
  background: #b6db7b;
  padding: 15px 20px;
  border-radius: 4px;
}

.top-bar h1 {
  margin: 0;
}

.search-bar {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-bar input {
  padding: 8px 15px;
  border: none;
  border-radius: 20px;
}

.actions {
  margin-top: 40px;
}

.action-box {
  background: white;
  padding: 18px 25px;
  margin-bottom: 20px;
  font-size: 20px;
  color: #53b400;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
}

.action-box .icon {
  font-size: 26px;
}
</style>
