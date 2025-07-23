## Bot de Discord para el Curso de FP de SMR 🤖💻

¡Bienvenido al bot de Discord diseñado especialmente para el curso de Sistema Microinformático y Redes (SMR)! Este bot proporciona una variedad de funciones útiles relacionadas con el ámbito de la informática y redes. A continuación, encontrarás información detallada sobre los comandos disponibles y cómo utilizarlos.

## Configuración del Bot 🛠️

Antes de utilizar el bot, asegúrate de seguir estos pasos para configurar correctamente las credenciales:

### 1. Token de Discord:

- Obtén el token de tu bot de Discord siguiendo estos pasos:
  1. Ve a [https://discord.com/developers/applications](https://discord.com/developers/applications).
  2. Crea una nueva aplicación y, dentro de ella, un nuevo bot.
  3. Copia el token del bot y reemplaza `process.env.BOT_TOKEN` en el código del bot con tu token.

   ```javascript
   // Ejemplo en el código del bot (index.js):
   client.login('TU_TOKEN_AQUÍ');
   ```
### 2. Base de Datos en MongoDB:

- Asegúrate de tener una base de datos en MongoDB y sigue estos pasos:
  1. Crea una cuenta en https://www.mongodb.com/cloud/atlas si no tienes una.
  2. Crea un clúster y configura una base de datos para tu bot.
  3. Obtén la URL de conexión y reemplaza process.env.MONGODB_URI en el código del bot con tu URL.
  ```javascript
  // Ejemplo en el código del bot (mongo.js):
  const mongoose = require('mongoose');
  mongoose.connect('TU_URL_DE_CONEXIÓN_A_MONGODB_AQUÍ', { useNewUrlParser: true, useUnifiedTopology: true });
  ```
  **Nota:** No compartas tus credenciales ni información sensible. Manténlas seguras y actualizadas según sea necesario.
  
## Instrucciones de Uso 📘

### Comando de Creación de Canales (/canal)

- Utiliza el comando `/canal` para generar canales exclusivos y evitar interrupciones durante el uso del bot.

## Licencia 📜

Este bot está protegido bajo la siguiente licencia:

**Licencia Propietaria de [Pablo Arjonilla Cuadrado] (versión 1.2, [15/08/2024])**

1. **Uso no Comercial:** Este bot no puede ser utilizado con fines comerciales bajo ninguna circunstancia.

2. **No Modificación:** No está permitido modificar, descompilar ni realizar ingeniería inversa sobre ninguna parte del código fuente o archivos asociados al bot.

3. **No Distribución:** No está permitido compartir, distribuir ni hacer pública ninguna parte del código fuente o archivos asociados al bot.

4. **Atribución:** Cualquier uso autorizado del bot debe incluir una clara atribución al creador original, Pablo Arjonilla.

**Nota:** La licencia puede ser actualizada en futuras versiones del bot. Consulta siempre la última versión de la licencia antes de utilizar el bot.

## Nota Importante 📢

Este bot se ha diseñado con el propósito de facilitar el aprendizaje y la práctica de conceptos relacionados con el curso de SMR. Asegúrate de utilizarlo de manera responsable y en concordancia con las normas del servidor.

**¡Diviértete explorando y aprendiendo con nuestro bot de Discord para el curso de FP de SMR! 🚀✨**