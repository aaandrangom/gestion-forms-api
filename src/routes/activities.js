const express = require("express");
const RegistroActividadController = require("../controllers/RegistroActividades");
const router = express.Router();
const { authenticateToken } = require("../middleware/authMiddleware");

router.get(
  "/administrador/listar",
  authenticateToken,
  RegistroActividadController.getAll
);

module.exports = router;
