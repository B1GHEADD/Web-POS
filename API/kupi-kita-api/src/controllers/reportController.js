const db = require("../config/db");
const { getCabangFilter } = require("../utils/helpers");

const getGrafik = async (req, res) => {
  const filter = getCabangFilter(req);
  try {
    const [results] = await db.query(`
      SELECT MONTH(tanggal) AS bulan, nama_bahan, SUM(jumlah) AS total 
      FROM log_stok 
      WHERE tipe_mutasi = 'KELUAR' AND YEAR(tanggal) = YEAR(CURDATE()) ${filter}
      GROUP BY MONTH(tanggal), nama_bahan
    `);

    const bahanMap = {};
    results.forEach((row) => {
      if (!bahanMap[row.nama_bahan]) bahanMap[row.nama_bahan] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      bahanMap[row.nama_bahan][row.bulan - 1] = row.total;
    });

    const datasetsChartJs = Object.keys(bahanMap).map((namaBahan) => {
      return { label: namaBahan, data: bahanMap[namaBahan] };
    });

    res.json(datasetsChartJs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTopMenu = async (req, res) => {
  const filter = getCabangFilter(req);
  try {
    const [results] = await db.query(`
      SELECT nama_produk, SUM(terjual) AS jumlah 
      FROM log_penjualan 
      WHERE YEAR(tanggal) = YEAR(CURDATE()) ${filter}
      GROUP BY nama_produk ORDER BY jumlah DESC LIMIT 3
    `);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLaporanProduksi = async (req, res) => {
  const filter = getCabangFilter(req);
  try {
    const [results] = await db.query(`SELECT id, id_cabang, nama_bahan, stok_awal, stok_saat_ini, satuan, harga_satuan, tgl_expired FROM bahan_baku WHERE 1=1 ${filter} ORDER BY tgl_expired ASC`);
    
    const hariIni = new Date();
    const dataDenganStatus = results.map((bahan) => {
      let status = "Stok Aman";
      const tglExpired = new Date(bahan.tgl_expired);
      const selisihWaktu = tglExpired - hariIni;
      const selisihHari = Math.ceil(selisihWaktu / (1000 * 60 * 60 * 24));
      let persentaseSisa = bahan.stok_awal > 0 ? (bahan.stok_saat_ini / bahan.stok_awal) * 100 : 0;

      if (selisihHari <= 60 && selisihHari > 0) status = "Hampir Expired";
      else if (selisihHari <= 0) status = "Sudah Expired";
      else if (persentaseSisa < 30) status = "Stok Hampir Habis";
      else if (persentaseSisa >= 30 && persentaseSisa <= 70) status = "Stok Masih Ada";

      return {
        ...bahan,
        status: status,
        tgl_format: tglExpired.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
      };
    });
    res.json(dataDenganStatus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSummaryPenjualan = async (req, res) => {
  const filter = getCabangFilter(req);
  try {
    const [results] = await db.query(`
      SELECT 
        COALESCE(SUM(total_pendapatan), 0) AS totalPendapatan,
        COALESCE(SUM(terjual), 0) AS totalCup,
        (SELECT nama_produk FROM log_penjualan WHERE MONTH(tanggal) = MONTH(CURDATE()) AND YEAR(tanggal) = YEAR(CURDATE()) ${filter} GROUP BY nama_produk ORDER BY SUM(terjual) DESC LIMIT 1) AS menuJuara
      FROM log_penjualan WHERE MONTH(tanggal) = MONTH(CURDATE()) AND YEAR(tanggal) = YEAR(CURDATE()) ${filter}
    `);
    const data = results[0];
    res.json({
      totalPendapatan: data.totalPendapatan,
      totalCup: data.totalCup,
      menuJuara: data.menuJuara || "Belum ada data",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getLeaderboard = async (req, res) => {
  const filter = getCabangFilter(req);
  try {
    const [results] = await db.query(`
      SELECT nama_rider, SUM(total_pendapatan) AS pendapatan, SUM(terjual) AS terjual
      FROM log_penjualan WHERE MONTH(tanggal) = MONTH(CURDATE()) AND YEAR(tanggal) = YEAR(CURDATE()) ${filter}
      GROUP BY nama_rider ORDER BY pendapatan DESC LIMIT 5
    `);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getGrafikPenjualan = async (req, res) => {
  const filter = getCabangFilter(req);
  try {
    const [results] = await db.query(`
      SELECT DATE_FORMAT(tanggal, '%d %b') AS label_tanggal, SUM(total_pendapatan) AS pendapatan_harian
      FROM log_penjualan WHERE MONTH(tanggal) = MONTH(CURDATE()) AND YEAR(tanggal) = YEAR(CURDATE()) ${filter}
      GROUP BY DATE(tanggal) ORDER BY DATE(tanggal) ASC
    `);
    const labels = results.map((row) => row.label_tanggal);
    const pendapatan = results.map((row) => row.pendapatan_harian);
    res.json({ labels, pendapatan });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRiwayatPenjualan = async (req, res) => {
  const filter = getCabangFilter(req);
  try {
    const [results] = await db.query(`
      SELECT 
        DATE_FORMAT(tanggal, '%d-%m-%Y') AS waktu_format, 
        nama_rider, 
        nama_produk, 
        SUM(terjual) AS terjual, 
        SUM(total_pendapatan) AS total_pendapatan
      FROM log_penjualan 
      WHERE terjual > 0 ${filter}
      GROUP BY tanggal, nama_rider, nama_produk
      ORDER BY tanggal DESC, nama_rider ASC 
      LIMIT 50
    `);
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getGrafik,
  getTopMenu,
  getLaporanProduksi,
  getSummaryPenjualan,
  getLeaderboard,
  getGrafikPenjualan,
  getRiwayatPenjualan
};
