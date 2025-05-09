const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const port = 3000;
const routerAntrian = require("./app/api/v1/antrian/router.js");
const routerLayout = require("./app/api/v1/layout/router.js");
const routerPrint = require("./app/api/v1/print/routePrint.js");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "app/public/uploads")));
const sequelize = require("./app/utils/config");
const { Antrian, Layout } = require("./app/api/relasi/relasi");

app.use("/api", routerAntrian);
app.use("/api", routerLayout);
app.use("/api", routerPrint);

sequelize
  .sync()
  .then(() => {
    console.log("Database & tabel berhasil disinkronkan.");
    app.listen(port, () => {
      console.log(`Server berjalan pada port: ${port}`);
    });
  })
  .catch((err) => {
    console.error("Gagal sinkronisasi database:", err);
  });
