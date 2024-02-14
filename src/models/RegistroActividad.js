const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

class RegistroActividad extends Model {}

RegistroActividad.init(
  {
    actividadid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cedula: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    activitytype: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    ipaddress: {
      type: DataTypes.STRING,
    },
    additionalinfo: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    modelName: "registroactividades",
    timestamps: false,
  }
);

module.exports = RegistroActividades;
