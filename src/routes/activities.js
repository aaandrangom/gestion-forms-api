const express = require("express");
const RegistroActividadController = require("../controllers/RegistroActividades");
const router = express.Router();

router.get("/administrador/listar", RegistroActividadController.getAll);

module.exports = router;
