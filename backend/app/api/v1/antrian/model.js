const { DataTypes } = require("sequelize");
const sequelize = require("../../../utils/config");

const Antrian = sequelize.define("tbl_antrian", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  nama_antrian: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  freezeTableName: true
});

module.exports = Antrian;
