const db = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const [users] = await db.query(
      "SELECT id, id_cabang, username, password, role, nama_lengkap FROM users WHERE username = ?",
      [username]
    );

    if (users.length === 0) {
      return res.status(401).json({ success: false, error: "Username atau Password salah!" });
    }

    const user = users[0];
    let isMatch = false;

    // Cek apakah password sudah di-hash (bcrypt hash biasanya 60 karakter)
    if (user.password.length === 60 && user.password.startsWith("$2b$")) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      // Jika masih plaintext (karena migrasi sistem lama)
      if (password === user.password) {
        isMatch = true;
        // Opsional: Hash ulang password ke database agar next login sudah aman
        const hashedPw = await bcrypt.hash(password, 10);
        await db.query("UPDATE users SET password = ? WHERE id = ?", [hashedPw, user.id]);
        console.log(`[Migrasi] Password user ${username} berhasil di-hash.`);
      }
    }

    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Username atau Password salah!" });
    }

    // Buat JWT Token
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
      id_cabang: user.id_cabang,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "12h" });

    // Jangan kirim password ke frontend
    delete user.password;

    res.json({
      success: true,
      token,
      user
    });

  } catch (error) {
    console.error("❌ ERROR LOGIN:", error);
    res.status(500).json({ error: "Terjadi kesalahan server saat login." });
  }
};

module.exports = {
  login
};
