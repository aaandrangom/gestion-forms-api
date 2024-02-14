const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

class Formulario extends Model {}

Formulario.init(
  {
    formid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    templatename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    formname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    createdat: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedat: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    fields: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "formularios",
    timestamps: false,
  }
);

module.exports = Formulario;
