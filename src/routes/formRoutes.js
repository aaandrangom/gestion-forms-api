const express = require("express");
const { FormularioController } = require("../controllers/Formularios");
const router = express.Router();

router.get("/", FormularioController.list);
router.get("/:id", FormularioController.get);
router.post("/", FormularioController.create);
router.post("/template", FormularioController.getByTemplateName);
router.put("/:id", FormularioController.update);
router.delete("/:id", FormularioController.delete);

module.exports = router;
