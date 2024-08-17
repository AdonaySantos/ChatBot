class Procedimento {
    constructor(nome, preco) {
        this.nome = nome;
        this.preco = preco;
    }
    
    toString() {
        return`${this.nome}: ${this.preco}`;
    }
}

module.exports = Procedimento;