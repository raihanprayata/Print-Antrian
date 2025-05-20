const express = require("express");
const router = express.Router();
const { printLayoutHandler } = require("./print.js");
const { printLayoutSatuan } = require("./PrintSatuan.js");

router.post("/print/:id_antrian", printLayoutHandler);
router.post("/printSatuan/:id_antrian", printLayoutSatuan);

module.exports = router;
