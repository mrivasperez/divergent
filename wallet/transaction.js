const { v1 } = require("uuid");

class Transaction {
    constructor({ senderWallet, recipient, amount }) {
        // generate a unique id for transaction
        this.id = v1();

        // generate the ouput map
        this.outputMap = this.createOutpuMap({
            senderWallet,
            recipient,
            amount,
        });
    }

    createOutpuMap({ senderWallet, recipient, amount }) {
        const outputMap = {};
        outputMap[recipient] = amount;
        outputMap[senderWallet.publicKey] = senderWallet.balance - amount;
        return outputMap;
    }
}

module.exports = Transaction;
