const express = require("express");
const DocumentController = require("../controllers/Documentos");
const ImageController = require("../controllers/Imagenes");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    console.log("Request recibida:", req.body); // Mejor práctica para evitar mostrar información sensible o extensa
    await DocumentController.generate(req, res);
  } catch (error) {
    console.error("Error en DocumentController.generate:", error);
    if (!res.headersSent) {
      // Verifica si ya se enviaron encabezados para evitar errores de "Cannot set headers after they are sent to the client"
      res.status(500).send("Error interno del servidor");
    }
  }
});
router.post("/imagen", ImageController.upload);

module.exports = router;
