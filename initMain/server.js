const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const CodigosTelegram = require("../schemas/CodigosTelegram");

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
      let existeCodigo = await CodigosTelegram.findOne({});

      // Si el código nuevo es igual al código existente
      if (existeCodigo && code === existeCodigo.codigoNuevo) {
        // Guardar el código actual en la base de datos Codigo_antiguo
        const nuevoCodigoAntiguo = new CodigosTelegram({
          codigoAntiguo: existeCodigo.codigoNuevo,  // Guarda el código actual como "code_ant"
        });
        await nuevoCodigoAntiguo.save();

        // Actualizar la base de datos Codigo con el nuevo código
        await CodigosTelegram.findOneAndUpdate(
          { _id: existeCodigo._id }, // Buscar por el ID del código existente
          { $set: { codigoNuevo: code } },  // Establecer el nuevo código
          { new: true }
        );
      } else {
        // Si no hay un código o el código es diferente, crear o actualizar la base de datos Codigo
        if (existeCodigo) {
          // Actualizar el código existente
          await CodigosTelegram.findOneAndUpdate(
            { _id: existeCodigo._id },
            { $set: { codigoNuevo: code } },
            { new: true }
          );
        } else {
          // Crear un nuevo código si no existe
          const nuevoCodigo = new CodigosTelegram({
            codigoNuevo: code,
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
