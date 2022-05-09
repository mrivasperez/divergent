const { STARTING_BALANCE } = require("../config.js");
const { ec, cryptoHash } = require("../util");
const Transaction = require("./transaction.js");

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

    createTransaction({ recipient, amount }) {
        if (amount > this.balance) {
            throw new Error("Amount exceeds balance");
        }

        return new Transaction({ senderWallet: this, recipient, amount });
    }
}

module.exports = Wallet;
