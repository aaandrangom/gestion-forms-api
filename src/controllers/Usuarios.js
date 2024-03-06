const bcrypt = require("bcryptjs");
const Usuario = require("../models/User");
const transporter = require("../config/mailConfig");
const generateVerificationCode = require("../utils/validations");
const jwt = require("jsonwebtoken");
const RegistroActividad = require("../controllers/RegistroActividades");
const getIpAddress = require("../utils/getIpAddress");

exports.register = async (req, res) => {
  const { cedula, nombres, apellidos, username, password, email } = req.body;

  try {
    const userExists = await Usuario.findOne({ where: { email } });
    if (userExists) {
      const activityDetails = {
        cedula: "0",
        activitytype: "Registro de usuario fallido",
        description: `El usuario con email ${userExists.email} ya existe`,
        ipaddress: getIpAddress(req),
      };

      await RegistroActividad.create(req, res, activityDetails);
      return res
        .status(400)
        .send({ message: "El correo electrónico ya está registrado." });
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

    transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        res
          .status(500)
          .send({ message: "Error al enviar el correo de verificación" });
      } else {
        const activityDetails = {
          cedula: "0",
          activitytype: "Registro de usuario exitoso",
          description: `Se ha creado un usuario con la cedula: ${newUser.cedula}`,
          ipaddress: getIpAddress(req),
        };

        await RegistroActividad.create(req, res, activityDetails);

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
    res.status(500).send({ message: "Error al registrar el usuario" });
  }
};

exports.verifyUser = async (req, res) => {
  const { email, verificationcode } = req.body;

  try {
    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
      const activityDetails = {
        cedula: "0",
        activitytype: "Verificación de usuario fallida",
        description: `Usuario no encontrado: ${email}`,
        ipaddress: getIpAddress(req),
      };

      await RegistroActividad.create(req, res, activityDetails);
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    if (user.isverified) {
      const activityDetails = {
        cedula: user.cedula,
        activitytype: "Verificación de usuario fallida",
        description: `El usuario ${user.cedula} ya ha sido verificado`,
        ipaddress: getIpAddress(req),
      };

      await RegistroActividad.create(req, res, activityDetails);
      return res
        .status(400)
        .send({ message: "Este usuario ya ha sido verificado." });
    }

    if (user.verificationcode === verificationcode) {
      user.isverified = true;
      await user.save();

      const activityDetails = {
        cedula: user.cedula,
        activitytype: "Verificación de usuario exitosa",
        description: `El usuario ${user.username} ha sido verificado con éxito`,
        ipaddress: getIpAddress(req),
      };

      await RegistroActividad.create(req, res, activityDetails);

      res.send({ message: "Cuenta verificada con éxito." });
    } else {
      const activityDetails = {
        cedula: user.cedula,
        activitytype: "Verificación de usuario fallida",
        description: `El usuario ${user.email} ha ingresado el código de verficación incorrecto}`,
        ipaddress: getIpAddress(req),
      };

      await RegistroActividad.create(req, res, activityDetails);
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
      const activityDetails = {
        cedula: "0",
        activitytype: "Inicio de sesión fallido",
        description: `Usuario no encontrado: ${email}`,
        ipaddress: getIpAddress(req),
      };

      await RegistroActividad.create(req, res, activityDetails);

      return res.status(404).send({ message: "Credenciales incorrectas." });
    }

    if (!user.isverified) {
      const activityDetails = {
        cedula: user.cedula,
        activitytype: "Inicio de sesión fallido",
        description: "Usuario no verificado",
        ipaddress: getIpAddress(req),
      };

      await RegistroActividad.create(req, res, activityDetails);

      return res
        .status(401)
        .send({ message: "Por favor, verifica tu correo electrónico." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordhash);
    if (!isMatch) {
      const activityDetails = {
        cedula: user.cedula,
        activitytype: "Inicio de sesión fallido",
        description: "Contraseña incorrecta",
        ipaddress: getIpAddress(req),
      };

      await RegistroActividad.create(req, res, activityDetails);

      return res.status(401).send({ message: "Contraseña incorrecta." });
    }

    const token = jwt.sign(
      { userId: user.cedula, userRol: user.roleid },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const activityDetails = {
      cedula: user.cedula,
      activitytype: "Inicio de sesión exitoso",
      description: `El usuario ${user.username} ha iniciado sesión`,
      ipaddress: getIpAddress(req),
    };

    await RegistroActividad.create(req, res, activityDetails);

    res.json({
      message: "Inicio de sesión exitoso.",
      user,
      token,
    });
  } catch (error) {
    res.status(500).send({ message: "Error al iniciar sesión" });
  }
};

exports.registerAdmin = async (req, res) => {
  const {
    cedula,
    nombres,
    apellidos,
    username,
    password,
    email,
    emailAdministrador,
  } = req.body;

  try {
    const userExists = await Usuario.findOne({ where: { email } });
    const userAdministrador = await Usuario.findOne({
      where: { emailAdministrador },
    });

    if (userExists) {
      const activityDetails = {
        cedula: userAdministrador.cedula,
        activitytype: "Creación de usuario con rol administrador fallida",
        description: `El administrador ${userAdministrador.email} ha intentando crear un usuario administrador con un email ya existente: ${email}`,
        ipaddress: getIpAddress(req),
      };

      await RegistroActividad.create(req, res, activityDetails);
      return res
        .status(400)
        .send({ message: "El correo electrónico ya está registrado." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = generateVerificationCode(6);

    const assignedRoleID = 1;

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
      to: userAdministrador.email,
      subject: "Verificación de tu cuenta administrador",
      text: `Hola ${nombres} ${apellidos},\n\nGracias por registrarte. Por favor, verifica tu cuenta usando el siguiente código: ${verificationCode}`,
    };

    transporter.sendMail(mailOptions, async function (error, info) {
      if (error) {
        res
          .status(500)
          .send({ message: "Error al enviar el correo de verificación" });
      } else {
        const activityDetails = {
          cedula: userAdministrador.cedula,
          activitytype: "Creación de usuario con rol administrador exitosa",
          description: `El administrador ${userAdministrador.email} ha creado un usuario con el rol administrador: ${newUser.email}`,
          ipaddress: getIpAddress(req),
        };

        await RegistroActividad.create(req, res, activityDetails);
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
    res.status(500).send({ message: "Error al registrar el usuario" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    const resetToken = jwt.sign(
      { userId: user.cedula },
      process.env.JWT_RESET_SECRET,
      {
        expiresIn: "1h",
      }
    );

    user.resetpasswordtoken = resetToken;
    user.resetpasswordexpires = Date.now() + 3600000;
    await user.save();

    const resetPasswordLink = `http://localhost:4200/recuperar-contraseña?token=${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Recuperación de contraseña",
      text: `Hola ${user.nombres},\n\nPara restablecer tu contraseña, haz clic en el siguiente enlace:\n${resetPasswordLink}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        res.status(500).send({
          message: "Error al enviar el correo de recuperación de contraseña",
        });
      } else {
        res.status(200).json({
          message:
            "Se ha enviado un correo electrónico con las instrucciones para restablecer la contraseña.",
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      message: "Error al procesar la solicitud de recuperación de contraseña",
    });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    jwt.verify(token, process.env.JWT_RESET_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).send({
          message:
            "Token de restablecimiento de contraseña inválido o expirado.",
        });
      }

      const user = await Usuario.findOne({
        where: { resetpasswordtoken: token },
      });

      if (!user) {
        return res.status(404).send({ message: "Usuario no encontrado." });
      }

      if (user.resetpasswordexpires < Date.now()) {
        return res.status(403).send({
          message: "El token de restablecimiento de contraseña ha expirado.",
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.passwordhash = hashedPassword;
      user.resetpasswordtoken = null;
      user.resetpasswordexpires = null;
      await user.save();

      res
        .status(200)
        .send({ message: "La contraseña ha sido restablecida exitosamente." });
    });
  } catch (error) {
    res.status(500).send({ message: "Error al restablecer la contraseña." });
  }
};
