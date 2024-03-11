const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    console.log("Token no proporcionado en la solicitud");
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      console.log(token);
      console.error("Error al verificar el token:", err);
      return res.sendStatus(403);
    }

    const userRole = decodedToken.userRol;
    console.log("Token decodificado:", decodedToken);
    console.log("Rol:", userRole);

    if (userRole !== 1) {
      console.log("Usuario no autorizado para acceder a esta ruta");
      return res
        .status(403)
        .json({ message: "No tienes permiso para acceder a esta ruta." });
    }

    console.log("Usuario autorizado, permitiendo acceso a la ruta");
    next();
  });
};

const authenticateResetToken = (req, res, next) => {
  if (!req) {
    return res.status(500).send("Error: Request object not provided.");
  }

  const resetToken = req.query.token;

  if (!resetToken) {
    return res
      .status(401)
      .send("Token de restablecimiento de contraseña no proporcionado.");
  }

  jwt.verify(resetToken, process.env.JWT_RESET_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .send("Token de restablecimiento de contraseña inválido o expirado.");
    }

    req.user = user;
    next();
  });
};

module.exports = { authenticateToken, authenticateResetToken };
