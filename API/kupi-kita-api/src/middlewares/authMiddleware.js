const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  // Ambil token dari header (Format: Bearer <token>)
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Akses ditolak. Token tidak ditemukan." });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Simpan data user ke dalam object request agar bisa diakses controller
    req.user = decoded;
    
    next();
  } catch (error) {
    console.error("❌ JWT Verification Error:", error.message);
    return res.status(401).json({ error: "Token tidak valid atau sudah kadaluarsa." });
  }
};

module.exports = { requireAuth };
