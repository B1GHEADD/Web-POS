const express = require("express");
const router = express.Router();
const riderController = require("../controllers/riderController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.use(requireAuth);

router.get("/box", riderController.getBoxRider);
router.post("/ambil-kulkas", riderController.ambilKulkas);
router.post("/kembalikan-stok", riderController.kembalikanStok);
router.post("/catat-laku", riderController.catatLaku);

module.exports = router;
