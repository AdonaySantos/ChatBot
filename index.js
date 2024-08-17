const express = require('express');
const twilio = require('twilio');

const contactList = {
    '+5511966118189' : 'Adonay'
}

const app = express();
app.use(express.urlencoded({ extended: true }));

app.post('/sms', (req, res) => {
    // Obter a mensagem do usuário
    const msg = req.body.Body;
    const userPhoneNumber = req.body.From;
    const contactName =  contactList[userPhoneNumber] || userPhoneNumber;

    // Criar uma resposta usando Twilio
    const MessagingResponse = twilio.twiml.MessagingResponse;
    const resp = new MessagingResponse();

    // Lógica básica para responder a mensagens
    if (msg.toLowerCase().includes('oi')) {
        resp.message(`Olá ${contactName}! Como posso ajudá-lo hoje?`);
    } else if (msg.toLowerCase().includes('preço')) {
        resp.message('Nosso preço depende dos serviços que você precisa. Por favor, descreva o que você precisa.');
    } else {
        resp.message('Desculpe, não entendi sua mensagem. Você pode reformular?');
    }

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(resp.toString());
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
