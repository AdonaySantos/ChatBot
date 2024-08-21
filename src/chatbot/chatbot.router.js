const express = require("express");
const controller = require("./chatbot.controller");

const router = express.Router();

router.post("/", controller.create);

module.exports = router;
