const multer = require("multer");
const fs = require("fs");
const path = require("path");

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join("./src/images/");
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    const sanitizedBasename = basename.replace(/[^a-zA-Z0-9]/g, "-");
    const newFilename = `${sanitizedBasename}-${uniqueSuffix}${extension}`;
    cb(null, newFilename);
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
