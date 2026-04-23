const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "kupi-kita",
});

db.connect((err) => {
  if (err) {
    console.error("Koneksi database gagal:", err.message);
    return;
  }
  console.log("Berhasil terhubung ke database MySQL (Multi-Cabang Mode)!");
});

// ==========================================
// FUNGSI BANTUAN (SATPAM CABANG)
// ==========================================
const getCabangFilter = (req) => {
  const id = req.query.id_cabang || req.body.id_cabang;
  if (id && id !== "null" && id !== "undefined") {
    return ` AND id_cabang = ${db.escape(id)} `;
  }
  return "";
};

const getCabangId = (req) => {
  const id = req.query.id_cabang || req.body.id_cabang;
  return id && id !== "null" && id !== "undefined" ? id : 1;
};

// ==========================================
// API LOGIN
// ==========================================
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const query =
    "SELECT id, id_cabang, username, role, nama_lengkap FROM users WHERE username = ? AND password = ?";

  db.query(query, [username, password], (err, results) => {
    if (err)
      return res.status(500).json({ error: "Terjadi kesalahan server." });

    if (results.length > 0) {
      res.json({ success: true, user: results[0] });
    } else {
      res
        .status(401)
        .json({ success: false, error: "Username atau Password salah!" });
    }
  });
});

// ==========================================
// API DASHBOARD
// ==========================================
app.get("/dashboard/kpi", (req, res) => {
  const filter = getCabangFilter(req);
  const queryOmsetLaku = `SELECT SUM(total_pendapatan) as omset, SUM(terjual) as laku FROM log_penjualan WHERE DATE(tanggal) = CURDATE() ${filter}`;
  const queryStokKulkas = `SELECT SUM(stok_saat_ini) as stok_kulkas FROM produk`; // Produk sifatnya global
  const queryRiderAktif = `SELECT COUNT(DISTINCT nama_rider) as rider_aktif FROM stok_rider WHERE DATE(tanggal) = CURDATE() ${filter}`;

  db.query(queryOmsetLaku, (err1, res1) => {
    db.query(queryStokKulkas, (err2, res2) => {
      db.query(queryRiderAktif, (err3, res3) => {
        if (err1 || err2 || err3)
          return res.status(500).json({ error: "Gagal ambil KPI" });
        res.json({
          omset: res1[0].omset || 0,
          terjual: res1[0].laku || 0,
          stokKulkas: res2[0].stok_kulkas || 0,
          riderAktif: res3[0].rider_aktif || 0,
        });
      });
    });
  });
});

app.get("/dashboard/stok-kritis", (req, res) => {
  const filter = getCabangFilter(req);
  const query = `SELECT nama_bahan, stok_saat_ini, satuan FROM bahan_baku WHERE stok_saat_ini < 2000 ${filter} ORDER BY stok_saat_ini ASC LIMIT 5`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/dashboard/expired", (req, res) => {
  const filter = getCabangFilter(req);
  const query = `
    SELECT nama_bahan, tgl_expired, DATEDIFF(tgl_expired, CURDATE()) as sisa_hari 
    FROM bahan_baku 
    WHERE DATEDIFF(tgl_expired, CURDATE()) <= 30 AND DATEDIFF(tgl_expired, CURDATE()) >= 0 ${filter}
    ORDER BY sisa_hari ASC LIMIT 5
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/dashboard/live-rider", (req, res) => {
  const filter = getCabangFilter(req);
  const query = `
    SELECT nama_rider, nama_produk, (stok_bawa + terjual) AS stok_bawa, terjual, stok_bawa AS sisa 
    FROM stok_rider 
    WHERE DATE(tanggal) = CURDATE() AND (stok_bawa > 0 OR terjual > 0) ${filter}
    ORDER BY nama_rider ASC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/dashboard/grafik-tren", (req, res) => {
  const filter = getCabangFilter(req);
  const query = `
    SELECT DATE_FORMAT(tanggal, '%d %b') AS tanggal_format, SUM(total_pendapatan) AS omset 
    FROM log_penjualan 
    WHERE tanggal >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) ${filter}
    GROUP BY tanggal
    ORDER BY tanggal ASC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ==========================================
// API LIST DROPDOWN
// ==========================================
app.get("/list-rider", (req, res) => {
  const filter = getCabangFilter(req);
  const query = `SELECT nama_lengkap AS nama_rider FROM users WHERE role = 'rider' ${filter}`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/list-menu-produksi", (req, res) => {
  const query = "SELECT nama_produk FROM produk ORDER BY nama_produk ASC";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/list-produk-tersedia", (req, res) => {
  // Global, kulkas tidak terikat id_cabang secara spesifik jika sistemnya terpusat dari satu tempat kulkas
  const query = "SELECT nama_produk, stok_saat_ini FROM produk LIMIT 10";
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/list-bahan-baku", (req, res) => {
  const filter = getCabangFilter(req);
  const query = `SELECT nama_bahan FROM bahan_baku WHERE 1=1 ${filter} ORDER BY nama_bahan ASC`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ==========================================
// API TRANSAKSI RIDER POS (SUDAH DIKEMBALIKAN)
// ==========================================

// 1. Ambil data isi Box Rider
app.get("/rider/box", (req, res) => {
  const { nama_rider, tanggal, id_cabang } = req.query;
  const cabangId = id_cabang && id_cabang !== "null" ? id_cabang : 1;

  const query =
    "SELECT nama_produk, stok_bawa, terjual FROM stok_rider WHERE nama_rider = ? AND tanggal = ? AND id_cabang = ?";

  db.query(query, [nama_rider, tanggal, cabangId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 2. Rider ambil Kopi dari Kulkas ke Box/Tas
app.post("/rider/ambil-kulkas", (req, res) => {
  const { nama_rider, tanggal, nama_produk, jumlah_diambil, id_cabang } =
    req.body;
  const cabangId = id_cabang && id_cabang !== "null" ? id_cabang : 1;

  const queryCekKulkas =
    "SELECT stok_saat_ini FROM produk WHERE nama_produk = ?";
  db.query(queryCekKulkas, [nama_produk], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ error: "Produk tidak ditemukan." });

    const stokKulkas = results[0].stok_saat_ini;
    if (stokKulkas < jumlah_diambil) {
      return res
        .status(400)
        .json({ error: `Stok Kulkas kurang! Hanya sisa ${stokKulkas} cup.` });
    }

    const queryPotongKulkas =
      "UPDATE produk SET stok_saat_ini = stok_saat_ini - ? WHERE nama_produk = ?";
    db.query(queryPotongKulkas, [jumlah_diambil, nama_produk], (err) => {
      if (err)
        return res.status(500).json({ error: "Gagal memotong stok kulkas." });

      const queryIsiBox = `
        INSERT INTO stok_rider (id_cabang, tanggal, nama_rider, nama_produk, stok_bawa) 
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE stok_bawa = stok_bawa + ?
      `;
      db.query(
        queryIsiBox,
        [
          cabangId,
          tanggal,
          nama_rider,
          nama_produk,
          jumlah_diambil,
          jumlah_diambil,
        ],
        (err) => {
          if (err)
            return res
              .status(500)
              .json({ error: "Gagal memindahkan ke box rider." });
          res.json({
            message: "Berhasil memindahkan barang dari kulkas ke box Rider.",
          });
        },
      );
    });
  });
});

// 3. Rider kembalikan sisa Kopi ke Kulkas
app.post("/rider/kembalikan-stok", (req, res) => {
  const { nama_rider, tanggal, nama_produk, jumlah_dikembalikan, id_cabang } =
    req.body;
  const cabangId = id_cabang && id_cabang !== "null" ? id_cabang : 1;

  const queryTambahKulkas =
    "UPDATE produk SET stok_saat_ini = stok_saat_ini + ? WHERE nama_produk = ?";
  db.query(queryTambahKulkas, [jumlah_dikembalikan, nama_produk], (err) => {
    if (err)
      return res.status(500).json({ error: "Gagal menambah stok kulkas." });

    const queryPotongBox =
      "UPDATE stok_rider SET stok_bawa = stok_bawa - ? WHERE nama_rider = ? AND tanggal = ? AND nama_produk = ? AND id_cabang = ?";
    db.query(
      queryPotongBox,
      [jumlah_dikembalikan, nama_rider, tanggal, nama_produk, cabangId],
      (err) => {
        if (err)
          return res
            .status(500)
            .json({ error: "Gagal memotong stok box rider." });
        res.json({ message: "Berhasil mengembalikan sisa stok ke kulkas." });
      },
    );
  });
});

// 4. Rider Setor Penjualan (Catat Laku)
app.post("/rider/catat-laku", (req, res) => {
  const { nama_rider, tanggal, nama_produk, terjual, id_cabang } = req.body;
  const cabangId = id_cabang && id_cabang !== "null" ? id_cabang : 1;

  const queryCekBox = `
    SELECT p.harga_jual, sr.stok_bawa 
    FROM stok_rider sr
    JOIN produk p ON sr.nama_produk = p.nama_produk
    WHERE sr.nama_rider = ? AND sr.tanggal = ? AND sr.nama_produk = ? AND sr.id_cabang = ?
  `;

  db.query(
    queryCekBox,
    [nama_rider, tanggal, nama_produk, cabangId],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0)
        return res
          .status(404)
          .json({ error: "Barang tidak ada di Box Rider!" });

      const boxRider = results[0];
      if (boxRider.stok_bawa < terjual) {
        return res.status(400).json({
          error: `Gagal! Sisa ${nama_produk} di box hanya ${boxRider.stok_bawa} cup.`,
        });
      }

      const total_pendapatan = terjual * boxRider.harga_jual;

      const queryPotongBox =
        "UPDATE stok_rider SET stok_bawa = stok_bawa - ?, terjual = terjual + ? WHERE nama_rider = ? AND tanggal = ? AND nama_produk = ? AND id_cabang = ?";
      db.query(
        queryPotongBox,
        [terjual, terjual, nama_rider, tanggal, nama_produk, cabangId],
        (err) => {
          if (err)
            return res
              .status(500)
              .json({ error: "Gagal memotong stok box rider." });

          const queryLog =
            "INSERT INTO log_penjualan (id_cabang, tanggal, nama_rider, nama_produk, terjual, total_pendapatan) VALUES (?, ?, ?, ?, ?, ?)";
          db.query(
            queryLog,
            [
              cabangId,
              tanggal,
              nama_rider,
              nama_produk,
              terjual,
              total_pendapatan,
            ],
            (err) => {
              if (err)
                return res
                  .status(500)
                  .json({ error: "Gagal mencatat transaksi." });
              res.json({ message: `Berhasil! Transaksi tersimpan.` });
            },
          );
        },
      );
    },
  );
});

app.get("/riwayat-hari-ini", (req, res) => {
  const filter = getCabangFilter(req);
  const query = `
    SELECT nama_rider AS rider, nama_produk AS produk, terjual 
    FROM log_penjualan 
    WHERE DATE(waktu_input) = CURDATE() ${filter}
    ORDER BY id DESC 
    LIMIT 10
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ==========================================
// API PRODUKSI & INVENTARIS
// ==========================================
app.post("/produksi-menu", (req, res) => {
  const { nama_produk, jumlah_produksi } = req.body;
  const id_cabang = getCabangId(req);

  const queryCekStok = `
    SELECT bb.id AS id_bahan_lokal, bb.nama_bahan, bb.stok_saat_ini, bb.satuan, r.jumlah_kebutuhan 
    FROM resep r 
    JOIN bahan_baku b_master ON r.id_bahan = b_master.id
    JOIN bahan_baku bb ON bb.nama_bahan = b_master.nama_bahan AND bb.id_cabang = ?
    JOIN produk p ON r.id_produk = p.id 
    WHERE p.nama_produk = ?`;

  db.query(queryCekStok, [id_cabang, nama_produk], (err, resep) => {
    if (err) return res.status(500).json({ error: err.message });
    if (resep.length === 0)
      return res
        .status(404)
        .json({ error: "Resep tidak ditemukan di cabang ini!" });

    let bahanKurang = [];
    resep.forEach((item) => {
      const totalPakai = item.jumlah_kebutuhan * jumlah_produksi;
      if (item.stok_saat_ini < totalPakai) {
        bahanKurang.push(
          `${item.nama_bahan} (Kurang ${totalPakai - item.stok_saat_ini} ${item.satuan})`,
        );
      }
    });

    if (bahanKurang.length > 0)
      return res.status(400).json({
        error: "Stok bahan baku tidak mencukupi!",
        detail: bahanKurang,
      });

    let completed = 0;
    resep.forEach((item) => {
      const totalPakai = item.jumlah_kebutuhan * jumlah_produksi;

      db.query(
        "UPDATE bahan_baku SET stok_saat_ini = stok_saat_ini - ? WHERE id = ?",
        [totalPakai, item.id_bahan_lokal],
        () => {
          const queryLog =
            "INSERT INTO log_stok (id_cabang, nama_bahan, tipe_mutasi, jumlah, satuan, keterangan) VALUES (?, ?, 'KELUAR', ?, ?, ?)";
          const ket = `Produksi ${jumlah_produksi} cup ${nama_produk}`;

          db.query(
            queryLog,
            [id_cabang, item.nama_bahan, totalPakai, item.satuan, ket],
            () => {
              completed++;
              if (completed === resep.length) {
                db.query(
                  "UPDATE produk SET stok_saat_ini = stok_saat_ini + ? WHERE nama_produk = ?",
                  [jumlah_produksi, nama_produk],
                  () => {
                    res.json({
                      message:
                        "Produksi selesai. Bahan baku terpotong dan riwayat tercatat.",
                    });
                  },
                );
              }
            },
          );
        },
      );
    });
  });
});

app.post("/restock-bahan", (req, res) => {
  const { nama_bahan, jumlah_masuk, satuan, harga_total, tanggal_expired } =
    req.body;
  const id_cabang = getCabangId(req);
  const hargaSatuanBaru = Math.round(harga_total / jumlah_masuk);

  const queryUpdate =
    "UPDATE bahan_baku SET stok_awal = stok_saat_ini + ?, stok_saat_ini = stok_saat_ini + ?, tgl_expired = ?, harga_satuan = ? WHERE nama_bahan = ? AND id_cabang = ?";

  db.query(
    queryUpdate,
    [
      jumlah_masuk,
      jumlah_masuk,
      tanggal_expired,
      hargaSatuanBaru,
      nama_bahan,
      id_cabang,
    ],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      const queryLog =
        "INSERT INTO log_stok (id_cabang, nama_bahan, tipe_mutasi, jumlah, satuan, keterangan) VALUES (?, ?, 'MASUK', ?, ?, 'Restock bahan baku')";
      db.query(
        queryLog,
        [id_cabang, nama_bahan, jumlah_masuk, satuan],
        (err) => {
          if (err) console.error("Gagal mencatat log masuk:", err);
          res.json({ message: "Restock berhasil dan tercatat di riwayat." });
        },
      );
    },
  );
});

// ==========================================
// API LAPORAN
// ==========================================
app.get("/laporan/grafik", (req, res) => {
  const filter = getCabangFilter(req);
  const query = `
    SELECT MONTH(tanggal) AS bulan, nama_bahan, SUM(jumlah) AS total 
    FROM log_stok 
    WHERE tipe_mutasi = 'KELUAR' AND YEAR(tanggal) = YEAR(CURDATE()) ${filter}
    GROUP BY MONTH(tanggal), nama_bahan
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const bahanMap = {};

    results.forEach((row) => {
      if (!bahanMap[row.nama_bahan])
        bahanMap[row.nama_bahan] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      bahanMap[row.nama_bahan][row.bulan - 1] = row.total;
    });

    const datasetsChartJs = Object.keys(bahanMap).map((namaBahan) => {
      return { label: namaBahan, data: bahanMap[namaBahan] };
    });

    res.json(datasetsChartJs);
  });
});

app.get("/laporan/top-menu", (req, res) => {
  const filter = getCabangFilter(req);
  const query = `
    SELECT nama_produk, SUM(terjual) AS jumlah 
    FROM log_penjualan 
    WHERE YEAR(tanggal) = YEAR(CURDATE()) ${filter}
    GROUP BY nama_produk ORDER BY jumlah DESC LIMIT 3
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/laporan/produksi", (req, res) => {
  const filter = getCabangFilter(req);
  const query = `SELECT id, id_cabang, nama_bahan, stok_awal, stok_saat_ini, satuan, harga_satuan, tgl_expired FROM bahan_baku WHERE 1=1 ${filter} ORDER BY tgl_expired ASC`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const hariIni = new Date();
    const dataDenganStatus = results.map((bahan) => {
      let status = "Stok Aman";
      const tglExpired = new Date(bahan.tgl_expired);
      const selisihWaktu = tglExpired - hariIni;
      const selisihHari = Math.ceil(selisihWaktu / (1000 * 60 * 60 * 24));
      let persentaseSisa =
        bahan.stok_awal > 0 ? (bahan.stok_saat_ini / bahan.stok_awal) * 100 : 0;

      if (selisihHari <= 60 && selisihHari > 0) status = "Hampir Expired";
      else if (selisihHari <= 0) status = "Sudah Expired";
      else if (persentaseSisa < 30) status = "Stok Hampir Habis";
      else if (persentaseSisa >= 30 && persentaseSisa <= 70)
        status = "Stok Masih Ada";

      return {
        ...bahan,
        status: status,
        tgl_format: tglExpired.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      };
    });
    res.json(dataDenganStatus);
  });
});

app.get("/laporan-penjualan/summary", (req, res) => {
  const filter = getCabangFilter(req);
  const query = `
    SELECT 
      COALESCE(SUM(total_pendapatan), 0) AS totalPendapatan,
      COALESCE(SUM(terjual), 0) AS totalCup,
      (SELECT nama_produk FROM log_penjualan WHERE MONTH(tanggal) = MONTH(CURDATE()) AND YEAR(tanggal) = YEAR(CURDATE()) ${filter} GROUP BY nama_produk ORDER BY SUM(terjual) DESC LIMIT 1) AS menuJuara
    FROM log_penjualan WHERE MONTH(tanggal) = MONTH(CURDATE()) AND YEAR(tanggal) = YEAR(CURDATE()) ${filter}
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const data = results[0];
    res.json({
      totalPendapatan: data.totalPendapatan,
      totalCup: data.totalCup,
      menuJuara: data.menuJuara || "Belum ada data",
    });
  });
});

app.get("/laporan-penjualan/leaderboard", (req, res) => {
  const filter = getCabangFilter(req);
  const query = `
    SELECT nama_rider, SUM(total_pendapatan) AS pendapatan, SUM(terjual) AS terjual
    FROM log_penjualan WHERE MONTH(tanggal) = MONTH(CURDATE()) AND YEAR(tanggal) = YEAR(CURDATE()) ${filter}
    GROUP BY nama_rider ORDER BY pendapatan DESC LIMIT 5
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/laporan-penjualan/grafik", (req, res) => {
  const filter = getCabangFilter(req);
  const query = `
    SELECT DATE_FORMAT(tanggal, '%d %b') AS label_tanggal, SUM(total_pendapatan) AS pendapatan_harian
    FROM log_penjualan WHERE MONTH(tanggal) = MONTH(CURDATE()) AND YEAR(tanggal) = YEAR(CURDATE()) ${filter}
    GROUP BY DATE(tanggal) ORDER BY DATE(tanggal) ASC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    const labels = results.map((row) => row.label_tanggal);
    const pendapatan = results.map((row) => row.pendapatan_harian);
    res.json({ labels, pendapatan });
  });
});

app.get("/laporan-penjualan/riwayat", (req, res) => {
  const filter = getCabangFilter(req);

  const query = `
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
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error("Error API Riwayat Penjualan:", err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(results);
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server Express berjalan di http://localhost:${PORT}`);
});
