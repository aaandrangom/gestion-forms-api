const RegistroActividades = require("../models/RegistroActividad");

const RegistroActividadController = {
  async create(req, res, activityDetails) {
    try {
      const newActivity = await RegistroActividades.create(activityDetails);
      return newActivity;
    } catch (error) {
      console.error("Error al crear el registro de actividad:", error);
      throw new Error("Error interno del servidor");
    }
  },

  async getAll(req, res) {
    try {
      const allActivities = await RegistroActividades.findAll();
      res.json(allActivities);
    } catch (error) {
      console.error("Error al obtener los registros de actividad:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },
};
module.exports = RegistroActividadController;
