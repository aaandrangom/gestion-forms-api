const express = require("express");
const userController = require("../controllers/Usuarios");
const authenticateToken = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", userController.register);

router.post("/verificar", userController.verifyUser);

router.post("/autenticacion", userController.login);

router.post("/administrador", userController.registerAdmin);

module.exports = router;
