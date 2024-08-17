const express = require('express');
const twilio = require('twilio');
const bodyParser = require('body-parser');

constProcedimento = require('./classes/procedimento/procedimento');
constHorario = require('./classes/horario/horario');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const phoneBook = {
    "whatsapp:+5511966118189": "Adonay"
};

app.post('/sms', (req, res) => {
    let msgRetorno = '\nDigite "Menu" para voltar ao início';

    let values = '';

    let procedimentos = [
        new Procedimento("Corte Cabelo", "R$30,00"),
        new Procedimento("Design Sobrancelha", "R$10,00"),
        new Procedimento("Corte Barba", "R$15,00"),
        new Procedimento("Freestyle", "R$10,00")
    ];

    let horarios = [
        new Horario("8:00", "disponível"),
        new Horario("9:00", "disponível"),
        new Horario("10:00", "disponível"),
        new Horario("11:00", "disponível"),
        new Horario("12:00", "disponível"),
        new Horario("13:00", "disponível"),
        new Horario("14:00", "disponível"),
        new Horario("15:00", "disponível"),
        new Horario("16:00", "disponível"),
        new Horario("17:00", "disponível"),
        new Horario("18:00", "disponível")
    ];

    let incomingMsg = (req.body.Body || '').toLowerCase();
    let fromNumber = req.body.From || '';
    letMessagingResponse = twilio.twiml.MessagingResponse;
    let resp = newMessagingResponse();
    let msg = resp.message();

    let name = phoneBook[fromNumber] || "Amigo";

    let response;

    if (incomingMsg.includes('oi')) {
        response = `Olá ${name}! Como posso te ajudar hoje?\n 1 - Agendar Horário \n 2 - Verificar Preços \n 3 - Nossa Unidade \n 4 - Nossas Redes Sociais`;
    } else if (incomingMsg.includes('1')) {
        values = horarios.map(h => h.toString()).join('\n');
        response = `Temos os seguintes horários disponíveis: \n${values}${msgRetorno}`;
    } else if (incomingMsg.includes('2')) {
        values = procedimentos.map(p => p.toString()).join('\n');
        response = `Temos os seguintes procedimentos disponíveis: \n${values}${msgRetorno}`;
    } else if (incomingMsg.includes('3')) {
        response = 'Nossa unidade se encontra no endereço:\n\n Rua Queluz, Jardim Santo Antonio da Padua 77';
    } else if (incomingMsg.includes('4')) {
        response = 'Nosso Instagram: \n\n https://www.instagram.com/leoprobarber/';
    } else if (incomingMsg.includes('tchau')) {
        response = "Até mais! Tenha um bom dia!";
    } else if (incomingMsg.includes('marcar horário')) {
        response = "Horários disponíveis: 1:00";
    } else {
        response = 'Desculpe, não entendi sua mensagem. Digite "Menu" para ver opções?';
    }

    msg.body(response);
    res.set('Content-Type', 'text/xml');
    res.send(resp.toString());
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});