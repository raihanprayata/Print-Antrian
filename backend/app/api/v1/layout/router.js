const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadImage.js");
const {
  getLayout,
  getLayoutById,
  getLayoutByIdAntrian,
  createLayout,
  updateLayout,
  deleteLayout,
} = require("./controller.js");

// Routes
router.get("/layout", getLayout);
router.get("/layout/id/:id", getLayoutById);
router.get("/layout/antrian/:id_antrian", getLayoutByIdAntrian);

// File upload handled by multer middleware
router.post("/layout", upload.single("content"), createLayout);
router.put("/layout/:id", upload.single("content"), updateLayout);
router.delete("/layout/:id", deleteLayout);

module.exports = router;
