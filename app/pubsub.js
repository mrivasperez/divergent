const redis = require("redis");

const CHANNELS = {
    TEST: "TEST",
    BLOCKCHAIN: "BLOCKCHAIN",
    TRANSACTION: "TRANSACTION",
};

class PubSub {
    constructor({ blockchain, transactionPool, wallet }) {
        this.blockchain = blockchain;
        this.transactionPool = transactionPool;
        this.wallet = wallet;

        // create redis clients
        this.publisher = redis.createClient();
        this.subscriber = redis.createClient();

        // subscribe redis to all channels
        this.subscribeToChannels();

        this.subscriber.on("message", (channel, message) => {
            return this.handleMessage(channel, message);
        });
    }

    handleMessage(channel, message) {
        console.log(message, channel);
        // parse message
        const parsedMessage = JSON.parse(message);
        console.log(parsedMessage)
        switch (channel) {
            case CHANNELS.BLOCKCHAIN:
                this.blockchain.replaceChain(parsedMessage, () => {
                    // clear local transaction pool
                    this.transactionPool.clearBlockchainTransactions({
                        chain: parsedMessage
                    });
                });
                break;
            case CHANNELS.TRANSACTION:
                if (
                    !this.transactionPool.existingTransaction({
                        inputAddress: this.wallet.publicKey,
                    })
                ) {
                    this.transactionPool.setTransaction(parsedMessage);
                }
                break;
            default:
                return;
        }
    }

    subscribeToChannels() {
        Object.values(CHANNELS).forEach((channel) => {
            this.subscriber.subscribe(channel);
        });
    }

    publish({ channel, message }) {
        // unsubscribe to prevent redundent msgs
        this.subscriber.unsubscribe(channel, () => {
            // send message
            this.publisher.publish(channel, message, () => {
                // resubscribe to receive future updates
                this.subscriber.subscribe(channel);
            });
        });
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain),
        });
    }

    broadcastTransaction(transaction) {
        this.publish({
            channel: CHANNELS.TRANSACTION,
            message: JSON.stringify(transaction),
        });
    }
}

module.exports = PubSub;
