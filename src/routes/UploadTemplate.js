const express = require("express");
const FileUploadController = require("../controllers/SubirPlantilla");
const router = express.Router();

router.post("/administrador/subir", FileUploadController.uploadFile);
router.put(
  "/administrador/actualizar/:fileName",
  FileUploadController.updateFile
);
router.delete(
  "/administrador/actualizar/:fileName",
  FileUploadController.deleteFile
);

router.get("/administrador/listar", FileUploadController.getAllPlantillas);

module.exports = router;
