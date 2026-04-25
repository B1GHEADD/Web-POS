const db = require("../config/db");
const { getCabangFilter, getCabangId } = require("../utils/helpers");

const getBoxRider = async (req, res) => {
  const { nama_rider, tanggal } = req.query;
  const id_cabang = getCabangId(req);

  try {
    const [results] = await db.query(
      "SELECT nama_produk, stok_bawa, terjual FROM stok_rider WHERE nama_rider = ? AND tanggal = ? AND id_cabang = ?",
      [nama_rider, tanggal, id_cabang]
    );
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const ambilKulkas = async (req, res) => {
  const { nama_rider, tanggal, nama_produk, jumlah_diambil } = req.body;
  const id_cabang = getCabangId(req);

  try {
    const [results] = await db.query("SELECT stok_saat_ini FROM produk WHERE nama_produk = ?", [nama_produk]);
    if (results.length === 0) return res.status(404).json({ error: "Produk tidak ditemukan." });

    const stokKulkas = results[0].stok_saat_ini;
    if (stokKulkas < jumlah_diambil) {
      return res.status(400).json({ error: `Stok Kulkas kurang! Hanya sisa ${stokKulkas} cup.` });
    }

    // Gunakan transaction untuk keamanan data
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      await connection.query("UPDATE produk SET stok_saat_ini = stok_saat_ini - ? WHERE nama_produk = ?", [jumlah_diambil, nama_produk]);
      
      const queryIsiBox = `
        INSERT INTO stok_rider (id_cabang, tanggal, nama_rider, nama_produk, stok_bawa) 
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE stok_bawa = stok_bawa + ?
      `;
      await connection.query(queryIsiBox, [id_cabang, tanggal, nama_rider, nama_produk, jumlah_diambil, jumlah_diambil]);

      await connection.commit();
      res.json({ message: "Berhasil memindahkan barang dari kulkas ke box Rider." });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error ambil kulkas:", error);
    res.status(500).json({ error: "Gagal memproses stok." });
  }
};

const kembalikanStok = async (req, res) => {
  const { nama_rider, tanggal, nama_produk, jumlah_dikembalikan } = req.body;
  const id_cabang = getCabangId(req);

  try {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      await connection.query("UPDATE produk SET stok_saat_ini = stok_saat_ini + ? WHERE nama_produk = ?", [jumlah_dikembalikan, nama_produk]);
      await connection.query("UPDATE stok_rider SET stok_bawa = stok_bawa - ? WHERE nama_rider = ? AND tanggal = ? AND nama_produk = ? AND id_cabang = ?", 
        [jumlah_dikembalikan, nama_rider, tanggal, nama_produk, id_cabang]);
      
      await connection.commit();
      res.json({ message: "Berhasil mengembalikan sisa stok ke kulkas." });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error kembalikan stok:", error);
    res.status(500).json({ error: "Gagal mengembalikan stok." });
  }
};

const catatLaku = async (req, res) => {
  const { nama_rider, tanggal, nama_produk, terjual } = req.body;
  const id_cabang = getCabangId(req);

  try {
    const [results] = await db.query(`
      SELECT p.harga_jual, sr.stok_bawa 
      FROM stok_rider sr
      JOIN produk p ON sr.nama_produk = p.nama_produk
      WHERE sr.nama_rider = ? AND sr.tanggal = ? AND sr.nama_produk = ? AND sr.id_cabang = ?
    `, [nama_rider, tanggal, nama_produk, id_cabang]);

    if (results.length === 0) return res.status(404).json({ error: "Barang tidak ada di Box Rider!" });

    const boxRider = results[0];
    if (boxRider.stok_bawa < terjual) {
      return res.status(400).json({ error: `Gagal! Sisa ${nama_produk} di box hanya ${boxRider.stok_bawa} cup.` });
    }

    const total_pendapatan = terjual * boxRider.harga_jual;

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      await connection.query("UPDATE stok_rider SET stok_bawa = stok_bawa - ?, terjual = terjual + ? WHERE nama_rider = ? AND tanggal = ? AND nama_produk = ? AND id_cabang = ?", 
        [terjual, terjual, nama_rider, tanggal, nama_produk, id_cabang]);
      
      const queryLog = "INSERT INTO log_penjualan (id_cabang, tanggal, nama_rider, nama_produk, terjual, total_pendapatan) VALUES (?, ?, ?, ?, ?, ?)";
      await connection.query(queryLog, [id_cabang, tanggal, nama_rider, nama_produk, terjual, total_pendapatan]);

      await connection.commit();
      res.json({ message: "Berhasil! Transaksi tersimpan." });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error catat laku:", error);
    res.status(500).json({ error: "Gagal mencatat transaksi." });
  }
};

module.exports = {
  getBoxRider,
  ambilKulkas,
  kembalikanStok,
  catatLaku
};
