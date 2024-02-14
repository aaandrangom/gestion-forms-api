const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/dbConfig");

class Roles extends Model {}

Roles.init(
  {
    roleid: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    rolename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "roles",
    timestamps: false,
  }
);

module.exports = Roles;
