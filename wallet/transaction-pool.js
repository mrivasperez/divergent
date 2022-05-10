const Transaction = require("./transaction");

class TransactionPool {
    constructor() {
        this.transactionMap = {};
    }

    // clear out the transaction pool
    clear() {
        this.transactionMap = {};
    }

    setTransaction(transaction) {
        // add transaction to map with id as key
        this.transactionMap[transaction.id] = transaction;
    }

    setMap(transactionMap) {
        this.transactionMap = transactionMap;
    }

    existingTransaction({ inputAddress }) {
        // check if transaction is in the map
        const transactions = Object.values(this.transactionMap);

        return transactions.find(
            (transaction) => transaction.input.address === inputAddress
        );
    }

    validTransactions() {
        // get valid transactions from the transaction pool
        return Object.values(this.transactionMap).filter((transaction) =>
            Transaction.validTransaction(transaction)
        );
    }

    clearBlockchainTransactions({ chain }) {
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            // go through each transaction
            for (let transaction of block.data) {
                if (this.transactionMap[transaction.id]) {
                    delete this.transactionMap[transaction.id];
                }
            }
        }
    }
}

module.exports = TransactionPool;
