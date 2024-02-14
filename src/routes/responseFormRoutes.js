const express = require("express");
const RespuestaFormularioController = require("../controllers/RespuestasFormularios");
const router = express.Router();

router.get("/", RespuestaFormularioController.list);
router.get("/:id", RespuestaFormularioController.get);
router.post("/", RespuestaFormularioController.create);
router.post(
  "/formulario",
  RespuestaFormularioController.getResponsesByCedulaAndFormId
);
router.put("/:id", RespuestaFormularioController.update);
router.delete("/:id", RespuestaFormularioController.delete);

module.exports = router;
