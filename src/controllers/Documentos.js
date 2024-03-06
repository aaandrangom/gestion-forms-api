const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
const fs = require("fs");
const path = require("path");
const ImageModule = require("docxtemplater-image-module-free");
const { format, parseISO } = require("date-fns");
const { es } = require("date-fns/locale");
const { findFormByTemplateName } = require("../controllers/Formularios");
const { createFormSchema } = require("../utils/validationCamposFormulario");
const jsonData = fs.readFileSync(
  path.join(__dirname, "../config/configuracionFormularios.json"),
  "utf8"
);
const { formularios } = JSON.parse(jsonData);

const { schema: formSchema, errors } = createFormSchema(formularios.campos);

const generateDocument = (data, templatePath, imagePath) => {
  const content = fs.readFileSync(path.resolve(templatePath), "binary");
  const zip = new PizZip(content);

  const opts = {
    centered: false,
    getImage: function (tagValue, tagName) {
      if (fs.existsSync(tagValue)) {
        return fs.readFileSync(tagValue);
      }
      return null;
    },
    getSize: function (img, tagValue, tagName) {
      return [100, 75];
    },
  };
  const imageModule = new ImageModule(opts);

  const doc = new Docxtemplater(zip, {
    modules: [imageModule],
    paragraphLoop: true,
    linebreaks: true,
  });

  if (imagePath !== null) {
    data.logo = imagePath;
  }

  doc.setData(data);

  try {
    doc.render();
  } catch (error) {
    const e = {
      message: error.message,
      name: error.name,
      stack: error.stack,
      properties: error.properties,
    };
    console.error(JSON.stringify({ error: e }));
    throw error;
  }

  return doc.getZip().generate({ type: "nodebuffer" });
};

const DocumentController = {
  async generate(req, res) {
    try {
      const formData = req.body;
      const templateName = formData.templateKey;
      const formTemplate = await findFormByTemplateName(templateName);

      if (!formTemplate) {
        return res.status(400).send("Plantilla no encontrada");
      }

      const templatePath = `./src/templates/${formTemplate.formname}.docx`;

      const imagePath = formData.imagePath
        ? `./src/images/${formData.imagePath}`
        : null;
      const formattedFecha = formData.fecha
        ? format(parseISO(formData.fecha), "dd 'de' MMMM 'del' yyyy", {
            locale: es,
          })
        : null;

      const processedData = {
        ...formData,
        fecha: formattedFecha,
        logo: imagePath,
      };

      const validationResult = formSchema.safeParse(processedData);

      if (!validationResult.success) {
        return res.status(400).json({
          success: false,
          message: "Error de validación",
          errors: validationResult.error.errors.map((error) => ({
            campo: error.path.join("."),
            mensaje: error.message,
          })),
        });
      }

      const documentBuffer = generateDocument(
        processedData,
        templatePath,
        imagePath
      );

      const dateStr = new Date().toISOString().slice(0, 10);
      const fileName = `${templateName}_${dateStr}.docx`;
      res.setHeader("Content-Disposition", `attachment; filename=${fileName}`);
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      );
      res.send(documentBuffer);
    } catch (error) {
      console.error("Error al generar el documento:", error);
      if (!res.headersSent) {
        if (error.issues) {
          return res.status(400).json({
            success: false,
            message: "Error de validación",
            errors: error.issues.map((issue) => issue.message),
          });
        }
        res.status(500).send("Error interno del servidor");
      }
    }
  },
};

module.exports = DocumentController;
