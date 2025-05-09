const multer = require("multer");
const path = require("path");

// Menentukan tipe data gambar yang diizinkan
const FILE_TYPE = {
  "image/png": "png",
  "image/jpg": "jpg",
  "image/jpeg": "jpeg",
  "image/gif": "gif"
};

// Menentukan direktori penyimpanan dan nama file yang disimpan
const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "app/public/uploads/");
  },

  filename: function (req, file, cb) {
    // Nama file yang lebih sederhana dan pasti valid
    const date = new Date();
    const timestamp = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getTime()}`;
    const fileExt = path.extname(file.originalname).toLowerCase();
    cb(null, `content-${timestamp}${fileExt}`);
  },
});

// Memeriksa ekstensi file yang diizinkan
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif/;
  const extname = allowedFileTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = allowedFileTypes.test(file.mimetype);

  // Cek ekstensi dan mimetype
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    // Tambahkan pesan error untuk debugging
    console.log("File ditolak:", file.originalname, "mimetype:", file.mimetype);
    return cb(null, false);
  }
};

// Memeriksa ukuran file yang diizinkan
const limits = {
  fileSize: 5 * 1024 * 1024, // Maksimal ukuran file adalah 5MB
};

const uploadImage = multer({
  storage: diskStorage,
  fileFilter: fileFilter,
  limits: limits,
});

module.exports = uploadImage;