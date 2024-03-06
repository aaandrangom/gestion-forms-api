const { object, string } = require("zod");

const createFormSchema = (formFields) => {
  const errors = [];

  const fieldSchemas = formFields.reduce(
    (acc, { nombreCampo, nombreLabel, tipo, validaciones }) => {
      let fieldSchema;
      switch (tipo) {
        case "number":
          fieldSchema = string()
            .refine(
              (val) => !isNaN(val.replace(",", ".")) && /^\d*,?\d+$/.test(val),
              {
                // Modificado para aceptar decimales con coma
                message: `${nombreLabel} debe ser un número válido`,
              }
            )
            .optional();
          break;
        case "string":
          fieldSchema = string().optional();
          break;
        default:
          throw new Error(`Tipo de campo no compatible: ${tipo}`);
      }
      if (validaciones) {
        if (validaciones.formato === "email") {
          fieldSchema = fieldSchema.refine(
            (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
            {
              message: `${nombreLabel} debe ser un correo electrónico válido`,
            }
          );
        }

        if (typeof validaciones.longitud !== "undefined") {
          fieldSchema = fieldSchema.refine(
            (val) => val.length >= validaciones.longitud,
            {
              message: `${nombreLabel} debe tener al menos ${validaciones.longitud} caracteres de longitud`,
            }
          );
        }

        // Aquí puedes agregar más validaciones para números con decimales que usan coma
      }

      acc[nombreCampo] = fieldSchema;
      return acc;
    },
    {}
  );

  return { schema: object(fieldSchemas).partial(), errors };
};

module.exports = {
  createFormSchema,
};
