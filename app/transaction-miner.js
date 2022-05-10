const Transaction = require("../wallet/transaction");

class TransactionMiner {
    constructor({ blockchain, transactionPool, wallet, pubsub }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;
        this.pubsub = pubsub;
    }

    mineTransactions() {
        // get transaction pool's valid transactions
        const validTransactions = this.transactionPool.validTransactions();

        // generate reward for miner
        validTransactions.push(
            Transaction.rewardTransaction({ minerWallet: this.wallet })
        );

        // add a block consisting of  transactions to the blockchain
        this.blockchain.addBlock({ date: validTransactions });

        // broadcast the updated blockchain to the network
        this.pubsub.broadcastChain();

        // clear the local transaction pool
        this.transactionPool.clear();
    }
}

module.exports = TransactionMiner;
