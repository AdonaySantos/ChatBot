const chatbotRouter = require("./chatbot/chatbot.router");
const express = require("express");

function main() {
  const app = express();

  app.use(express.urlencoded({ extended: true }));

  app.get("/", (req, res) => {
    res.send("ChatBot!");
  });

  app.use("/chatbot", chatbotRouter);

  app.listen(3000, () => {
    console.log("Servidor rodando na porta http://localhost:3000");
  });
}

main();
