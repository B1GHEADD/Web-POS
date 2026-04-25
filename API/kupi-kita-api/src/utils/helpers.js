const db = require("../config/db");

// ==========================================
// FUNGSI BANTUAN (SATPAM CABANG)
// ==========================================
const getCabangFilter = (req) => {
  // Dalam MVC baru, kita prioritas ambil dari token (req.user) jika memungkinkan
  // Tapi untuk sementara kita tetap mendukung request body/query
  const id = req.user?.id_cabang || req.query.id_cabang || req.body.id_cabang;
  
  if (id && id !== "null" && id !== "undefined" && id !== "") {
    // Escape string manually or use parameterized queries in controllers
    // For raw SQL parts, we should be careful. 
    // Since we use mysql2/promise, it's better to return the ID and handle it in the controller.
    // However, to keep it simple and compatible with existing logic:
    return ` AND id_cabang = ${db.escape(id)} `;
  }
  return "";
};

const getCabangId = (req) => {
  const id = req.user?.id_cabang || req.query.id_cabang || req.body.id_cabang;
  return id && id !== "null" && id !== "undefined" && id !== "" ? id : 1;
};

module.exports = {
  getCabangFilter,
  getCabangId
};
