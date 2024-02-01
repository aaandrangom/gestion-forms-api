const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

class Usuario extends Model {}

Usuario.init(
  {
    cedula: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    nombres: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellidos: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passwordhash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    roleid: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    isverified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verificationcode: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "usuarios",
    timestamps: false,
  }
);

module.exports = Usuario;
