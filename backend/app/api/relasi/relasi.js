const Antrian = require("../v1/antrian/model.js");
const Layout = require("../v1/layout/model.js");

// Relasi yang benar
Antrian.hasMany(Layout, { foreignKey: "id_antrian" });
Layout.belongsTo(Antrian, { foreignKey: "id_antrian" });

module.exports = { Antrian, Layout };
