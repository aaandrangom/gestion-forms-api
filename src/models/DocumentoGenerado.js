// documentosgenerados.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

class DocumentoGenerado extends Model {}

DocumentoGenerado.init(
  {
    documentid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    responseid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    documentpath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdat: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "documentosgenerados",
    timestamps: false,
  }
);

module.exports = DocumentosGenerados;
