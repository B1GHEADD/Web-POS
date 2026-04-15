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
  console.log("Berhasil terhubung ke database MySQL!");
});

// ==========================================
// API LOGIN
// ==========================================
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const query =
    "SELECT id, username, role, nama_lengkap FROM users WHERE username = ? AND password = ?";

  db.query(query, [username, password], (err, results) => {
    if (err)
      return res.status(500).json({ error: "Terjadi kesalahan server." });

    if (results.length > 0) {
      // Login berhasil, kirim data user
      res.json({ success: true, user: results[0] });
    } else {
      // Login gagal
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
  const queryOmsetLaku = `SELECT SUM(total_pendapatan) as omset, SUM(terjual) as laku FROM log_penjualan WHERE DATE(tanggal) = CURDATE()`;
  const queryStokKulkas = `SELECT SUM(stok_saat_ini) as stok_kulkas FROM produk`;
  const queryRiderAktif = `SELECT COUNT(DISTINCT nama_rider) as rider_aktif FROM stok_rider WHERE DATE(tanggal) = CURDATE()`;

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
  const query = `SELECT nama_bahan, stok_saat_ini, satuan FROM bahan_baku WHERE stok_saat_ini < 2000 ORDER BY stok_saat_ini ASC LIMIT 5`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/dashboard/expired", (req, res) => {
  const query = `
    SELECT nama_bahan, tgl_expired, DATEDIFF(tgl_expired, CURDATE()) as sisa_hari 
    FROM bahan_baku 
    WHERE DATEDIFF(tgl_expired, CURDATE()) <= 30 AND DATEDIFF(tgl_expired, CURDATE()) >= 0
    ORDER BY sisa_hari ASC LIMIT 5
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/dashboard/live-rider", (req, res) => {
  const query = `
    SELECT 
      nama_rider, 
      nama_produk, 
      (stok_bawa + terjual) AS stok_bawa, 
      terjual, 
      stok_bawa AS sisa 
    FROM stok_rider 
    WHERE DATE(tanggal) = CURDATE() AND (stok_bawa > 0 OR terjual > 0)
    ORDER BY nama_rider ASC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/dashboard/grafik-tren", (req, res) => {
  const query = `
    SELECT 
      DATE_FORMAT(tanggal, '%d %b') AS tanggal_format, 
      SUM(total_pendapatan) AS omset 
    FROM log_penjualan 
    WHERE tanggal >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
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

// PERBAIKAN: Mengambil nama rider dari tabel 'users' dimana role-nya adalah 'rider'
app.get("/list-rider", (req, res) => {
  // Kita gunakan AS nama_rider agar frontend tidak perlu diganti sama sekali
  const query =
    "SELECT nama_lengkap AS nama_rider FROM users WHERE role = 'rider'";

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
  const query = "SELECT nama_produk, stok_saat_ini FROM produk LIMIT 10";

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/list-bahan-baku", (req, res) => {
  const query = "SELECT nama_bahan FROM bahan_baku ORDER BY nama_bahan ASC";

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ==========================================
// API TRANSAKSI RIDER
// ==========================================
app.post("/rider/kembalikan-stok", (req, res) => {
  const { nama_rider, tanggal, nama_produk, jumlah_dikembalikan } = req.body;
  const queryTambahKulkas =
    "UPDATE produk SET stok_saat_ini = stok_saat_ini + ? WHERE nama_produk = ?";

  db.query(queryTambahKulkas, [jumlah_dikembalikan, nama_produk], (err) => {
    if (err)
      return res.status(500).json({ error: "Gagal menambah stok kulkas." });

    const queryPotongBox =
      "UPDATE stok_rider SET stok_bawa = stok_bawa - ? WHERE nama_rider = ? AND tanggal = ? AND nama_produk = ?";
    db.query(
      queryPotongBox,
      [jumlah_dikembalikan, nama_rider, tanggal, nama_produk],
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

app.get("/riwayat-hari-ini", (req, res) => {
  const query = `
    SELECT nama_rider AS rider, nama_produk AS produk, terjual 
    FROM log_penjualan 
    WHERE DATE(waktu_input) = CURDATE() 
    ORDER BY id DESC 
    LIMIT 10
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/rider/box", (req, res) => {
  const { nama_rider, tanggal } = req.query;
  const query =
    "SELECT nama_produk, stok_bawa, terjual FROM stok_rider WHERE nama_rider = ? AND tanggal = ?";

  db.query(query, [nama_rider, tanggal], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.post("/rider/ambil-kulkas", (req, res) => {
  const { nama_rider, tanggal, nama_produk, jumlah_diambil } = req.body;

  const queryCekKulkas =
    "SELECT stok_saat_ini FROM produk WHERE nama_produk = ?";

  db.query(queryCekKulkas, [nama_produk], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ error: "Produk tidak ditemukan." });

    const stokKulkas = results[0].stok_saat_ini;

    if (stokKulkas < jumlah_diambil) {
      return res.status(400).json({
        error: `Stok Kulkas kurang! Hanya sisa ${stokKulkas} cup ${nama_produk}.`,
      });
    }

    const queryPotongKulkas =
      "UPDATE produk SET stok_saat_ini = stok_saat_ini - ? WHERE nama_produk = ?";

    db.query(queryPotongKulkas, [jumlah_diambil, nama_produk], (err) => {
      if (err)
        return res.status(500).json({ error: "Gagal memotong stok kulkas." });

      const queryIsiBox = `
        INSERT INTO stok_rider (tanggal, nama_rider, nama_produk, stok_bawa) 
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE stok_bawa = stok_bawa + ?
      `;

      db.query(
        queryIsiBox,
        [tanggal, nama_rider, nama_produk, jumlah_diambil, jumlah_diambil],
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

app.post("/rider/catat-laku", (req, res) => {
  const { nama_rider, tanggal, nama_produk, terjual } = req.body;

  const queryCekBox = `
    SELECT p.harga_jual, sr.stok_bawa 
    FROM stok_rider sr
    JOIN produk p ON sr.nama_produk = p.nama_produk
    WHERE sr.nama_rider = ? AND sr.tanggal = ? AND sr.nama_produk = ?
  `;

  db.query(queryCekBox, [nama_rider, tanggal, nama_produk], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ error: "Barang tidak ada di Box Rider!" });

    const boxRider = results[0];
    if (boxRider.stok_bawa < terjual) {
      return res.status(400).json({
        error: `Gagal! Sisa ${nama_produk} di box hanya ${boxRider.stok_bawa} cup.`,
      });
    }

    const total_pendapatan = terjual * boxRider.harga_jual;

    const queryPotongBox =
      "UPDATE stok_rider SET stok_bawa = stok_bawa - ?, terjual = terjual + ? WHERE nama_rider = ? AND tanggal = ? AND nama_produk = ?";

    db.query(
      queryPotongBox,
      [terjual, terjual, nama_rider, tanggal, nama_produk],
      (err) => {
        if (err)
          return res
            .status(500)
            .json({ error: "Gagal memotong stok box rider." });

        const queryLog = `
        INSERT INTO log_penjualan (tanggal, nama_rider, nama_produk, terjual, total_pendapatan) 
        VALUES (?, ?, ?, ?, ?)
      `;

        db.query(
          queryLog,
          [tanggal, nama_rider, nama_produk, terjual, total_pendapatan],
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
  });
});

// ==========================================
// API PRODUKSI & INVENTARIS
// ==========================================
app.post("/produksi-menu", (req, res) => {
  const { nama_produk, jumlah_produksi } = req.body;

  const queryCekStok = `
    SELECT r.id_bahan, b.nama_bahan, b.stok_saat_ini, b.satuan, r.jumlah_kebutuhan 
    FROM resep r 
    JOIN bahan_baku b ON r.id_bahan = b.id
    JOIN produk p ON r.id_produk = p.id 
    WHERE p.nama_produk = ?`;

  db.query(queryCekStok, [nama_produk], (err, resep) => {
    if (err) return res.status(500).json({ error: err.message });
    if (resep.length === 0)
      return res.status(404).json({ error: "Resep tidak ditemukan!" });

    let bahanKurang = [];

    resep.forEach((item) => {
      const totalPakai = item.jumlah_kebutuhan * jumlah_produksi;
      if (item.stok_saat_ini < totalPakai) {
        bahanKurang.push(
          `${item.nama_bahan} (Kurang ${totalPakai - item.stok_saat_ini} ${item.satuan})`,
        );
      }
    });

    if (bahanKurang.length > 0) {
      return res.status(400).json({
        error: "Stok bahan baku tidak mencukupi!",
        detail: bahanKurang,
      });
    }

    let completed = 0;
    resep.forEach((item) => {
      const totalPakai = item.jumlah_kebutuhan * jumlah_produksi;

      db.query(
        "UPDATE bahan_baku SET stok_saat_ini = stok_saat_ini - ? WHERE id = ?",
        [totalPakai, item.id_bahan],
        () => {
          const queryLog =
            "INSERT INTO log_stok (nama_bahan, tipe_mutasi, jumlah, satuan, keterangan) VALUES (?, 'KELUAR', ?, ?, ?)";
          const ket = `Produksi ${jumlah_produksi} cup ${nama_produk}`;

          db.query(
            queryLog,
            [item.nama_bahan, totalPakai, item.satuan, ket],
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
  const hargaSatuanBaru = Math.round(harga_total / jumlah_masuk);

  const queryUpdate =
    "UPDATE bahan_baku SET stok_awal = stok_saat_ini + ?, stok_saat_ini = stok_saat_ini + ?, tgl_expired = ?, harga_satuan = ? WHERE nama_bahan = ?";

  db.query(
    queryUpdate,
    [jumlah_masuk, jumlah_masuk, tanggal_expired, hargaSatuanBaru, nama_bahan],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      const queryLog =
        "INSERT INTO log_stok (nama_bahan, tipe_mutasi, jumlah, satuan, keterangan) VALUES (?, 'MASUK', ?, ?, 'Restock bahan baku')";
      db.query(queryLog, [nama_bahan, jumlah_masuk, satuan], (err) => {
        if (err) console.error("Gagal mencatat log masuk:", err);
        res.json({ message: "Restock berhasil dan tercatat di riwayat." });
      });
    },
  );
});

// ==========================================
// API LAPORAN
// ==========================================
app.get("/laporan/grafik", (req, res) => {
  const query = `
    SELECT MONTH(tanggal) AS bulan, nama_bahan, SUM(jumlah) AS total 
    FROM log_stok 
    WHERE tipe_mutasi = 'KELUAR' AND YEAR(tanggal) = YEAR(CURDATE())
    GROUP BY MONTH(tanggal), nama_bahan
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const bahanMap = {};

    results.forEach((row) => {
      if (!bahanMap[row.nama_bahan]) {
        bahanMap[row.nama_bahan] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
      bahanMap[row.nama_bahan][row.bulan - 1] = row.total;
    });

    const datasetsChartJs = Object.keys(bahanMap).map((namaBahan) => {
      return {
        name: namaBahan, // Disamakan dengan ECharts
        type: "bar",
        stack: "Total",
        data: bahanMap[namaBahan],
      };
    });

    res.json(datasetsChartJs);
  });
});

app.get("/laporan/top-menu", (req, res) => {
  const query = `
    SELECT nama_produk, SUM(terjual) AS jumlah 
    FROM log_penjualan 
    WHERE YEAR(tanggal) = YEAR(CURDATE())
    GROUP BY nama_produk 
    ORDER BY jumlah DESC 
    LIMIT 3
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/laporan/produksi", (req, res) => {
  const query =
    "SELECT id, nama_bahan, stok_awal, stok_saat_ini, satuan, harga_satuan, tgl_expired FROM bahan_baku ORDER BY tgl_expired ASC";

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const hariIni = new Date();

    const dataDenganStatus = results.map((bahan) => {
      let status = "Stok Aman";

      const tglExpired = new Date(bahan.tgl_expired);
      const selisihWaktu = tglExpired - hariIni;
      const selisihHari = Math.ceil(selisihWaktu / (1000 * 60 * 60 * 24));

      let persentaseSisa = 0;
      if (bahan.stok_awal > 0) {
        persentaseSisa = (bahan.stok_saat_ini / bahan.stok_awal) * 100;
      }

      if (selisihHari <= 60 && selisihHari > 0) {
        status = "Hampir Expired";
      } else if (selisihHari <= 0) {
        status = "Sudah Expired";
      } else if (persentaseSisa < 30) {
        status = "Stok Hampir Habis";
      } else if (persentaseSisa >= 30 && persentaseSisa <= 70) {
        status = "Stok Masih Ada";
      } else {
        status = "Stok Aman";
      }

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

app.get("/laporan-penjualan/riwayat", (req, res) => {
  const query = `
    SELECT 
      DATE_FORMAT(sr.tanggal, '%d-%m-%Y') AS waktu_format, 
      sr.nama_rider, 
      sr.nama_produk, 
      sr.terjual, 
      (sr.terjual * p.harga_jual) AS total_pendapatan
    FROM stok_rider sr
    JOIN produk p ON sr.nama_produk = p.nama_produk
    WHERE sr.terjual > 0
    ORDER BY sr.tanggal DESC, sr.nama_rider ASC
    LIMIT 50
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

app.get("/laporan/klasemen-rider", (req, res) => {
  const query = `
    SELECT 
      nama_rider, 
      SUM(terjual) AS total_cup, 
      SUM(total_pendapatan) AS total_omset 
    FROM log_penjualan 
    WHERE MONTH(tanggal) = MONTH(CURDATE()) AND YEAR(tanggal) = YEAR(CURDATE())
    GROUP BY nama_rider 
    ORDER BY total_omset DESC 
    LIMIT 3
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server Express berjalan di http://localhost:${PORT}`);
});
