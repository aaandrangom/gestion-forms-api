const express = require("express");
const FormulariosController = require("../controllers/CamposFormulario");
const router = express.Router();

router.post("/", FormulariosController.añadirFormulario);
router.get("/", FormulariosController.obtenerDatosConfiguracion);
router.delete("/:nombreCampo", FormulariosController.eliminarCampo);

module.exports = router;
