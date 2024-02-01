const { Sequelize } = require("sequelize");
require("dotenv").config({ path: "./src/.env" });

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: "postgres",
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión a la base de datos establecida exitosamente.");
  })
  .catch((err) => {
    console.error("No se pudo conectar a la base de datos:", err);
  });

module.exports = sequelize;
