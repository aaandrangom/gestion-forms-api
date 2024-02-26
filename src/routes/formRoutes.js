const express = require("express");
const { FormularioController } = require("../controllers/Formularios");
const router = express.Router();

router.get("/", FormularioController.list);
router.get("/:id", FormularioController.get);
router.post("/administrador/crear", FormularioController.create);
router.post("/template", FormularioController.getByTemplateName);
router.put("/:id", FormularioController.update);
router.delete("/:id", FormularioController.delete);

router.get("/administrador/habilitados", FormularioController.findEnabled);
router.get("/administrador/deshabilitados", FormularioController.findDisabled);

router.put(
  "/administrador/habilitar/:id",
  FormularioController.editStatusToTrue
);

router.put(
  "/administrador/deshabilitar/:id",
  FormularioController.editStatusToFalse
);

router.put("/administrador/editar/:id", FormularioController.updateForm);

router.put(
  "/administrador/editar/campos/:id",
  FormularioController.updateFields
);

module.exports = router;
