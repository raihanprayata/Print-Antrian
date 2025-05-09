const path = require("path");
const fs = require("fs");
const Layout = require("./model.js"); // Model langsung
const { Antrian } = require("../../relasi/relasi.js"); // Pastikan path relasi benar

// URL dasar untuk akses gambar
const BASE_URL = "http://localhost:3000/uploads/";

// GET semua layout
const getLayout = async (req, res) => {
  try {
    const layouts = await Layout.findAll({
      include: {
        model: Antrian,
        attributes: ["id", "nama_antrian"],
      },
    });
    res.status(200).json({ message: "Semua layout", data: layouts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET layout by ID
const getLayoutById = async (req, res) => {
  try {
    const layout = await Layout.findByPk(req.params.id);
    if (!layout) {
      return res.status(404).json({ message: "Layout tidak ditemukan" });
    }
    res.status(200).json({ message: "Detail layout", data: layout });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET layout by id_antrian
const getLayoutByIdAntrian = async (req, res) => {
  try {
    const layouts = await Layout.findAll({
      where: { id_antrian: req.params.id_antrian },
      include: {
        model: Antrian,
        attributes: ["id", "nama_antrian"],
      },
    });

    if (!layouts.length) {
      return res
        .status(404)
        .json({ message: "Layout tidak ditemukan untuk antrian ini" });
    }

    res.status(200).json({ message: "Layout per antrian", data: layouts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Tambah layout baru
const createLayout = async (req, res) => {
  try {
    const { id_antrian, urutan, type, size_font, nama } = req.body;

    // Cek apakah ada file yang diupload
    if (type === "image" && !req.file) {
      return res.status(400).json({
        message: "File gambar wajib diupload untuk type image",
      });
    }

    let content = null;

    // Jika type adalah "image" dan ada file, set content dengan URL gambar
    if (type === "image" && req.file) {
      content = BASE_URL + req.file.filename;
    } else if (req.body.content) {
      // Jika type bukan image, gunakan content dari body
      content = req.body.content;
    }

    const layout = await Layout.create({
      id_antrian: id_antrian || "",
      urutan: urutan || "",
      type: type || "",
      size_font: size_font || "",
      nama: nama || "",
      content: content || "",
    });

    res.status(201).json({
      message: "Layout berhasil ditambahkan",
      layout: {
        ...layout.toJSON(),
        contentUrl: type === "image" ? content : null,
      },
    });
  } catch (error) {
    console.error("Error pada createLayout:", error);
    res.status(500).json({ message: "Gagal menambahkan layout", error });
  }
};

// Update layout
const updateLayout = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_antrian, urutan, type, size_font, nama } = req.body;
    let content = req.body.content;

    const layout = await Layout.findByPk(id);
    if (!layout) {
      return res.status(404).json({ message: "Layout tidak ditemukan" });
    }

    let image = null;
    if (layout.type === "image" && layout.content?.startsWith(BASE_URL)) {
      try {
        image = path.basename(new URL(layout.content).pathname);
      } catch (e) {
        console.error("Gagal parsing URL:", e);
      }
    }

    if (req.file) {
      // Hapus gambar lama jika ada
      if (layout.type === "image" && image) {
        const oldPath = path.resolve(
          __dirname,
          "../../../public/uploads",
          image
        );
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }

      image = req.file.filename;
      content = BASE_URL + image;
    }

    await layout.update({
      id_antrian: id_antrian ?? layout.id_antrian,
      urutan: urutan ?? layout.urutan,
      type: type ?? layout.type,
      size_font: size_font !== undefined ? size_font : layout.size_font,
      nama: nama !== undefined ? nama : layout.nama,
      content: content !== undefined ? content : layout.content,
    });

    res.json({
      message: "Layout berhasil diperbarui",
      layout: {
        ...layout.toJSON(),
        contentUrl: content ? BASE_URL + (req.file ? image : "") : null,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Gagal memperbarui layout", error });
  }
};

// DELETE layout
const deleteLayout = async (req, res) => {
  try {
    const layout = await Layout.findByPk(req.params.id);
    if (!layout)
      return res.status(404).json({ message: "Layout tidak ditemukan" });

    if (layout.type === "image" && layout.content) {
      const filePath = path.join(
        __dirname,
        "../../../public",
        new URL(layout.content).pathname
      );
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await layout.destroy();
    res.status(200).json({ message: "Layout dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getLayout,
  getLayoutById,
  getLayoutByIdAntrian,
  createLayout,
  updateLayout,
  deleteLayout,
};
