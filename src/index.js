const express = require("express");
const sequelize = require("./config/dbConfig");
const userRoutes = require("./routes/userRoutes");
const formularioRoutes = require("./routes/formRoutes");
const respuestaFormularioRoutes = require("./routes/responseFormRoutes");
const documentRoutes = require("./routes/documentRoutes");
const camposFormulario = require("./routes/fieldsForm");
const SubirPlantilla = require("./routes/UploadTemplate");
const registroActividad = require("./routes/activities");

const cors = require("cors");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:4200" }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente!");
});

app.use("/api/usuario", userRoutes);
app.use("/api/formulario", formularioRoutes);
app.use("/api/respuesta", respuestaFormularioRoutes);
app.use("/api/documento", documentRoutes);
app.use("/api/campos", camposFormulario);
app.use("/api/plantillas", SubirPlantilla);
app.use("/api/actividades", registroActividad);

const PORT = process.env.PORT || 3000;

sequelize.sync().then(() => {
  app.listen(PORT, () =>
    console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`)
  );
});

module.exports = app;
