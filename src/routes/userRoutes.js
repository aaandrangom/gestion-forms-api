const express = require("express");
const userController = require("../controllers/Usuarios");
const {
  authenticateResetToken,
  authenticateToken,
} = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", userController.register);

router.post("/verificar", userController.verifyUser);

router.post("/autenticacion", userController.login);

router.post("/administrador", userController.registerAdmin);

router.post("/forgot-password", userController.forgotPassword);

router.post(
  "/reset-password",
  authenticateResetToken,
  userController.resetPassword
);

module.exports = router;
