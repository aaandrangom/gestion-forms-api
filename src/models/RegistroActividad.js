const { Model, DataTypes } = require("sequelize");
const moment = require("moment-timezone");
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
      defaultValue: () => {
        const userTimezone = "America/Guayaquil";
        return moment().tz(userTimezone).format();
      },
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
