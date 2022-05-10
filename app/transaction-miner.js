class TransactionMiner {
    constructor({ blockchain, transactionPool, wallet, pubsub }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.pubsub = pubsub;
    }
    mineTransactions() {
        // get transaction pool's valid transactions
        // generate reward for miner
        // add a block consisting of these transactions to the blockchain
        // broadcast the updated blockchain to the network
        // clear the local transaction pool
    }
}

module.exports = TransactionMiner;
