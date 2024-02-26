const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join("./src/images/");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const uploadImage = upload.single("image");

const ImageController = {
  upload(req, res) {
    uploadImage(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(500).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({
          error: "No se pudo cargar el archivo por un error desconocido.",
        });
      }

      // Verificar si req.file está definido
      if (!req.file) {
        return res.status(400).json({
          message: "No se proporcionó ninguna imagen.",
        });
      }

      console.log("Archivo cargado:", req.file.path);
      return res.status(200).json({
        message: "Archivo cargado con éxito",
        filePath: req.file.path,
        fileName: req.file.filename,
      });
    });
  },
};

module.exports = ImageController;
