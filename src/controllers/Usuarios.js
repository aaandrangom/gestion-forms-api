const bcrypt = require("bcryptjs");
const Usuario = require("../models/User");
const transporter = require("../config/mailConfig");
const generateVerificationCode = require("../utils/validations");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { cedula, nombres, apellidos, username, password, email } = req.body;

  try {
    const userExists = await Usuario.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).send("El correo electrónico ya está registrado.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateVerificationCode(6);

    const assignedRoleID = 2;

    const newUser = await Usuario.create({
      cedula,
      nombres,
      apellidos,
      username,
      passwordhash: hashedPassword,
      email,
      verificationcode: verificationCode,
      roleid: assignedRoleID,
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Verificación de tu cuenta",
      text: `Hola ${nombres} ${apellidos},\n\nGracias por registrarte. Por favor, verifica tu cuenta usando el siguiente código: ${verificationCode}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        res.status(500).send("Error al enviar el correo de verificación");
      } else {
        console.log("Correo de verificación enviado: " + info.response);
        res.status(201).json({
          message:
            "Usuario registrado. Por favor, verifica tu correo electrónico.",
          usuario: {
            cedula: newUser.cedula,
            nombres: newUser.nombres,
            apellidos: newUser.apellidos,
            username: newUser.username,
            email: newUser.email,
            roleid: newUser.roleid,
          },
        });
      }
    });
  } catch (error) {
    console.error("Error en el registro: ", error);
    res.status(500).send("Error al registrar el usuario");
  }
};

exports.verifyUser = async (req, res) => {
  const { email, verificationcode } = req.body;

  try {
    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    if (user.isverified) {
      return res
        .status(400)
        .send({ message: "Este usuario ya ha sido verificado." });
    }

    if (user.verificationcode === verificationcode) {
      user.isverified = true;
      await user.save();

      res.send({ message: "Cuenta verificada con éxito." });
    } else {
      res.status(400).send({ message: "Código de verificación incorrecto." });
    }
  } catch (error) {
    console.error("Error en la verificación: ", error);
    res.status(500).send({ message: "Error al verificar el usuario" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    if (!user.isverified) {
      return res
        .status(401)
        .send({ message: "Por favor, verifica tu correo electrónico." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordhash);
    if (!isMatch) {
      return res.status(401).send({ message: "Contraseña incorrecta." });
    }

    const token = jwt.sign(
      { userId: user.cedula, userRol: user.roleid },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.json({
      message: "Inicio de sesión exitoso.",
      user: user,
      token: token,
    });
  } catch (error) {
    console.error("Error en el inicio de sesión: ", error);
    res.status(500).send({ message: "Error al iniciar sesión" });
  }
};
