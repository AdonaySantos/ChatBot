const { myPhone } = require("../config/config");

function generateResponse(userPhoneNumber, msg, contactName) {
  if (userPhoneNumber === myPhone) {
    return adminResponse(msg);
  } else {
    return clientResponse(msg, contactName);
  }
}

function adminResponse(msg) {
  if (/^(oi|bom dia|olá|ola|bom|boa noite|boa tarde|menu)/.test(msg)) {
    return "Olá adm";
  } else {
    return "Comando não reconhecido para o administrador.";
  }
}

function clientResponse(msg, contactName) {
  if (/^(oi|bom dia|olá|ola|bom|boa noite|boa tarde|menu)/.test(msg)) {
    return `Olá ${contactName}! Como posso te ajudar hoje?\n 1 - Agendar Horário \n 2 - Verificar Preços \n 3 - Nossa Unidade \n 4 - Nossas Redes Sociais`;
  } else if (msg === "1" || msg.includes("agendar")) {
    return "Para agendar um horário, por favor, acesse nosso site em [seu-site.com/agendar] ou ligue para (XX) XXXX-XXXX. Estamos à disposição para atender suas necessidades.";
  } else if (msg === "2" || msg.includes("preços") || msg.includes("preco")) {
    return "Aqui estão os nossos preços atualizados:\n- Serviço 1: R$XX,XX\n- Serviço 2: R$XX,XX\n- Serviço 3: R$XX,XX\nPara mais informações, visite nosso site ou entre em contato conosco.";
  } else if (msg === "3" || msg.includes("unidade") || msg.includes("local")) {
    return "Nossa unidade está localizada na Rua Exemplo, 123, Bairro Exemplo, Cidade. Estamos abertos de segunda a sexta, das 08:00 às 18:00. Venha nos visitar!";
  } else if (msg === "4" || msg.includes("redes sociais") || msg.includes("social")) {
    return "Siga-nos nas redes sociais para ficar por dentro de todas as novidades:\n- Instagram: [@seuinstagram]\n- Facebook: [facebook.com/seupagina]\n- Twitter: [@seutwitter]";
  } else {
    return 'Desculpe, não entendi sua mensagem. Por favor, escolha uma das opções do menu ou digite "menu" para ver as opções novamente.';
  }
}

module.exports = {
  generateResponse,
};
