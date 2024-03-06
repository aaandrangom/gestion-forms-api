const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    return res.sendStatus(401);
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }

    req.user = user;
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
