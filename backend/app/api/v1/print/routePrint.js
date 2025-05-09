const express = require("express");
const router = express.Router();
const {printLayoutHandler} = require("./print.js");

router.post("/print/:id_antrian", printLayoutHandler);

module.exports = router