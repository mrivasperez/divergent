class TransactionPool {
    constructor() {
        this.transactionMap = {};
    }

    setTransaction(transaction) {
        // add transaction to map with id as key
        this.transactionMap[transaction.id] = transaction;
    }

    existingTransaction({ inputAddress }) {
        // check if transaction is in the map
        const transactions = Object.values(this.transactionMap);

        return transactions.find(
            (transaction) => transaction.input.address === inputAddress
        );
    }
}

module.exports = TransactionPool;
