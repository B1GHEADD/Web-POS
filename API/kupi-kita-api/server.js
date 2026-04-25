require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const authRoutes = require("./src/routes/authRoutes");
const dashboardRoutes = require("./src/routes/dashboardRoutes");
const riderRoutes = require("./src/routes/riderRoutes");
const inventoryRoutes = require("./src/routes/inventoryRoutes");
const reportRoutes = require("./src/routes/reportRoutes");
const listRoutes = require("./src/routes/listRoutes");

// Register Routes
app.use("/", authRoutes); // /login
app.use("/dashboard", dashboardRoutes);
app.use("/rider", riderRoutes);
app.use("/", inventoryRoutes); // /produksi-menu, /restock-bahan
app.use("/", reportRoutes); // /laporan, /laporan-penjualan
app.use("/", listRoutes); // /list-*, /riwayat-hari-ini

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server Kupi Kita (MVC) berjalan di http://localhost:${PORT}`);
});
