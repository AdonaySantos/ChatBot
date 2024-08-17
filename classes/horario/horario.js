class Horario {
    constructor(hora, status) {
        this.hora = hora;
        this.status = status;
    }
    
    toString() {
        return`${this.hora} - ${this.status}`;
    }
}

module.exports = Horario;