const { TelegramClient } = require("telegram");
const { StoreSession } = require("telegram/sessions");
const storeSession = new StoreSession("./telegram/");
//const CodigosTelegram = require("../schemas/CodigosTelegram");
const input = require("input");
// Función para esperar hasta que un nuevo código sea diferente o esté disponible (página web)
/*
const waitForNewCode = async () => {
  let nuevoCodigo = null;

  // Bucle que espera hasta que un código esté disponible
  while (true) {
    await new Promise((resolve) => setTimeout(resolve, 10000)); // Espera 5 segundos
    nuevoCodigo = await CodigosTelegram.findOne({});

    // Si el código existe, rompe el bucle
    if (nuevoCodigo && nuevoCodigo.codigoNuevo) {
      console.log("Nuevo código encontrado:", nuevoCodigo.codigoNuevo);
      break;
    }
  }

  return nuevoCodigo;
};
*/
const telegramClientInit = async () => {
  console.log(
    "Iniciando sesión en Telegram, esperando el código de verificación..."
  );

  // Inicializar el cliente de Telegram
  const telegram = new TelegramClient(
    storeSession,
    20285890,
    process.env.API_HASH_TEL,
    {
      connectionRetries: 5,
    }
  );

  await telegram.start({
    phoneNumber: async () => process.env.NUM_TEL,
    password: async () => process.env.PASSWORD_TEL,

    // Esta función se llamará cuando Telegram pida el código de verificación cuando no se pueda escribir por consola
    /*phoneCode: async () => {
      console.log("Esperando que llegue el nuevo código...");
      // Esperar hasta que el código esté disponible en la base de datos
      const existeCodigo = await waitForNewCode();
      const codeFromUser = String(existeCodigo.codigoNuevo); // Asegúrate de que sea una cadena

      // Guardar el código anterior en la base de datos Codigo_ant
      const nuevoCodigoAntiguo = new CodigosTelegram({
        codigoAntiguo: codeFromUser, // Guardar el código actual como "code_ant"
      });
      await nuevoCodigoAntiguo.save();

      // Actualizar el código en la base de datos Codigo con el nuevo código
      await nuevoCodigoAntiguo.findOneAndUpdate(
        { _id: existeCodigo._id }, // Buscar el código actual por su ID
        { $set: { codigoNuevo: codeFromUser } }, // Establecer el nuevo código
        { new: true }
      );

      return codeFromUser; // Devolver el código de verificación para Telegram
    },
*/
    phoneCode: async () => input.text("Escribe el código de verificación: "),
    onError: async (e) => console.log(e),
  });

  console.log(
    "Servicio de Telegram iniciado: " + (await telegram.getMe()).username
  );

  return telegram;
};

const busquedaMensaje = async (telegram) => {
  const groupId = "@OfertasSensatas";

  // Obtener los últimos 5 mensajes
  const mensajes = await telegram.getMessages(groupId, { limit: 5 });
  // Filtrar los mensajes que son válidos (clase Message y contienen texto)
  const mensajeFiltrado = mensajes.filter(
    (m) =>
      m.className === "Message" &&
      m.classType === "constructor" &&
      m.message &&
      m.message.length > 0
  );

  // Obtener el mensaje más reciente
  const mensajeMasReciente = mensajeFiltrado.sort((a, b) => b.date - a.date)[0];

  if (!mensajeMasReciente) {
    console.log("No se encontraron mensajes recientes.");
    return;
  }

  return mensajeMasReciente;
};

module.exports = {
  telegramClientInit,
  busquedaMensaje,
};
