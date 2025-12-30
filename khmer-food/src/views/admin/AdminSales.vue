<template>
  <div class="admin-sales">
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-content">
          <h3>Total Sales</h3>
          <p class="stat-value">$12,500.00</p>
          <span class="stat-change positive">+12% from last month</span>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <h3>Orders Count</h3>
          <p class="stat-value">156</p>
          <span class="stat-change positive">+8% from last month</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">💵</div>
        <div class="stat-content">
          <h3>Avg Order Value</h3>
          <p class="stat-value">$80.13</p>
          <span class="stat-change positive">+3% from last month</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🎯</div>
        <div class="stat-content">
          <h3>Conversion Rate</h3>
          <p class="stat-value">3.2%</p>
          <span class="stat-change negative">-0.5% from last month</span>
        </div>
      </div>
    </div>

    <!-- Sales by Category -->
    <div class="sales-section">
      <h2>Sales by Category</h2>
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Units Sold</th>
            <th>Revenue</th>
            <th>Percentage</th>
            <th>Trend</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Vegetables</td>
            <td>245</td>
            <td>$3,675.00</td>
            <td>29%</td>
            <td><span class="trend up">↑ 15%</span></td>
          </tr>
          <tr>
            <td>Meats</td>
            <td>189</td>
            <td>$5,670.00</td>
            <td>45%</td>
            <td><span class="trend up">↑ 22%</span></td>
          </tr>
          <tr>
            <td>Sets</td>
            <td>92</td>
            <td>$3,155.00</td>
            <td>26%</td>
            <td><span class="trend down">↓ 5%</span></td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Top Products -->
    <div class="sales-section">
      <h2>Top Products</h2>
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Units Sold</th>
            <th>Revenue</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Organic Tomato</td>
            <td>85</td>
            <td>$425.00</td>
            <td>⭐⭐⭐⭐⭐</td>
          </tr>
          <tr>
            <td>Premium Beef</td>
            <td>56</td>
            <td>$1,680.00</td>
            <td>⭐⭐⭐⭐⭐</td>
          </tr>
          <tr>
            <td>Cambodian Set</td>
            <td>42</td>
            <td>$1,470.00</td>
            <td>⭐⭐⭐⭐</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.admin-sales {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
  padding: 25px;
  border-radius: 8px;
  display: flex;
  gap: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 40px;
}

.stat-content {
  flex: 1;
}

.stat-content h3 {
  margin: 0 0 10px 0;
  color: #2c3e50;
  font-size: 14px;
  text-transform: uppercase;
  font-weight: 600;
}

.stat-value {
  margin: 0 0 8px 0;
  color: #53b400;
  font-size: 28px;
  font-weight: bold;
}

.stat-change {
  font-size: 12px;
  font-weight: 600;
}

.stat-change.positive {
  color: #27ae60;
}

.stat-change.negative {
  color: #e74c3c;
}

.sales-section {
  margin-bottom: 40px;
}

.sales-section h2 {
  margin: 0 0 20px 0;
  color: #2c3e50;
  font-size: 20px;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 15px;
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

.trend {
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 12px;
}

.trend.up {
  background-color: #d4edda;
  color: #155724;
}

.trend.down {
  background-color: #f8d7da;
  color: #721c24;
}
</style>
