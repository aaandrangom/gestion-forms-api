const express = require("express");
const DocumentController = require("../controllers/Documentos");
const ImageController = require("../controllers/Imagenes");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    await DocumentController.generate(req, res);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).send("Error interno del servidor");
    }
  }
});
router.post("/imagen", ImageController.upload);

module.exports = router;
