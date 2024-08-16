const express = require('express');
const twilio = require('twilio');

const contactList = {
    '+5511966118189' : 'Adonay'
}

const app = express();
app.use(express.urlencoded({ extended: true }));

function initialMessage(userPhoneNumber){
    const MessagingResponse = twilio.twiml.MessagingResponse;
    const resp = new MessagingResponse();
    const contactName =  contactList[userPhoneNumber] || userPhoneNumber;

    resp.message(`Olá ${contactName}! Parece que você está offline. Se precisar de algo, estou aqui para ajudar!`);
};

app.post('/sms', (req, res) => {
    // Obter a mensagem do usuário
    const msg = req.body.Body;
    const userPhoneNumber = req.body.From;

    if (userTimers[userPhoneNumber]) {
        clearTimeout(userTimers[userPhoneNumber]);
    }

    // Criar uma resposta usando Twilio
    const MessagingResponse = twilio.twiml.MessagingResponse;
    const resp = new MessagingResponse();

    // Lógica básica para responder a mensagens
    if (msg.toLowerCase().includes('oi')) {
        resp.message('Olá! Como posso ajudá-lo hoje?');
    } else if (msg.toLowerCase().includes('preço')) {
        resp.message('Nosso preço depende dos serviços que você precisa. Por favor, descreva o que você precisa.');
    } else {
        resp.message('Desculpe, não entendi sua mensagem. Você pode reformular?');
    }

    userTimers[userPhoneNumber] = setTimeout(() =>initialMessage(userPhoneNumber), 10000);

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(resp.toString());
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
