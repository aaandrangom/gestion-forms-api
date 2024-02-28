const Formulario = require("../models/Formulario");
const RegistroActividad = require("../controllers/RegistroActividades");
const Usuario = require("../models/User");
const getIpAddress = require("../utils/getIpAddress");

async function findFormByTemplateName(templatename) {
  try {
    const formulario = await Formulario.findOne({
      where: { templatename: templatename },
    });
    return formulario;
  } catch (error) {
    console.error(
      "Error al buscar el formulario por nombre de plantilla:",
      error
    );
    throw error;
  }
}

const FormularioController = {
  async list(req, res) {
    try {
      const formularios = await Formulario.findAll({
        where: { status: true },
        order: [["formid", "ASC"]],
      });
      res.json(formularios);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  async findEnabled(req, res) {
    try {
      const formularios = await Formulario.findAll({
        where: { status: true },
        order: [["formid", "ASC"]],
      });

      res.json(formularios);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  async findDisabled(req, res) {
    try {
      const formularios = await Formulario.findAll({
        where: { status: false },
        order: [["formid", "ASC"]],
      });

      res.json(formularios);
    } catch (err) {
      res.status(500).send(err.message);
    }
  },

  async get(req, res) {
    try {
      const { id } = req.params;
      const formulario = await Formulario.findByPk(id);
      if (formulario) {
        res.json(formulario);
      } else {
        res.status(404).send("Formulario no encontrado");
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  async getByTemplateName(req, res) {
    try {
      const { templatename } = req.body;
      const formulario = await findFormByTemplateName(templatename);
      if (formulario) {
        res.json(formulario);
      } else {
        res.status(404).send("Formulario no encontrado");
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  async create(req, res) {
    try {
      const { formname, description, status, cedula } = req.body;

      // Buscar usuario por cedula
      const user = await Usuario.findOne({ where: { cedula } });
      if (!user) {
        return res.status(404).send("Usuario no encontrado");
      }

      // Obtener el último formulario para generar el nombre del template
      const ultimoFormulario = await Formulario.findOne({
        order: [["formid", "DESC"]],
      });
      let templatename = "template1"; // Valor predeterminado si es el primer formulario
      if (ultimoFormulario) {
        const ultimoFormid = ultimoFormulario.formid;
        const nuevoFormid = ultimoFormid + 1;
        templatename = "template" + nuevoFormid;
      }

      // Crear el nuevo formulario
      const newFormulario = await Formulario.create({
        templatename,
        formname,
        description,
        status,
        fields: null,
      });

      // Detalles de la actividad
      const activityDetails = {
        cedula: user.cedula,
        activitytype: "Formulario creado",
        description: `Se ha creado un formulario con el nombre ${newFormulario.formname}`,
        ipaddress: getIpAddress(req),
      };

      const response = {
        message: "Formulario creado con éxito",
        form: newFormulario,
      };

      // Crear registro de actividad
      await RegistroActividad.create(req, res, activityDetails);

      return res.status(201).json(response);
    } catch (error) {
      console.error("Error al crear el formulario:", error);
      return res.status(500).send("Error interno del servidor");
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const updated = await Formulario.update(req.body, {
        where: { formid: id },
      });
      if (updated) {
        const updatedFormulario = await Formulario.findByPk(id);
        res.status(200).json(updatedFormulario);
      } else {
        res.status(404).send("Formulario no encontrado");
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await Formulario.destroy({
        where: { formid: id },
      });
      if (deleted) {
        res.status(204).send("Formulario eliminado");
      } else {
        res.status(404).send("Formulario no encontrado");
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  async editStatusToTrue(req, res) {
    try {
      const { id } = req.params;
      const { cedula } = req.body;
      console.log(cedula);
      const user = await Usuario.findOne({ where: { cedula } });
      if (!user) {
        return res.status(404).send("Usuario no encontrado");
      }

      const beforeForm = await Formulario.findByPk(id);
      if (!beforeForm) {
        return res.status(404).send("Formulario no encontrado");
      }

      // Actualizar el estado del formulario a verdadero
      const [updatedCount, [updatedFormulario]] = await Formulario.update(
        { status: true },
        { where: { formid: id }, returning: true }
      );

      if (updatedCount > 0) {
        const activityDetails = {
          cedula: user.cedula,
          activitytype: "Formulario actualizado con éxito",
          description: `El formulario con el ID ${beforeForm.formid} y nombre ${beforeForm.formname} ha sido habilitado`,
          ipaddress: getIpAddress(req),
        };

        const response = {
          message: "Formulario habilitado con éxito",
          form: updatedFormulario,
        };

        // Crear registro de actividad
        await RegistroActividad.create(req, res, activityDetails);

        return res.status(200).json(response);
      } else {
        return res.status(404).send("Formulario no encontrado");
      }
    } catch (error) {
      console.error("Error al habilitar el formulario:", error);
      return res.status(500).send("Error interno del servidor");
    }
  },

  async editStatusToFalse(req, res) {
    try {
      const { id } = req.params;
      const { cedula } = req.body;

      const user = await Usuario.findOne({ where: { cedula } });
      if (!user) {
        return res.status(404).send("Usuario no encontrado");
      }

      // Buscar formulario por ID
      const beforeForm = await Formulario.findByPk(id);
      if (!beforeForm) {
        return res.status(404).send("Formulario no encontrado");
      }

      // Actualizar el estado del formulario a falso
      const [updatedCount, [updatedFormulario]] = await Formulario.update(
        { status: false },
        { where: { formid: id }, returning: true }
      );

      if (updatedCount > 0) {
        const activityDetails = {
          cedula: user.cedula,
          activitytype: "Formulario actualizado con éxito",
          description: `El formulario con el ID ${beforeForm.formid} y nombre ${beforeForm.formname} ha sido deshabilitado`,
          ipaddress: getIpAddress(req),
        };

        const response = {
          message: "Formulario deshabilitado con éxito",
          form: updatedFormulario,
        };

        // Crear registro de actividad
        await RegistroActividad.create(req, res, activityDetails);

        return res.status(200).json(response);
      } else {
        return res.status(404).send("Formulario no encontrado");
      }
    } catch (error) {
      console.error("Error al deshabilitar el formulario:", error);
      return res.status(500).send("Error interno del servidor");
    }
  },

  async updateForm(req, res) {
    try {
      const { id } = req.params;
      const { templatename, cedula } = req.body;

      // Buscar usuario por cedula
      const user = await Usuario.findOne({ where: { cedula } });
      if (!user) {
        return res.status(404).send("Usuario no encontrado");
      }

      // Actualizar el formulario
      const [updatedCount, [updatedFormulario]] = await Formulario.update(
        { templatename },
        { where: { formid: id }, returning: true }
      );

      if (updatedCount > 0) {
        const activityDetails = {
          cedula: user.cedula,
          activitytype: "Formulario actualizado con éxito",
          description: `El formulario con el ID ${id} ha sido actualizado`,
          ipaddress: getIpAddress(req),
        };

        const response = {
          message: "Formulario actualizado con éxito",
          form: updatedFormulario,
        };

        // Crear registro de actividad
        await RegistroActividad.create(req, res, activityDetails);
        return res.status(200).json(response);
      } else {
        return res.status(404).send("Formulario no encontrado");
      }
    } catch (error) {
      console.error("Error al actualizar el formulario:", error);
      return res.status(500).send("Error interno del servidor");
    }
  },

  async updateFields(req, res) {
    try {
      const { id } = req.params;
      const { formname, description, fields, cedula } = req.body;

      // Buscar usuario por cedula
      const user = await Usuario.findOne({ where: { cedula } });
      if (!user) {
        return res.status(404).send("Usuario no encontrado");
      }

      // Actualizar los campos del formulario
      const [updatedCount] = await Formulario.update(
        { formname, description, fields },
        { where: { formid: id } }
      );

      if (updatedCount > 0) {
        const updatedFormulario = await Formulario.findByPk(id);
        if (updatedFormulario) {
          const activityDetails = {
            cedula: user.cedula,
            activitytype: "Formulario actualizado con éxito",
            description: `Se actualizaron los campos del formulario con el ID ${id}`,
            ipaddress: getIpAddress(req),
          };

          const response = {
            message: "Formulario actualizado con éxito",
            form: updatedFormulario,
          };

          // Crear registro de actividad
          await RegistroActividad.create(req, res, activityDetails);
          return res.status(200).json(response);
        } else {
          return res.status(404).send("Formulario no encontrado");
        }
      } else {
        return res
          .status(404)
          .send("Formulario no encontrado o no se requirió actualización");
      }
    } catch (error) {
      console.error("Error al actualizar los campos del formulario:", error);
      return res.status(500).send("Error interno del servidor");
    }
  },
};

module.exports = { FormularioController, findFormByTemplateName };
