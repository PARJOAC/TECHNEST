const {
  ActivityType,
  EmbedBuilder,
  Events,
  AttachmentBuilder,
} = require("discord.js");
const Ofertas = require("../../mongoDB/ofertas");
const Huelgas = require("../../mongoDB/huelgas");
const {
  busquedaMensaje,
  telegramClientInit,
} = require("../../initMain/handlerTelegram");
const axios = require("axios");
const cheerio = require("cheerio");
const moment = require("moment-timezone");
const fs = require("fs");
const config = require("../../initMain/config.json");

module.exports = {
  name: Events.ClientReady,
  once: true,
  async execute(client) {

    console.log(`Sesión iniciada en el bot ${client.user.tag}!`);
    client.user.setActivity(`🔥🔥🔥🔥`, {
      type: ActivityType.Custom,
    });

    let telegram = await telegramClientInit();

    setInterval(async () => {
      try {
        const mensaje = await busquedaMensaje(telegram);

        if (!mensaje) return;

        const lastOfert = await Ofertas.findOne({}); // Busca la última oferta guardada
        const lastOfertId = mensaje.id;

        if (lastOfert && lastOfert.idOferta == lastOfertId) return; // Ya se procesó este mensaje

        if (lastOfert) {
          lastOfert.idOferta = lastOfertId; // Actualiza el último ID procesado
          await lastOfert.save();
        } else {
          await new Ofertas({ idOferta: lastOfertId }).save(); // Crea nueva oferta si no existe
        }

        const timestamp = mensaje.date * 1000;
        const timestampAjustado = moment(timestamp).add(5, 'hours');

        const fecha = timestampAjustado.format("DD/MM/YYYY");
        const hora = timestampAjustado.format("HH:mm");

        const channel = client.channels.cache.get(config.ofertasCanal);

        if (mensaje.media && mensaje.media.photo) {
          try {
            const archivoBytes = await telegram.downloadMedia(mensaje.media);
            const imagePath = "./initMain/images/imagenOferta.jpg";
            await fs.promises.writeFile(imagePath, archivoBytes);

            const attachment = new AttachmentBuilder(imagePath);
            await channel.send({
              embeds: [
                new EmbedBuilder()
                  .setTitle("🔥 ¡Nueva oferta disponible! 🔥")
                  .setDescription(`${mensaje.message}`)
                  .setColor("Red")
                  .setImage('attachment://imagenOferta.jpg')
                  .setTimestamp()
                  .setFooter({
                    text: "Oferta del día " + fecha + " a las " + hora,
                    iconURL: client.user.displayAvatarURL(),
                  }),
              ],
              files: [attachment],
            });
          } catch (err) {
            console.error("Error al descargar la imagen:", err);
          }
        } else {
          await channel.send({
            embeds: [
              new EmbedBuilder()
                .setTitle("🔥 ¡Nueva oferta disponible! 🔥")
                .setDescription(`${mensaje.message}`)
                .setColor("Red")
                .setTimestamp()
                .setFooter({
                  text: "Oferta del día " + fecha + " a las " + hora,
                  iconURL: client.user.displayAvatarURL(),
                }),
            ],
          });
        }
      } catch (error) {
        console.error("Error en la verificación/envío de ofertas:", error);
      }
    }, 5000);

    setInterval(async () => {
      try {
        const response = await axios.get(
          "https://www.sindicatodeestudiantes.net/index.php/noticias/movimiento-estudiantil"
        );
        const $ = cheerio.load(response.data);

        const huelga_texto = $(".card-body .card-title a").first();
        const titulo = huelga_texto.text().trim();
        const enlace = huelga_texto.attr("href");
        const huelga_imagen = $(".card a img").first();
        const imagen = huelga_imagen.attr("src");

        const huelga_p = $(".card-body .article-index-wrap p").eq(1);
        const p = huelga_p.text().trim();

        let lastHuelga = await Huelgas.findOne({}).exec();

        if (!lastHuelga) {
          lastHuelga = new Huelgas({
            tituloUltimaHuelga: "",
          });
          await lastHuelga.save();
        }

        if (lastHuelga.tituloUltimaHuelga !== titulo) {
          const trimmedUrl = imagen.split(".jpg")[0] + ".jpg";

          const channel = client.channels.cache.get(config.huelgasCanal);
          await channel.send({
            embeds: [
              new EmbedBuilder()
                .setTitle(
                  "📩 ¡Sindicato de estudiantes ha enviado un mensaje! 📩"
                )
                .setDescription(`**${titulo}**\n\n${p}\n`)
                .setColor("Red")
                .setAuthor({
                  name: "Sindicato de estudiantes",
                  iconURL:
                    "https://www.sindicatodeestudiantes.net//favicon-32x32.png",
                  url: "https://www.sindicatodeestudiantes.net",
                })
                .setTimestamp()
                .setThumbnail(
                  `https://www.sindicatodeestudiantes.net//favicon-32x32.png`
                )
                .setURL(`https://www.sindicatodeestudiantes.net${enlace}`)
                .setImage(`https://www.sindicatodeestudiantes.net/${trimmedUrl}`),
            ],
          });

          lastHuelga.tituloUltimaHuelga = titulo;
          await lastHuelga.save();
        }
      } catch (error) {
        console.error("Error en la función de intervalo:", error);
      }
    }, 10000);

  },
};