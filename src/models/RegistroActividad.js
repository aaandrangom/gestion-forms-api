const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

class RegistroActividad extends Model {}

RegistroActividad.init(
  {
    activityid: {
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
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    ipaddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "registroactividades",
    timestamps: false,
  }
);

module.exports = RegistroActividad;
