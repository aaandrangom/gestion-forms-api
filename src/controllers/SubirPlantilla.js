const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join("./src/templates/"));
    console.log("Destination Path:", path.join(__dirname, "../templates/"));
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname;
    console.log("Filename:", fileName);
    cb(null, fileName);
  },
});

const upload = multer({
  storage: storage,
}).single("file");

const FileUploadController = {
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
};

module.exports = FileUploadController;
