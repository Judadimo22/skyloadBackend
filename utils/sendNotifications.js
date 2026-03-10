const admin = require("../firebase");

const sendNotification = async (token, title, body, data = {}) => {
  try {
    const message = {
        token: token,
        notification: {
            title: title,
            body: body
        },
        data: data
    };

    const response = await admin.messaging().send(message);
    console.log("Notificación enviada:", response);
  } catch (error) {
    console.error("Error enviando notificación:", error);
  }
};

module.exports = sendNotification;