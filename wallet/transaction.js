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

        this.input = this.createInput({
            senderWallet,
            outputMap: this.outputMap,
        });
    }

    createOutpuMap({ senderWallet, recipient, amount }) {
        const outputMap = {};
        outputMap[recipient] = amount;
        outputMap[senderWallet.publicKey] = senderWallet.balance - amount;
        return outputMap;
    }

    createInput({ senderWallet, outputMap }) {
        return {
            timestamp: Date.now(),
            amount: senderWallet.balance,
            address: senderWallet.publicKey,
            signature: senderWallet.sign(outputMap),
        };
    }
}

module.exports = Transaction;
