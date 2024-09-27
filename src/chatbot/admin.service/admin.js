const { bookingDays } = require("../client.service/client");

let userContext = {};

function response(user) {
  const menuOptions = {
    1() {
      return viewAllReservations();
    },
    2() {
      userContext[user].removingReservation = "selectingReserve";
      return viewAllReservations() + " Por favor, responda com o número da reserva que deseja remover.";
    },
  };

  const msgResponseOptions = menuOptions[user.msgLower]; // Corrigido o nome para menuOptions
  if (msgResponseOptions) {
    return msgResponseOptions();
  } else if (
    /^(oi|bom dia|olá|ola|bom|boa noite|boa tarde|menu)/.test(user.msgLower)
  ) {
    return "Olá adm! Aqui estão suas opções:\n1 - Ver todas as reservas\n2 - Remover reserva\nPor favor, escolha uma opção.";
  } else {
    return "Desculpe, não entendi sua mensagem. Por favor, escolha uma das opções do menu (por exemplo '1') ou digite 'menu' para ver as opções novamente.";
  }
}

function viewAllReservations() {
  let reservations = "Reservas feitas:\n";
  const currentTime = new Date(); // Obtém o tempo atual
  let reservationCount = 0; // Contador para numerar as reservas

  bookingDays.forEach((day) => {
    day.hours.forEach((hour) => {
      if (hour.status === "reservado") {
        // Extrai a data no formato DD/MM/YYYY
        const [dayPart, monthPart, yearPart] = day.date.split('/');
        const [hourPart, minutePart] = hour.horario.split(":");

        // Cria um objeto de data e hora completo para a reserva
        const reservationTime = new Date(yearPart, monthPart - 1, dayPart, hourPart, minutePart);

        // Verifica se a reserva é futura
        if (reservationTime > currentTime) {
          reservationCount++;
          reservations += `- ${reservationCount} - ${day.date} às ${hour.horario}: ${hour.ocupante}\n`;
        }
      }
    });
  });

  if (reservationCount === 0) {
    return "Nenhuma reserva futura foi feita até o momento.";
  } else {
    return reservations;
  }
}


// Função para o administrador remover a reserva de um usuário
function removeReservation(user) {
  const context = userContext[user];

  if (context.removingReservation === "selectingReserve") {
    const reserveIndex = parseInt(user.msgLower) - 1; // Ajusta o índice para começar de 0

    // Verifica se o índice está dentro do intervalo das reservas
    if (reserveIndex < 0) {
      return "Número da reserva inválido. Por favor, escolha um número válido.";
    }

    let foundReservation = false;

    // Itera sobre os dias e horas para encontrar e remover a reserva correta
    let count = 0;
    for (let dayIndex = 0; dayIndex < bookingDays.length; dayIndex++) {
      const day = bookingDays[dayIndex];

      for (let hourIndex = 0; hourIndex < day.hours.length; hourIndex++) {
        const hour = day.hours[hourIndex];

        if (hour.status === "reservado") {
          if (count === reserveIndex) {
            hour.status = "disponível"; // Remove a reserva
            hour.ocupante = ""; // Limpa o ocupante
            foundReservation = true;
            break; // Sai do loop ao encontrar e remover a reserva
          }
          count++; // Incrementa o contador apenas para reservas
        }
      }

      if (foundReservation) {
        break; // Sai do loop de dias se a reserva foi encontrada e removida
      }
    }

    if (foundReservation) {
      // Limpa o contexto após remover a reserva
      context.removingReservation = null;
      return "Reserva removida com sucesso!";
    } else {
      return "Reserva não encontrada. Por favor, escolha um número de reserva válido.";
    }
  }

  return "Nenhuma operação de remoção em andamento.";
}

module.exports = {
  response,
  removeReservation,
  userContext,
};
