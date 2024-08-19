const express = require('express');
const twilio = require('twilio');

const contactList = {
    'whatsapp:+5511966118189' : 'Adonay'
}

const app = express();
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('ChatBot!')
});

app.post('/sms', (req, res) => {
    // Obter a mensagem do usuário
    const msg = req.body.Body;
    const userPhoneNumber = req.body.From;
    const contactName =  contactList[userPhoneNumber] || userPhoneNumber;

    // Criar uma resposta usando Twilio
    const MessagingResponse = twilio.twiml.MessagingResponse;
    const resp = new MessagingResponse();

    // Lógica básica para responder a mensagens
    if (msg.toLowerCase().msg.match(/oi.*/, /bom dia.*/, /boa noite.*/, /boa tarde.*/, /menu.*/)) {
        resp.message(`Olá ${contactName}! Como posso te ajudar hoje?\n 1 - Agendar Horário \n 2 - Verificar Preços \n 3 - Nossa Unidade \n 4 - Nossas Redes Sociais`);
    } else if (msg.toLowerCase().includes('1')) {
        resp.message('');
    } else if (msg.toLowerCase().includes('2')) {
        resp.message('');
    } else if (msg.toLowerCase().includes('3')) {
        resp.message('');
    } else if (msg.toLowerCase().includes('4')) {
        resp.message('');
    } else {
        resp.message('Desculpe, não entendi sua mensagem. Você pode reformular?');
    }

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(resp.toString());
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta http://localhost:3000');
});
