const { myPhone } = require("../config/config");
const client = require("./client.service/client")
const admin = require("./admin.service/admin")

function setTypeOfResponse(user) {
  // if (user.userPhoneNumber === myPhone) {
    // Se o usuário for o administrador, chame adminResponse
    // return admin.response(user);
  // } else {
    // Se for um cliente, gerencie o contexto e responda apropriadamente
    if (!client.userContext[user]) {
      client.userContext[user] = { inBookingProcess: false }; // Inicializa o contexto do usuário
    }

    if (client.userContext[user].inBookingProcess) {
      // Se o usere estiver no processo de agendamento
      return client.handleBookingProcess(user);
    } else {
      return client.response(user);
    }

  // }
}

module.exports = {
  setTypeOfResponse,
}