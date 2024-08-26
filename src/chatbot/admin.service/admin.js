function response(user) {
    if (/^(oi|bom dia|olá|ola|bom|boa noite|boa tarde|menu)/.test(user.msgLower)) {
      return "Olá adm";
    } else {
      return "Comando não reconhecido para o administrador.";
    }
  }


  module.exports = {
    response,
  }