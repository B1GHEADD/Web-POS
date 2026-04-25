const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController");
const { requireAuth } = require("../middlewares/authMiddleware");

// Semua route di bawah ini diproteksi
router.use(requireAuth);

router.get("/kpi", dashboardController.getKpi);
router.get("/stok-kritis", dashboardController.getStokKritis);
router.get("/expired", dashboardController.getExpired);
router.get("/live-rider", dashboardController.getLiveRider);
router.get("/grafik-tren", dashboardController.getGrafikTren);

module.exports = router;
