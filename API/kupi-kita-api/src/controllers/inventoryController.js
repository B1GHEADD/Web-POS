const db = require("../config/db");
const { getCabangFilter, getCabangId } = require("../utils/helpers");

const produksiMenu = async (req, res) => {
  const { nama_produk, jumlah_produksi } = req.body;
  const id_cabang = getCabangId(req);

  try {
    const [resep] = await db.query(`
      SELECT bb.id AS id_bahan_lokal, bb.nama_bahan, bb.stok_saat_ini, bb.satuan, r.jumlah_kebutuhan 
      FROM resep r 
      JOIN bahan_baku b_master ON r.id_bahan = b_master.id
      JOIN bahan_baku bb ON bb.nama_bahan = b_master.nama_bahan AND bb.id_cabang = ?
      JOIN produk p ON r.id_produk = p.id 
      WHERE p.nama_produk = ?`, [id_cabang, nama_produk]);

    if (resep.length === 0) return res.status(404).json({ error: "Resep tidak ditemukan di cabang ini!" });

    let bahanKurang = [];
    resep.forEach((item) => {
      const totalPakai = item.jumlah_kebutuhan * jumlah_produksi;
      if (item.stok_saat_ini < totalPakai) {
        bahanKurang.push(`${item.nama_bahan} (Kurang ${totalPakai - item.stok_saat_ini} ${item.satuan})`);
      }
    });

    if (bahanKurang.length > 0) {
      return res.status(400).json({ error: "Stok bahan baku tidak mencukupi!", detail: bahanKurang });
    }

    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      for (const item of resep) {
        const totalPakai = item.jumlah_kebutuhan * jumlah_produksi;
        await connection.query("UPDATE bahan_baku SET stok_saat_ini = stok_saat_ini - ? WHERE id = ?", [totalPakai, item.id_bahan_lokal]);
        
        const ket = `Produksi ${jumlah_produksi} cup ${nama_produk}`;
        await connection.query("INSERT INTO log_stok (id_cabang, nama_bahan, tipe_mutasi, jumlah, satuan, keterangan) VALUES (?, ?, 'KELUAR', ?, ?, ?)", 
          [id_cabang, item.nama_bahan, totalPakai, item.satuan, ket]);
      }

      await connection.query("UPDATE produk SET stok_saat_ini = stok_saat_ini + ? WHERE nama_produk = ?", [jumlah_produksi, nama_produk]);

      await connection.commit();
      res.json({ message: "Produksi selesai. Bahan baku terpotong dan riwayat tercatat." });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error produksi:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat produksi." });
  }
};

const restockBahan = async (req, res) => {
  const { nama_bahan, jumlah_masuk, satuan, harga_total, tanggal_expired } = req.body;
  const id_cabang = getCabangId(req);
  const hargaSatuanBaru = Math.round(harga_total / jumlah_masuk);

  try {
    const connection = await db.getConnection();
    await connection.beginTransaction();

    try {
      await connection.query("UPDATE bahan_baku SET stok_awal = stok_saat_ini + ?, stok_saat_ini = stok_saat_ini + ?, tgl_expired = ?, harga_satuan = ? WHERE nama_bahan = ? AND id_cabang = ?", 
        [jumlah_masuk, jumlah_masuk, tanggal_expired, hargaSatuanBaru, nama_bahan, id_cabang]);
      
      await connection.query("INSERT INTO log_stok (id_cabang, nama_bahan, tipe_mutasi, jumlah, satuan, keterangan) VALUES (?, ?, 'MASUK', ?, ?, 'Restock bahan baku')", 
        [id_cabang, nama_bahan, jumlah_masuk, satuan]);

      await connection.commit();
      res.json({ message: "Restock berhasil dan tercatat di riwayat." });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error restock:", error);
    res.status(500).json({ error: "Terjadi kesalahan saat restock." });
  }
};

module.exports = {
  produksiMenu,
  restockBahan
};
