const Formulario = require("../models/Formulario");

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
      const { formname, description, status } = req.body;
      // Obtenemos el último formulario para determinar el templatename
      const ultimoFormulario = await Formulario.findOne({
        order: [["formid", "DESC"]],
      });
      let templatename = "template1"; // Por defecto, en caso de ser el primer formulario
      if (ultimoFormulario) {
        const ultimoFormid = ultimoFormulario.formid;
        const nuevoFormid = ultimoFormid + 1;
        templatename = "template" + nuevoFormid;
      }
      const newFormulario = await Formulario.create({
        templatename,
        formname,
        description,
        status,
        fields: null,
      });
      res.status(201).json(newFormulario);
    } catch (error) {
      res.status(500).send(error.message);
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
      const updated = await Formulario.update(
        { status: true },
        {
          where: { formid: id },
        }
      );
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

  async editStatusToFalse(req, res) {
    try {
      const { id } = req.params;
      const updated = await Formulario.update(
        { status: false },
        {
          where: { formid: id },
        }
      );
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

  async updateForm(req, res) {
    try {
      const { id } = req.params;
      const { templatename } = req.body;
      const updated = await Formulario.update(
        { templatename: templatename },
        {
          where: { formid: id },
        }
      );
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

  async updateFields(req, res) {
    try {
      const { id } = req.params;
      const { formname, description, fields } = req.body; // Aquí se obtienen los datos del formulario del cuerpo de la solicitud
      const [updatedCount] = await Formulario.update(
        { formname, description, fields }, // Aquí se actualizan los campos en la base de datos
        {
          where: { formid: id },
        }
      );
      if (updatedCount > 0) {
        const updatedFormulario = await Formulario.findByPk(id);
        if (updatedFormulario) {
          res.status(200).json(updatedFormulario);
        } else {
          res.status(404).send("Formulario no encontrado");
        }
      } else {
        res
          .status(404)
          .send("Formulario no encontrado o no se requirió actualización");
      }
    } catch (error) {
      console.error("Error al actualizar los campos del formulario:", error);
      res.status(500).send(error.message);
    }
  },
};

module.exports = { FormularioController, findFormByTemplateName };
