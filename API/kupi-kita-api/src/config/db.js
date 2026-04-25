const mysql = require("mysql2/promise");
require("dotenv").config();

const dbPool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "kupi-kita",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test koneksi saat inisialisasi
dbPool.getConnection()
  .then((conn) => {
    console.log("✅ Berhasil terhubung ke database MySQL (Pool Connection)!");
    conn.release();
  })
  .catch((err) => {
    console.error("❌ Koneksi database gagal:", err.message);
  });

module.exports = dbPool;
