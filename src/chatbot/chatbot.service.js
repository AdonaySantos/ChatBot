const { myPhone } = require("../config/config");
const client = require("./client.service/client");
const admin = require("./admin.service/admin");

function setTypeOfResponse(user) {
  // Verifica se o usuário é o administrador
  if (user.userPhoneNumber === myPhone) {
    if (!admin.userContext[user]) {
      admin.userContext[user] = { removingReservation: false }; // Inicializa o contexto do usuário
    }

    if (admin.userContext[user] && admin.userContext[user].removingReservation) {
      return admin.removeReservation(user);
    } else {
      // Se o usuário for o administrador, chame adminResponse
      return admin.response(user);
    }
  } else {
    // Se for um cliente, gerencie o contexto e responda apropriadamente
    if (!client.userContext[user]) {
      client.userContext[user] = { inBookingProcess: false }; // Inicializa o contexto do usuário
    }

    if (client.userContext[user].inBookingProcess) {
      // Se o usuário estiver no processo de agendamento
      return client.handleBookingProcess(user);
    } else {
      return client.response(user);
    }
  }
}

module.exports = {
  setTypeOfResponse,
};