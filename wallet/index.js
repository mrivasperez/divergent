const { STARTING_BALANCE } = require("../config.js");
const { ec, cryptoHash } = require("../util");

class Wallet {
    constructor() {
        this.balance = STARTING_BALANCE;

        // generate public/private key pairs
        this.keyPair = ec.genKeyPair();

        // generate hex from key
        this.publicKey = this.keyPair.getPublic().encode("hex");
    }

    sign(data) {
        return this.keyPair.sign(cryptoHash(data));
    }
}

module.exports = Wallet;
