let userContext = {}; // Armazena o estado dos usuários

let availableHours = [
  { horario: "8:00", status: "disponível", ocupante: "" },
  { horario: "9:00", status: "disponível", ocupante: "" },
];

let bookingDays = Array.from({ length: 30 }, (_, i) => {
  const today = new Date();
  const date = new Date(today.setDate(today.getDate() + i));

  const day = date.getDate() + 1;
  const month = date.getMonth() + 1; // Months are zero-indexed in JS
  const year = date.getFullYear();

  return {
    date: `${day}/${month}/${year}`,
    status: "available",
    hours: availableHours.map((hour) => ({ ...hour })),
  };
});

function response(user) {
  const menuOptions = {
    1() {
      userContext[user].inBookingProcess = "selectingDay"; // Ativa o estado de escolha do dia
      return listAvailableDays();
    },
    2() {
      return "Aqui estão os nossos preços atualizados:\n- Serviço 1: R$XX,XX\n- Serviço 2: R$XX,XX\n- Serviço 3: R$XX,XX\nPara mais informações, visite nosso site ou entre em contato conosco.";
    },
    3() {
      return "Nossa unidade está localizada na Rua Exemplo, 123, Bairro Exemplo, Cidade. Estamos abertos de segunda a sexta, das 08:00 às 18:00. Venha nos visitar!";
    },
    4() {
      return "Siga-nos nas redes sociais para ficar por dentro de todas as novidades:\n- Instagram: [@seuinstagram]\n- Facebook: [facebook.com/seupagina]\n- Twitter: [@seutwitter]";
    },
  };

  const msgResponseOptions = menuOptions[user.msgLower];
  if (msgResponseOptions) {
    return msgResponseOptions();
  } else if (/^(oi|bom dia|olá|ola|bom|boa noite|boa tarde|menu)/.test(user.msgLower)) {
    return `Olá ${user.contactName}! Como posso te ajudar hoje?\n 1 - Agendar Horário \n 2 - Verificar Preços \n 3 - Nossa Unidade \n 4 - Nossas Redes Sociais.\nPor favor, responda com o número da opção desejada.`;
  } else {
    return "Desculpe, não entendi sua mensagem. Por favor, escolha uma das opções do menu ou digite 'menu' para ver as opções novamente.";
  }
}

function listAvailableDays() {
  let availableDays = "Dias disponíveis para agendamento:\n";
  bookingDays.forEach((day, index) => {
    if (day.status === "available") {
      availableDays += `${index + 1} - ${day.date}\n`;
    }
  });

  return (availableDays + "Por favor, responda com o número do dia desejado.");
}

function handleBookingProcess(user) {
  const context = userContext[user];
  
  if (context.inBookingProcess === "selectingDay") {
    const dayIndex = parseInt(user.msgLower) - 1;
    if (bookingDays[dayIndex]?.status === "available") {
      context.selectedDay = dayIndex;
      context.inBookingProcess = "selectingHour"; // Passa para a escolha de horário
      return listAvailableTimes(dayIndex);
    } else {
      return 'Escolha um dia válido ou digite "menu" para voltar ao menu principal.';
    }
  } else if (context.inBookingProcess === "selectingHour") {
    const hourIndex = parseInt(user.msgLower) - 1;
    const selectedDay = bookingDays[context.selectedDay];
    
    if (selectedDay.hours[hourIndex]?.status === "disponível") {
      context.inBookingProcess = false; // Sai do estado de agendamento
      return bookSelectedTime(context.selectedDay, hourIndex, user.contactName);
    } else {
      return 'Escolha um horário válido ou digite "menu" para voltar ao menu principal.';
    }
  } else {
    return 'Escolha uma opção válida ou digite "menu" para voltar ao menu principal.';
  }
}

function listAvailableTimes(dayIndex) {
  let availableTimes = `Horários disponíveis para o dia ${bookingDays[dayIndex].date}:\n`;
  bookingDays[dayIndex].hours.forEach((time, index) => {
    if (time.status === "disponível") {
      availableTimes += `${index + 1} - ${time.horario}\n`;
    }
  });

  if (availableTimes === `Horários disponíveis para o dia ${bookingDays[dayIndex].date}:\n`) {
    return "Desculpe, todos os horários estão reservados para este dia.";
  } else {
    return (availableTimes + "Por favor, responda com o número do horário desejado.");
  }
}

function bookSelectedTime(dayIndex, hourIndex, name) {
  const selectedDay = bookingDays[dayIndex];
  const selectedHour = selectedDay.hours[hourIndex];

  if (selectedHour.status === "disponível") {
    selectedHour.status = "reservado";
    selectedHour.ocupante = name;

    const allBooked = selectedDay.hours.every(hour => hour.status === "reservado")

    if (allBooked){
      selectedDay.status = "fullBooked"
    }

    return `Horário das ${selectedHour.horario} do dia ${selectedDay.date} reservado com sucesso!`;
  } else {
    return "Desculpe, esse horário já foi reservado. Por favor, escolha outro horário.";
  }
}

module.exports = {
  response,
  handleBookingProcess,
  listAvailableDays,
  listAvailableTimes,
  bookSelectedTime,
  userContext,
};