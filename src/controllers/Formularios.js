const Formulario = require("../models/Formulario");

async function findFormByTemplateName(templatename) {
  try {
    const formulario = await Formulario.findOne({
      where: { templatename: templatename },
    });
    return formulario; // Devuelve el formulario encontrado o null si no se encuentra.
  } catch (error) {
    console.error(
      "Error al buscar el formulario por nombre de plantilla:",
      error
    );
    throw error; // Lanza el error para manejarlo en un nivel superior.
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
      const newFormulario = await Formulario.create(req.body);
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
};

// Exporta tanto FormularioController como findFormByTemplateName
module.exports = { FormularioController, findFormByTemplateName };
