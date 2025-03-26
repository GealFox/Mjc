// netlify/functions/sendNotification.js

const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  console.log("sendNotification invocada, event.body:", event.body);
  try {
    const { accion, titulo, imagenUrl } = JSON.parse(event.body);

    let mensaje = "";
    switch (accion) {
      case "create":
        mensaje = `¡No te pierdas esta noticia! ${titulo}. Haz clic para ver las novedades.`;
        break;
      case "update":
        mensaje = `Se ha actualizado la noticia: ${titulo}. Haz clic para ver las novedades.`;
        break;
      case "delete":
        mensaje = `Se eliminó una noticia. Revisa las novedades en comunidad.`;
        break;
      default:
        mensaje = `Notificación para: ${titulo}`;
    }

    const requestBody = {
      app_id: "62485058-7374-4bb6-bce4-34f0b06e3925",
      included_segments: ["All"],
      headings: { "en": "Nuevas Noticias en MJC", "es": "Nuevas Noticias en MJC" },
      contents: { "en": mensaje, "es": mensaje },
      url: "https://www.comunidadmjc.com.ar",
      // Se asigna la URL de la imagen si se envió, o se deja vacía
      chrome_web_image: imagenUrl || ""
    };

    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        // Asegúrate de que esta sea tu REST API Key correcta.
        "Authorization": "Basic os_v2_app_mjefawdtorf3nphegtyla3rzevyz3inqj5oeyhuevllztpmyltstypbi7y5omcklsgqc6zfpax7zmymikbads7mbt2wqmtwezhqfazy"
      },
      body: JSON.stringify(requestBody)
    });

    const result = await response.json();
    console.log("Resultado de sendNotification:", result);
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };

  } catch (error) {
    console.error("Error en sendNotification:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error al enviar la notificación" })
    };
  }
};
