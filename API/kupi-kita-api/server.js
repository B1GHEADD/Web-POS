const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

// Mengizinkan Vue.js mengakses API ini
app.use(cors());
app.use(express.json());

// 1. Konfigurasi Koneksi Database
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

// --- API Ambil Daftar Rider ---
app.get("/list-rider", (req, res) => {
  const query = "SELECT nama_rider FROM rider WHERE status = 'Aktif'";

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// --- API Ambil Daftar Produk Tersedia (Stok > 0) ---
app.get("/list-produk-tersedia", (req, res) => {
  const query = "SELECT nama_produk FROM produk WHERE stok_saat_ini > 0";

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// --- API Ambil Riwayat Penjualan Hari Ini (Rider POS) ---
app.get("/riwayat-hari-ini", (req, res) => {
  // Fungsi CURDATE() akan otomatis memfilter tanggal hari ini di server MySQL
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

app.post("/produksi-menu", (req, res) => {
  const { nama_produk, jumlah_produksi } = req.body;

  // 1. Cari resep sekaligus cek stok bahan baku saat ini
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

    // --- 2. SATPAM: FILTER VALIDASI STOK MINUS ---
    let bahanKurang = [];

    resep.forEach((item) => {
      const totalPakai = item.jumlah_kebutuhan * jumlah_produksi;
      // Jika stok di database lebih kecil dari kebutuhan, masukkan ke daftar kurang
      if (item.stok_saat_ini < totalPakai) {
        bahanKurang.push(
          `${item.nama_bahan} (Kurang ${totalPakai - item.stok_saat_ini} ${item.satuan})`,
        );
      }
    });

    // Jika ada 1 saja bahan yang kurang, TENDANG KELUAR! Batalkan semua proses.
    if (bahanKurang.length > 0) {
      return res.status(400).json({
        error: "Stok bahan baku tidak mencukupi!",
        detail: bahanKurang,
      });
    }

    // --- 3. EKSEKUSI (Hanya berjalan jika lolos Satpam) ---
    let completed = 0;
    resep.forEach((item) => {
      const totalPakai = item.jumlah_kebutuhan * jumlah_produksi;

      // A. Potong stok bahan_baku
      db.query(
        "UPDATE bahan_baku SET stok_saat_ini = stok_saat_ini - ? WHERE id = ?",
        [totalPakai, item.id_bahan],
        () => {
          // B. Catat ke log_stok (Riwayat Keluar)
          const queryLog =
            "INSERT INTO log_stok (nama_bahan, tipe_mutasi, jumlah, satuan, keterangan) VALUES (?, 'KELUAR', ?, ?, ?)";
          const ket = `Produksi ${jumlah_produksi} cup ${nama_produk}`;

          db.query(
            queryLog,
            [item.nama_bahan, totalPakai, item.satuan, ket],
            () => {
              completed++;

              // C. Jika semua bahan sudah selesai dipotong, tambah stok produk jadi
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

// Jalur API untuk Restock Bahan Baku
// --- 1. API RESTOCK (MASUK) ---
app.post("/restock-bahan", (req, res) => {
  const { nama_bahan, jumlah_masuk, satuan, harga_total, tanggal_expired } =
    req.body;
  const hargaSatuanBaru = Math.round(harga_total / jumlah_masuk);

  // Update stok utama
  const queryUpdate =
    "UPDATE bahan_baku SET stok_awal = stok_saat_ini + ?, stok_saat_ini = stok_saat_ini + ?, tgl_expired = ?, harga_satuan = ? WHERE nama_bahan = ?";

  db.query(
    queryUpdate,
    [jumlah_masuk, jumlah_masuk, tanggal_expired, hargaSatuanBaru, nama_bahan],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });

      // CATAT KE LOG_STOK (MASUK)
      const queryLog =
        "INSERT INTO log_stok (nama_bahan, tipe_mutasi, jumlah, satuan, keterangan) VALUES (?, 'MASUK', ?, ?, 'Restock bahan baku')";
      db.query(queryLog, [nama_bahan, jumlah_masuk, satuan], (err) => {
        if (err) console.error("Gagal mencatat log masuk:", err);
        res.json({ message: "Restock berhasil dan tercatat di riwayat." });
      });
    },
  );
});

app.post("/penjualan-rider", (req, res) => {
  const { nama_rider, tanggal, nama_produk, jumlah_dibawa, terjual, sisa } =
    req.body;

  // 1. Cek stok saat ini dan ambil harga jual
  const queryCekProduk =
    "SELECT harga_jual, stok_saat_ini FROM produk WHERE nama_produk = ?";

  db.query(queryCekProduk, [nama_produk], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res
        .status(404)
        .json({ error: "Produk tidak ditemukan di database!" });

    const produk = results[0];

    // 2. SATPAM: Validasi stok fisik
    if (produk.stok_saat_ini < jumlah_dibawa) {
      return res.status(400).json({
        error: `Stok tidak cukup! Sistem hanya mencatat sisa ${produk.stok_saat_ini} cup ${nama_produk}.`,
      });
    }

    // 3. Kalkulasi Otomatis
    const total_pendapatan = terjual * produk.harga_jual;

    // 4. Eksekusi 1: Potong stok barang jadi
    const queryUpdateStok =
      "UPDATE produk SET stok_saat_ini = stok_saat_ini - ? WHERE nama_produk = ?";

    // PERBAIKAN DI SINI: Masukkan terjual dan nama_produk
    db.query(queryUpdateStok, [terjual, nama_produk], (err) => {
      if (err)
        return res
          .status(500)
          .json({ error: "Gagal memotong stok barang jadi." });

      // 5. Eksekusi 2: Catat ke buku riwayat log_penjualan
      const queryLog = `
        INSERT INTO log_penjualan 
        (tanggal, nama_rider, nama_produk, jumlah_dibawa, terjual, sisa, total_pendapatan) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        queryLog,
        [
          tanggal,
          nama_rider,
          nama_produk,
          jumlah_dibawa,
          terjual,
          sisa,
          total_pendapatan,
        ],
        (err) => {
          if (err)
            return res
              .status(500)
              .json({ error: "Gagal mencatat riwayat penjualan." });

          res.json({
            message: `Berhasil! ${terjual} cup terjual dengan pendapatan Rp ${total_pendapatan.toLocaleString("id-ID")}`,
          });
        },
      );
    });
  });
});

// API Laporan Grafik Penggunaan Bahan Baku (Detail per Bahan)
app.get("/laporan/grafik", (req, res) => {
  // Query: Kelompokkan berdasarkan Bulan DAN Nama Bahan
  const query = `
    SELECT MONTH(tanggal) AS bulan, nama_bahan, SUM(jumlah) AS total 
    FROM log_stok 
    WHERE tipe_mutasi = 'KELUAR' AND YEAR(tanggal) = YEAR(CURDATE())
    GROUP BY MONTH(tanggal), nama_bahan
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    // 1. Buat wadah penampung sementara
    const bahanMap = {};

    // 2. Susun data: Pisahkan masing-masing bahan menjadi array 12 bulan
    results.forEach((row) => {
      // Jika bahan belum terdaftar di wadah, buatkan array kosong 12 bulan
      if (!bahanMap[row.nama_bahan]) {
        bahanMap[row.nama_bahan] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
      }
      // Masukkan angka penggunaan ke index bulan yang tepat (Januari = 0)
      bahanMap[row.nama_bahan][row.bulan - 1] = row.total;
    });

    // 3. Format akhir khusus untuk struktur Chart.js
    const datasetsChartJs = Object.keys(bahanMap).map((namaBahan) => {
      return {
        label: namaBahan,
        data: bahanMap[namaBahan],
      };
    });

    res.json(datasetsChartJs);
  });
});

// --- API Laporan Top 3 Menu Terlaris ---
app.get("/laporan/top-menu", (req, res) => {
  // Logika: Ambil 3 data dari tabel produk yang memiliki angka stok tertinggi
  const query = `
    SELECT nama_produk, stok_saat_ini AS jumlah 
    FROM produk 
    ORDER BY stok_saat_ini DESC 
    LIMIT 3
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Jalur API untuk Laporan Bahan Baku
app.get("/laporan/produksi", (req, res) => {
  const query =
    "SELECT id, nama_bahan, stok_awal, stok_saat_ini, satuan, harga_satuan, tgl_expired FROM bahan_baku ORDER BY tgl_expired ASC";

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    const hariIni = new Date();

    const dataDenganStatus = results.map((bahan) => {
      let status = "Stok Aman";

      // 1. Kalkulasi Selisih Hari Kedaluwarsa
      const tglExpired = new Date(bahan.tgl_expired);
      const selisihWaktu = tglExpired - hariIni;
      const selisihHari = Math.ceil(selisihWaktu / (1000 * 60 * 60 * 24));

      // 2. Kalkulasi Persentase Sisa Stok
      let persentaseSisa = 0;
      if (bahan.stok_awal > 0) {
        persentaseSisa = (bahan.stok_saat_ini / bahan.stok_awal) * 100;
      }

      // 3. Logika Penentuan Status (Prioritas Expired 2 Bulan/60 Hari)
      if (selisihHari <= 60 && selisihHari > 0) {
        status = "Hampir Expired";
      } else if (selisihHari <= 0) {
        status = "Sudah Expired"; // Tambahan proteksi jika sudah lewat tanggalnya
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

// 1. API Summary: Menghitung total pendapatan, cup, dan menu paling laku bulan ini
app.get("/laporan-penjualan/summary", (req, res) => {
  const query = `
    SELECT 
      COALESCE(SUM(total_pendapatan), 0) AS totalPendapatan,
      COALESCE(SUM(terjual), 0) AS totalCup,
      (SELECT nama_produk FROM log_penjualan 
       WHERE MONTH(tanggal) = MONTH(CURDATE()) AND YEAR(tanggal) = YEAR(CURDATE()) 
       GROUP BY nama_produk ORDER BY SUM(terjual) DESC LIMIT 1) AS menuJuara
    FROM log_penjualan 
    WHERE MONTH(tanggal) = MONTH(CURDATE()) AND YEAR(tanggal) = YEAR(CURDATE())
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

// 2. API Leaderboard: Mengurutkan Rider berdasarkan pendapatan tertinggi bulan ini
app.get("/laporan-penjualan/leaderboard", (req, res) => {
  const query = `
    SELECT nama_rider, SUM(total_pendapatan) AS pendapatan, SUM(terjual) AS terjual
    FROM log_penjualan
    WHERE MONTH(tanggal) = MONTH(CURDATE()) AND YEAR(tanggal) = YEAR(CURDATE())
    GROUP BY nama_rider
    ORDER BY pendapatan DESC
    LIMIT 5
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 3. API Grafik: Mengelompokkan pendapatan per hari untuk Chart.js
app.get("/laporan-penjualan/grafik", (req, res) => {
  const query = `
    SELECT DATE_FORMAT(tanggal, '%d %b') AS label_tanggal, SUM(total_pendapatan) AS pendapatan_harian
    FROM log_penjualan
    WHERE MONTH(tanggal) = MONTH(CURDATE()) AND YEAR(tanggal) = YEAR(CURDATE())
    GROUP BY DATE(tanggal)
    ORDER BY DATE(tanggal) ASC
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    // Logika Sederhana: Pisahkan hasil query ke dalam 2 array terpisah agar mudah dimakan oleh Chart.js
    const labels = results.map((row) => row.label_tanggal);
    const pendapatan = results.map((row) => row.pendapatan_harian);

    res.json({ labels, pendapatan });
  });
});

// 4. API Riwayat Transaksi: Mengambil raw data untuk tabel audit
app.get("/laporan-penjualan/riwayat", (req, res) => {
  const query = `
    SELECT id, DATE_FORMAT(waktu_input, '%d-%m-%Y %H:%i') AS waktu_format, 
    nama_rider, nama_produk, jumlah_dibawa, terjual, sisa, total_pendapatan
    FROM log_penjualan
    ORDER BY id DESC
    LIMIT 50
  `;

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// 3. Menjalankan Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server Express berjalan di http://localhost:${PORT}`);
});
