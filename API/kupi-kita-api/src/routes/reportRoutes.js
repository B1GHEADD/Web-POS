const express = require("express");
const router = express.Router();
const reportController = require("../controllers/reportController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.use(requireAuth);

// Route terkait laporan stok/produksi
router.get("/grafik", reportController.getGrafik);
router.get("/top-menu", reportController.getTopMenu);
router.get("/produksi", reportController.getLaporanProduksi);

// Route terkait laporan penjualan
router.get("/penjualan/summary", reportController.getSummaryPenjualan);
router.get("/penjualan/leaderboard", reportController.getLeaderboard);
router.get("/penjualan/grafik", reportController.getGrafikPenjualan);
router.get("/penjualan/riwayat", reportController.getRiwayatPenjualan);

module.exports = router;
