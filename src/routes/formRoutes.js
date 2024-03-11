const express = require("express");
const { FormularioController } = require("../controllers/Formularios");
const { authenticateToken } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", FormularioController.list);
router.get("/:id", FormularioController.get);

router.post(
  "/administrador/crear",
  authenticateToken,
  FormularioController.create
);

router.post("/template", FormularioController.getByTemplateName);
router.put("/:id", FormularioController.update);
router.delete("/:id", FormularioController.delete);

router.get(
  "/administrador/habilitados",
  authenticateToken,
  FormularioController.findEnabled
);
router.get(
  "/administrador/deshabilitados",
  authenticateToken,
  FormularioController.findDisabled
);

router.put(
  "/administrador/habilitar/:id",
  authenticateToken,
  FormularioController.editStatusToTrue
);

router.put(
  "/administrador/deshabilitar/:id",
  authenticateToken,
  FormularioController.editStatusToFalse
);

router.put(
  "/administrador/editar/:id",
  authenticateToken,
  FormularioController.updateForm
);

router.put(
  "/administrador/editar/campos/:id",
  authenticateToken,
  FormularioController.updateFields
);

router.delete(
  "/administrador/eliminar/:id",
  authenticateToken,
  FormularioController.delete
);

module.exports = router;
