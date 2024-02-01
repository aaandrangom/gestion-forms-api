const express = require("express");
const sequelize = require("./config/dbConfig");
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente!");
});

app.use("/api/usuario", userRoutes);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () =>
    console.log(`Servidor corriendo en el puerto ${PORT}`)
  );
});

module.exports = app;
