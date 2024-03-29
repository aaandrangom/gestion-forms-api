// respuestasformularios.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");
const Formulario = require("../models/Formulario");

class RespuestasFormulario extends Model {}

RespuestasFormulario.init(
  {
    responseid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cedula: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    formid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    responsedata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    submittedat: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "respuestasformularios",
    timestamps: false,
  }
);

RespuestasFormulario.belongsTo(Formulario, { onDelete: "CASCADE" });

module.exports = RespuestasFormulario;
