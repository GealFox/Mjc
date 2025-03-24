const fetch = require("node-fetch");

exports.handler = async function(event, context) {
  try {
    const body = JSON.parse(event.body);
    const { accion, titulo } = body;

    let mensaje = "";
    if (accion === "create") {
      mensaje = `¡No te pierdas esta noticia! ${titulo}. Haz clic para ver las novedades.`;
    } else if (accion === "update") {
      mensaje = `Se ha actualizado la noticia: ${titulo}. Haz clic para ver las novedades.`;
    } else if (accion === "delete") {
      mensaje = `Se eliminó una noticia. Revisa las novedades en comunidad.`;
    }

    const requestBody = {
      app_id: "62485058-7374-4bb6-bce4-34f0b06e3925",
      included_segments: ["All"],
      headings: { "es": "Nuevas Noticias en MJC" },
      contents: { "es": mensaje },
      url: "https://www.comunidadmjc.com.ar"
    };

    const response = await fetch("https://onesignal.com/api/v1/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": "Basic yz3inqj5oeyhuevllztpmylts"
      },
      body: JSON.stringify(requestBody)
    });

    const result = await response.json();
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
