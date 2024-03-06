const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join("./src/templates/"));
    console.log("Destination Path:", path.join(__dirname, "../templates/"));
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname;
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
}).single("file");

const FileUploadController = {
  getAllPlantillas(req, res) {
    const templatesPath = path.join(__dirname, "../templates");
    fs.readdir(templatesPath, (err, files) => {
      if (err) {
        console.error("Error al leer el directorio de plantillas:", err);
        return res
          .status(500)
          .json({ error: "Error al obtener las plantillas" });
      }

      const plantillas = files.filter((file) => file.endsWith(".docx"));

      res.status(200).json({ plantillas });
    });
  },

  uploadFile(req, res) {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: "Error al subir el archivo" });
      }
      const cedula = req.body.cedula;
      console.log("Otro Campo:", cedula);

      res.status(200).json({ message: "Archivo subido exitosamente" });
    });
  },

  updateFile(req, res) {
    const nombreArchivoActual = req.params.fileName;
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ error: err.message });
      } else if (err) {
        return res
          .status(500)
          .json({ error: "Error al actualizar el archivo" });
      }

      const nuevoNombreArchivo = req.file.filename;

      const rutaArchivoActual = path.join(
        "./src/templates/",
        nombreArchivoActual
      );
      const rutaNuevoArchivo = path.join(
        "./src/templates/",
        nuevoNombreArchivo
      );

      // Verifica si el archivo actual existe
      if (fs.existsSync(rutaArchivoActual)) {
        // Elimina el archivo actual si existe
        fs.unlinkSync(rutaArchivoActual);
      }

      // Renombra el nuevo archivo
      fs.renameSync(rutaNuevoArchivo, rutaArchivoActual);
      res.setHeader("Cache-Control", "no-store"); // Deshabilitar la caché

      res.status(200).json({ message: "Archivo actualizado exitosamente" });
    });
  },

  deleteFile(req, res) {
    const fileName = req.params.fileName;
    const filePath = path.join("./src/templates/", fileName);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.status(200).json({ message: "Archivo eliminado exitosamente" });
    } else {
      res.status(404).json({ error: "El archivo no existe" });
    }
  },
};

module.exports = FileUploadController;
