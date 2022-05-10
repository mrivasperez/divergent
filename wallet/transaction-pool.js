class TransactionPool {
    constructor() {
        this.transactionMap = {};
    }

    setTransaction(transaction) {
        // add transaction to map with id as key
        this.transactionMap[transaction.id] = transaction;
    }
}

module.exports = TransactionPool;
