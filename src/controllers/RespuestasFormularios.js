const RespuestaFormulario = require("../models/RespuestaFormulario");

const RespuestaFormularioController = {
  async list(req, res) {
    try {
      const respuestas = await RespuestaFormulario.findAll();
      res.json(respuestas);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  async get(req, res) {
    try {
      const { id } = req.params;
      const respuesta = await RespuestaFormulario.findByPk(id);
      if (respuesta) {
        res.json(respuesta);
      } else {
        res.status(404).send("Respuesta no encontrada");
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  async getResponsesByCedulaAndFormId(req, res) {
    try {
      const { cedula, formid } = req.body;
      const respuesta = await RespuestaFormulario.findOne({
        where: { cedula: cedula, formid: formid },
        order: [["submittedat", "DESC"]], // Ordenar por ID de manera descendente
      });

      if (respuesta) {
        res.json(respuesta);
      } else {
        res.status(404).send("Respuestas no encontradas");
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  async create(req, res) {
    try {
      const newRespuesta = await RespuestaFormulario.create(req.body);
      res.status(201).json(newRespuesta);
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const updated = await RespuestaFormulario.update(req.body, {
        where: { responseid: id },
      });
      if (updated) {
        const updatedRespuesta = await RespuestaFormulario.findByPk(id);
        res.status(200).json(updatedRespuesta);
      } else {
        res.status(404).send("Respuesta no encontrada");
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      const deleted = await RespuestaFormulario.destroy({
        where: { responseid: id },
      });
      if (deleted) {
        res.status(204).send("Respuesta eliminada");
      } else {
        res.status(404).send("Respuesta no encontrada");
      }
    } catch (error) {
      res.status(500).send(error.message);
    }
  },
};

module.exports = RespuestaFormularioController;
