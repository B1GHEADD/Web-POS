const db = require("../config/db");
const { getCabangFilter } = require("../utils/helpers");

const getKpi = async (req, res) => {
  const filter = getCabangFilter(req);
  try {
    const [[omsetRes]] = await db.query(`SELECT SUM(total_pendapatan) as omset, SUM(terjual) as laku FROM log_penjualan WHERE DATE(tanggal) = CURDATE() ${filter}`);
    const [[stokRes]] = await db.query(`SELECT SUM(stok_saat_ini) as stok_kulkas FROM produk`); // Produk sifatnya global
    const [[riderRes]] = await db.query(`SELECT COUNT(DISTINCT nama_rider) as rider_aktif FROM stok_rider WHERE DATE(tanggal) = CURDATE() ${filter}`);

    res.json({
      omset: omsetRes.omset || 0,
      terjual: omsetRes.laku || 0,
      stokKulkas: stokRes.stok_kulkas || 0,
      riderAktif: riderRes.rider_aktif || 0,
    });
  } catch (error) {
    console.error("KPI Error:", error);
    res.status(500).json({ error: "Gagal ambil KPI" });
  }
};

const getStokKritis = async (req, res) => {
  const filter = getCabangFilter(req);
  try {
    const [results] = await db.query(`SELECT nama_bahan, stok_saat_ini, satuan FROM bahan_baku WHERE stok_saat_ini < 2000 ${filter} ORDER BY stok_saat_ini ASC LIMIT 5`);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getExpired = async (req, res) => {
  const filter = getCabangFilter(req);
  try {
    const [results] = await db.query(`
      SELECT nama_bahan, tgl_expired, DATEDIFF(tgl_expired, CURDATE()) as sisa_hari 
      FROM bahan_baku 
      WHERE DATEDIFF(tgl_expired, CURDATE()) <= 30 AND DATEDIFF(tgl_expired, CURDATE()) >= 0 ${filter}
      ORDER BY sisa_hari ASC LIMIT 5
    `);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLiveRider = async (req, res) => {
  const filter = getCabangFilter(req);
  try {
    const [results] = await db.query(`
      SELECT nama_rider, nama_produk, (stok_bawa + terjual) AS stok_bawa, terjual, stok_bawa AS sisa 
      FROM stok_rider 
      WHERE DATE(tanggal) = CURDATE() AND (stok_bawa > 0 OR terjual > 0) ${filter}
      ORDER BY nama_rider ASC
    `);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGrafikTren = async (req, res) => {
  const filter = getCabangFilter(req);
  try {
    const [results] = await db.query(`
      SELECT DATE_FORMAT(tanggal, '%d %b') AS tanggal_format, SUM(total_pendapatan) AS omset 
      FROM log_penjualan 
      WHERE tanggal >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) ${filter}
      GROUP BY tanggal
      ORDER BY tanggal ASC
    `);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getKpi,
  getStokKritis,
  getExpired,
  getLiveRider,
  getGrafikTren
};
