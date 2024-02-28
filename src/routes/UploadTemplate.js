const express = require("express");
const FileUploadController = require("../controllers/SubirPlantilla");
const router = express.Router();

router.post("/administrador/subir", FileUploadController.uploadFile);

module.exports = router;
