const { printer: ThermalPrinter, printer } = require("node-thermal-printer");
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const modelLayout = require("../layout/model.js");

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const printLayoutSatuan = async (req, res) => {
  const { id_antrian } = req.params;
  const { start, format_digit, prefix } = req.body;

  try {
    const startNumber = Number(start);
    const formatDigit = Number(format_digit);

    if (isNaN(startNumber) || isNaN(formatDigit)) {
      return res
        .status(400)
        .json({ message: "Range angka atau format digit tidak valid." });
    }

    if (startNumber < 0 || formatDigit < 1) {
      return res.status(400).json({
        message: "Nomor mulai tidak boleh negatif dan format digit minimal 1.",
      });
    }

    console.log(`
        id antrian: ${id_antrian}
        start: ${start}
        format digit: ${format_digit}
        prefix: ${prefix}
        `);

    const layouts = await modelLayout.findAll({
      where: { id_antrian },
      order: [["urutan", "ASC"]],
    });

    for (let i = startNumber; i <= startNumber; i++) {
      const nomor = i.toString().padStart(formatDigit, "0");
      console.log(`Mencetak untuk nomor: ${nomor}`);
      console.log(`prefix: ${prefix} - format digit: ${formatDigit}`);

      console.log(layouts);

      let printer = new ThermalPrinter({
        type: "epson",
        interface: "\\\\127.0.0.1\\EPSON-TM-T82",
        width: 46,
        removeSpecialCharacters: false,
        replaceSpecialCharacters: true,
      });

      printer.alignCenter();

      // Layout header & gambar
      for (let layout of layouts) {
        if (layout.type === "image") {
          try {
            const urlParts = layout.content.split("/");
            const filename = urlParts[urlParts.length - 1];
            let imagePath = path.resolve(
              __dirname,
              "../../../public/uploads",
              filename
            );

            if (fs.existsSync(imagePath)) {
              const extname = path.extname(imagePath).toLowerCase();

              // Jika bukan PNG, konversi ke PNG dan resize
              if (extname !== ".png") {
                const convertedImagePath = imagePath.replace(extname, ".png");

                try {
                  // Ubah ukuran gambar berdasarkan layout.size_font
                  const height = layout.size_font * 30;
                  await sharp(imagePath)
                    .resize({ height: height }) // sesuaikan tinggi gambar
                    .toFormat("png")
                    .toFile(convertedImagePath);

                  console.log("Image converted & resized successfully");
                  console.log(`Height untuk image: , ${height}`);

                  imagePath = convertedImagePath; // update path ke file PNG
                } catch (convertError) {
                  console.error(
                    "Error converting/resizing image:",
                    convertError
                  );
                  throw new Error("Failed to convert image");
                }
              }

              // Mencetak gambar
              printer.alignCenter();
              await printer.printImage(imagePath);
              printer.println("");
              printer.println("");
              printer.println("");
              printer.println("");
            } else {
              console.error(`Image file not found: ${imagePath}`);
              printer.println("Image not found");
            }
          } catch (imageError) {
            console.error("Error printing image:", imageError);
            printer.println("Failed to print image");
          }
        }

        if (layout.type === "line") {
          printer.drawLine();
        }

        if (layout.type === "text") {
          if (layout.size_font === 0) {
            printer.setTextNormal();
            printer.println(layout.content);
          } else {
            printer.setTextSize(layout.size_font, layout.size_font);
            printer.println(layout.content);
            printer.setTextNormal();
          }
        }

        if (layout.type === "antrian") {
          // Nomor antrian besar
          printer.setTextSize(layout.size_font, layout.size_font);
          printer.bold();
          printer.println(prefix + nomor);
          console.log(prefix + nomor);
          printer.setTextNormal();
        }
      }

      printer.cut();
      await printer.execute();

      await delay(1000);
    }

    return res.json({
      message: `Berhasil mencetak dari nomor ${start}`,
    });
  } catch (error) {
    console.error("Gagal mencetak:", error);
    return res
      .status(500)
      .json({ message: "Terjadi kesalahan saat mencetak." });
  }
};

module.exports = { printLayoutSatuan };
