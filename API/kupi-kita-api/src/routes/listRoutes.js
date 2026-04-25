const express = require("express");
const router = express.Router();
const listController = require("../controllers/listController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.use(requireAuth);

router.get("/list-rider", listController.getListRider);
router.get("/list-menu-produksi", listController.getListMenuProduksi);
router.get("/list-produk-tersedia", listController.getListProdukTersedia);
router.get("/list-bahan-baku", listController.getListBahanBaku);
router.get("/riwayat-hari-ini", listController.getRiwayatHariIni);

module.exports = router;
