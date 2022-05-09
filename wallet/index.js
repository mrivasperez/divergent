const { STARTING_BALANCE } = require("../config.js");
const { ec } = require("../util");

class Wallet {
    constructor() {
        this.balance = STARTING_BALANCE;
        const keyPair = ec.genKeyPair(); // generate public/private
        this.publicKey = keyPair.getPublic(); // create public key
    }
}

module.exports = Wallet;
