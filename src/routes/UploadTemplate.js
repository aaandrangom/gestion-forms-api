const express = require("express");
const FileUploadController = require("../controllers/SubirPlantilla");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");

router.post(
  "/administrador/subir",
  authenticateToken,
  FileUploadController.uploadFile
);
router.put(
  "/administrador/actualizar/:fileName",
  authenticateToken,
  FileUploadController.updateFile
);
router.delete(
  "/administrador/eliminar/:fileName",
  authenticateToken,
  FileUploadController.deleteFile
);

router.get(
  "/administrador/listar",
  authenticateToken,
  FileUploadController.getAllPlantillas
);

module.exports = router;
