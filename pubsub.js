const redis = require("redis");

const CHANNELS = {
    TEST: "TEST",
    BLOCKCHAIN: "BLOCKCHAIN",
};

class PubSub {
    constructor({ blockchain }) {
        this.blockchain = blockchain;

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

        if (channel === CHANNELS.BLOCKCHAIN) {
            this.blockchain.replaceChain(parsedMessage);
        }
    }

    subscribeToChannels() {
        Object.values(CHANNELS).forEach((channel) => {
            this.subscriber.subscribe(channel);
        });
    }

    publish({ channel, message }) {
        this.publisher.publish(channel, message);
    }

    broadcastChain() {
        this.publish({
            channel: CHANNELS.BLOCKCHAIN,
            message: JSON.stringify(this.blockchain.chain),
        });
    }
}

module.exports = PubSub;