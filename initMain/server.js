const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const Codigo = require("../schemas/codigo.js");
const Codigo_ant = require("../schemas/codigo_antiguo.js");

// Middleware
module.exports = async () => {
  app.use(bodyParser.json());
  app.use(express.static(path.join(__dirname, '../extras/pagina'))); // Sirve archivos estáticos
  
  // Ruta para manejar solicitudes GET a la raíz
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../extras/pagina/index.html'));
  });
  
  // Iniciar servidor
  app.listen(3000, () => {
    console.log(`Servidor corriendo en http://localhost:3000`);
  });
  
  // Ruta para manejar el envío del código
  app.post("/code", async (req, res) => {
    const { code } = req.body;
    console.log("Código recibido:", code);

    try {
      
      // Buscar el código actual en la base de datos Codigo
      let existeCodigo = await Codigo.findOne({});

      // Si el código nuevo es igual al código existente
      if (existeCodigo && code === existeCodigo.code) {
        // Guardar el código actual en la base de datos Codigo_antiguo
        const nuevoCodigoAntiguo = new Codigo_ant({
          code_ant: existeCodigo.code,  // Guarda el código actual como "code_ant"
        });
        await nuevoCodigoAntiguo.save();

        // Actualizar la base de datos Codigo con el nuevo código
        await Codigo.findOneAndUpdate(
          { _id: existeCodigo._id }, // Buscar por el ID del código existente
          { $set: { code: code } },  // Establecer el nuevo código
          { new: true }
        );
      } else {
        // Si no hay un código o el código es diferente, crear o actualizar la base de datos Codigo
        if (existeCodigo) {
          // Actualizar el código existente
          await Codigo.findOneAndUpdate(
            { _id: existeCodigo._id },
            { $set: { code: code } },
            { new: true }
          );
        } else {
          // Crear un nuevo código si no existe
          const nuevoCodigo = new Codigo({
            code: code,
          });
          await nuevoCodigo.save();
        }
      }

      // Responder con un mensaje de éxito
      res.json({ message: "Código recibido correctamente. " + code });

    } catch (error) {
      console.error("Error al procesar el código:", error);
      res.status(500).json({ message: "Error interno del servidor." });
    }
  });
};
