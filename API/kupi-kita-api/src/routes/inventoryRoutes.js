const express = require("express");
const router = express.Router();
const inventoryController = require("../controllers/inventoryController");
const { requireAuth } = require("../middlewares/authMiddleware");

router.use(requireAuth);

router.post("/produksi-menu", inventoryController.produksiMenu);
router.post("/restock-bahan", inventoryController.restockBahan);

module.exports = router;
