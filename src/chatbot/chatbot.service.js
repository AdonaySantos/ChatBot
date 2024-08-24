const { myPhone } = require("../config/config");

let bookTime = [
  { horario: "8:00", status: "disponível" , ocupante: ""},
  { horario: "9:00", status: "disponível" , ocupante: ""},
];

let userContext = {}; // Armazena o estado dos usuários

function setTypeOfResponse(userPhoneNumber, msgLower, contactName) {
  if (userPhoneNumber === myPhone) {
    // Se o usuário for o administrador, chame adminResponse
    return adminResponse(msgLower);
  } else {
    // Se for um cliente, gerencie o contexto e responda apropriadamente
    if (!userContext[userPhoneNumber]) {
      userContext[userPhoneNumber] = { inBookingProcess: false }; // Inicializa o contexto do usuário
    }

    if (userContext[userPhoneNumber].inBookingProcess) {
      // Se o cliente estiver no processo de agendamento
      return handleBookingProcess(userPhoneNumber, msgLower);
    } else {
      return clientResponse(userPhoneNumber, msgLower, contactName);
    }
  }
}

function adminResponse(msgLower) {
  if (/^(oi|bom dia|olá|ola|bom|boa noite|boa tarde|menu)/.test(msgLower)) {
    return "Olá adm";
  } else {
    return "Comando não reconhecido para o administrador.";
  }
}

function clientResponse(userPhoneNumber, msgLower, contactName) {
  if (/^(oi|bom dia|olá|ola|bom|boa noite|boa tarde|menu)/.test(msgLower)) {
    return `Olá ${contactName}! Como posso te ajudar hoje?\n 1 - Agendar Horário \n 2 - Verificar Preços \n 3 - Nossa Unidade \n 4 - Nossas Redes Sociais`;
  } 
  else if (msgLower === "1" || msgLower.includes("agendar")) {
    userContext[userPhoneNumber].inBookingProcess = true; // Ativa o estado de agendamento
    return listAvailableTimes();
  } 
  else if (msgLower === "2" || msgLower.includes("preços") || msgLower.includes("preco")) {
    return "Aqui estão os nossos preços atualizados:\n- Serviço 1: R$XX,XX\n- Serviço 2: R$XX,XX\n- Serviço 3: R$XX,XX\nPara mais informações, visite nosso site ou entre em contato conosco.";
  } 
  else if (msgLower === "3" || msgLower.includes("unidade") || msgLower.includes("local")) {
    return "Nossa unidade está localizada na Rua Exemplo, 123, Bairro Exemplo, Cidade. Estamos abertos de segunda a sexta, das 08:00 às 18:00. Venha nos visitar!";
  } 
  else if (msgLower === "4" || msgLower.includes("redes sociais") || msgLower.includes("social")) {
    return "Siga-nos nas redes sociais para ficar por dentro de todas as novidades:\n- Instagram: [@seuinstagram]\n- Facebook: [facebook.com/seupagina]\n- Twitter: [@seutwitter]";
  } 
  else {
    return 'Desculpe, não entendi sua mensagem. Por favor, escolha uma das opções do menu ou digite "menu" para ver as opções novamente.';
  }
}

function handleBookingProcess(userPhoneNumber, msgLower) {
  if (/^\d+$/.test(msgLower) && bookTime[msgLower - 1]?.status === "disponível") {
    userContext[userPhoneNumber].inBookingProcess = false; // Sai do estado de agendamento
    return bookSelectedTime(msgLower - 1);
  } else {
    return 'Escolha um horário válido ou digite "menu" para voltar ao menu principal.';
  }
}

function listAvailableTimes() {
  let availableTimes = "Horários disponíveis:\n";
  bookTime.forEach((time, arrayPosition) => {
    if (time.status === "disponível") {
      availableTimes += `${arrayPosition + 1} - ${time.horario}\n`;
    }
  });

  if (availableTimes === "Horários disponíveis:\n") {
    return "Desculpe, todos os horários estão reservados no momento.";
  } else {
    return availableTimes + "Por favor, responda com o número do horário desejado.";
  }
}

function bookSelectedTime(arrayPosition) {
  if (bookTime[arrayPosition].status === "disponível") {
    bookTime[arrayPosition].status = "reservado";
    return `Horário as ${bookTime[arrayPosition].horario} reservado com sucesso!`;
  } else {
    return "Desculpe, esse horário já foi reservado. Por favor, escolha outro horário.";
  }
}

module.exports = {
  setTypeOfResponse,
}