const { myPhone } = require("../config/config");
const service = require("./chatbot.service");
const twilio = require("twilio");

const contactList = {
  [myPhone]: "Adonay",
};

function create(req, res) {
  const { Body: message, From: userPhoneNumber } = req.body;
  const msg = message.toLowerCase();
  const contactName = contactList[userPhoneNumber] || userPhoneNumber;

  const MessagingResponse = twilio.twiml.MessagingResponse;
  const resp = new MessagingResponse();

  const responseMessage = service.generateResponse(
    userPhoneNumber,
    msg,
    contactName
  );
  resp.message(responseMessage);

  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(resp.toString());
}

module.exports = {
  create,
};
