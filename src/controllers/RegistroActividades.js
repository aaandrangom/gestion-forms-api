const RegistroActividades = require("../models/RegistroActividad");

const RegistroActividadController = {
  async create(req, res, activityDetails) {
    try {
      const newActivity = await RegistroActividades.create(activityDetails);
      return newActivity;
    } catch (error) {
      res.status(500).json({ message: "Intentar más tarde" });
    }
  },

  async getAll(req, res) {
    try {
      const allActivities = await RegistroActividades.findAll({
        order: [["activityid", "DESC"]],
      });
      res.json(allActivities);
    } catch (error) {
      res.status(500).json({ message: "Intentar más tarde" });
    }
  },
};
module.exports = RegistroActividadController;
