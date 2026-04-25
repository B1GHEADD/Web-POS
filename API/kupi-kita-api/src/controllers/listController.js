const db = require("../config/db");
const { getCabangFilter } = require("../utils/helpers");

const getListRider = async (req, res) => {
  const filter = getCabangFilter(req);
  try {
    const [results] = await db.query(`SELECT nama_lengkap AS nama_rider FROM users WHERE role = 'rider' ${filter}`);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getListMenuProduksi = async (req, res) => {
  try {
    const [results] = await db.query("SELECT nama_produk FROM produk ORDER BY nama_produk ASC");
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getListProdukTersedia = async (req, res) => {
  try {
    const [results] = await db.query("SELECT nama_produk, stok_saat_ini FROM produk LIMIT 10");
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getListBahanBaku = async (req, res) => {
  const filter = getCabangFilter(req);
  try {
    const [results] = await db.query(`SELECT nama_bahan FROM bahan_baku WHERE 1=1 ${filter} ORDER BY nama_bahan ASC`);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRiwayatHariIni = async (req, res) => {
  const filter = getCabangFilter(req);
  try {
    const [results] = await db.query(`
      SELECT nama_rider AS rider, nama_produk AS produk, terjual 
      FROM log_penjualan 
      WHERE DATE(waktu_input) = CURDATE() ${filter}
      ORDER BY id DESC 
      LIMIT 10
    `);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getListRider,
  getListMenuProduksi,
  getListProdukTersedia,
  getListBahanBaku,
  getRiwayatHariIni
};
