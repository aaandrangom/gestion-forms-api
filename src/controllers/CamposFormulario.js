const fs = require("fs");
const path = require("path");

const archivoConfiguracion = path.join(
  __dirname,
  "../config/configuracionFormularios.json"
);

const FormulariosController = {
  leerConfiguracion: () => {
    return new Promise((resolve, reject) => {
      fs.readFile(archivoConfiguracion, (err, data) => {
        if (err) {
          return reject(err);
        }
        const configuracion = JSON.parse(data);
        resolve(configuracion || { formularios: { campos: [] } });
      });
    });
  },

  escribirConfiguracion: (configuracion) => {
    return new Promise((resolve, reject) => {
      fs.writeFile(
        archivoConfiguracion,
        JSON.stringify(configuracion, null, 2),
        (err) => {
          if (err) {
            return reject(err);
          }
          resolve();
        }
      );
    });
  },

  añadirFormulario: async (req, res) => {
    const nuevoFormulario = req.body;
    try {
      const configuracion = await FormulariosController.leerConfiguracion();
      if (
        !configuracion.formularios ||
        !Array.isArray(configuracion.formularios.campos)
      ) {
        configuracion.formularios = { campos: [] };
      }

      const campoExistente = configuracion.formularios.campos.find(
        (campo) => campo.nombreCampo === nuevoFormulario.nombreCampo
      );
      if (campoExistente) {
        return res
          .status(400)
          .send({ message: "El campo ya ha sido ingresado previamente" });
      }

      configuracion.formularios.campos.push(nuevoFormulario);

      await FormulariosController.escribirConfiguracion(configuracion);
      res.send({ message: "Formulario añadido con éxito" });
    } catch (err) {
      console.error({ message: "Error al gestionar el formulario:", err });
      res.status(500).send({ message: "Error interno del servidor" });
    }
  },

  obtenerDatosConfiguracion: async (req, res) => {
    try {
      const configuracion = await FormulariosController.leerConfiguracion();
      res.json(configuracion);
    } catch (err) {
      console.error({
        message: "Error al obtener datos de configuración:",
        err,
      });
      res.status(500).send({ message: "Error interno del servidor" });
    }
  },

  eliminarCampo: async (req, res) => {
    const nombreCampo = req.params.nombreCampo;
    try {
      let configuracion = await FormulariosController.leerConfiguracion();
      const campos = configuracion.formularios.campos;

      // Encontrar el índice del campo a eliminar
      const index = campos.findIndex(
        (campo) => campo.nombreCampo === nombreCampo
      );

      if (index === -1) {
        return res.status(404).send({ message: "Campo no encontrado" });
      }

      // Eliminar el campo del arreglo de campos
      campos.splice(index, 1);

      // Actualizar la configuración en el archivo
      await FormulariosController.escribirConfiguracion(configuracion);

      res.send({ message: "Campo eliminado exitosamente" });
    } catch (err) {
      console.error({ message: "Error al eliminar el campo:", err });
      res.status(500).send({ message: "Error interno del servidor" });
    }
  },
};

module.exports = FormulariosController;
