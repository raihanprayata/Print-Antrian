const { DataTypes } = require("sequelize");
const sequelize = require("../../../utils/config");

const Layout = sequelize.define(
  "tbl_layout",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    id_antrian: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tbl_antrian",
        key: "id",
      },
    },
    urutan: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM("text", "image", "antrian", "line"),
      allowNull: false,
    },
    size_font: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nama: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
  }
);

module.exports = Layout;
