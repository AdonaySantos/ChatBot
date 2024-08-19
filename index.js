const express = require("express");
const twilio = require("twilio");
require("dotenv").config();

const myPhone = process.env.PHONE_NUMBER;

const contactList = {
  [myPhone]: "Adonay",
};

const app = express();
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("ChatBot!");
});

app.post("/sms", (req, res) => {
  // Obter a mensagem do usuário
  const msg = req.body.Body;
  const userPhoneNumber = req.body.From;
  const contactName = contactList[userPhoneNumber] || userPhoneNumber;

  // Criar uma resposta usando Twilio
  const MessagingResponse = twilio.twiml.MessagingResponse;
  const resp = new MessagingResponse();

  // Lógica básica para responder a mensagens
  const lowerMsg = msg.toLowerCase();

  function adminMenu() {
    if (/^(oi|bom dia|olá|ola|bom|boa noite|boa tarde|menu)/.test(lowerMsg)) {
      resp.message(`Olá adm`);
    }
    res.writeHead(200, { "Content-Type": "text/xml" });

    res.end(resp.toString());
  }

  function clientMenu() {
    if (/^(oi|bom dia|olá|ola|bom|boa noite|boa tarde|menu)/.test(lowerMsg)) {
      resp.message(
        `Olá ${contactName}! Como posso te ajudar hoje?\n 1 - Agendar Horário \n 2 - Verificar Preços \n 3 - Nossa Unidade \n 4 - Nossas Redes Sociais`
      );
    } else if (lowerMsg === "1" || lowerMsg.includes("agendar")) {
      resp.message(
        "Para agendar um horário, por favor, acesse nosso site em [seu-site.com/agendar] ou ligue para (XX) XXXX-XXXX. Estamos à disposição para atender suas necessidades."
      );
    } else if (
      lowerMsg === "2" ||
      lowerMsg.includes("preços") ||
      lowerMsg.includes("preco")
    ) {
      resp.message(
        "Aqui estão os nossos preços atualizados:\n- Serviço 1: R$XX,XX\n- Serviço 2: R$XX,XX\n- Serviço 3: R$XX,XX\nPara mais informações, visite nosso site ou entre em contato conosco."
      );
    } else if (
      lowerMsg === "3" ||
      lowerMsg.includes("unidade") ||
      lowerMsg.includes("local")
    ) {
      resp.message(
        "Nossa unidade está localizada na Rua Exemplo, 123, Bairro Exemplo, Cidade. Estamos abertos de segunda a sexta, das 08:00 às 18:00. Venha nos visitar!"
      );
    } else if (
      lowerMsg === "4" ||
      lowerMsg.includes("redes sociais") ||
      lowerMsg.includes("social")
    ) {
      resp.message(
        "Siga-nos nas redes sociais para ficar por dentro de todas as novidades:\n- Instagram: [@seuinstagram]\n- Facebook: [facebook.com/seupagina]\n- Twitter: [@seutwitter]"
      );
    } else {
      resp.message(
        'Desculpe, não entendi sua mensagem. Por favor, escolha uma das opções do menu ou digite "menu" para ver as opções novamente.'
      );
    }

    res.writeHead(200, { "Content-Type": "text/xml" });

    res.end(resp.toString());
  }

  if (userPhoneNumber === myPhone) {
    adminMenu();
  } else {
    clientMenu();
  }
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta http://localhost:3000");
});
