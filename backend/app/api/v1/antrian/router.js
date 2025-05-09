const express = require("express");
const router = express.Router();
const {
getAntrian, 
getAntrianById,
getAntrianByNama,
editAntrian, 
addAntrian, 
deleteAntrian
} = require("./controller");

router.get("/antrian",  getAntrian);
router.get("/antrian/id/:id",  getAntrianById);
router.get("/antrian/nama/:nama_antrian",  getAntrianByNama);
router.post("/antrian", addAntrian);
router.put("/antrian/:id", editAntrian);
router.delete("/antrian/:id", deleteAntrian)

module.exports = router
