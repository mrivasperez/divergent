const { GENESIS_DATA } = require("./config");
const cryptoHash = require("./crypto-hash");

class Block {
    // construct block
    constructor({ timestamp, lastHash, hash, data }) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
    }

    // construct the genesis block
    static genesis() {
        return new Block(GENESIS_DATA);
    }

    // mine a block
    static mineBlock({ lastBlock, data }) {
        const timestamp = Date.now();
        const lastHash = lastBlock.hash;

        return new this({
            timestamp,
            lastHash,
            data,
            hash: cryptoHash(timestamp, lastHash, data),
        });
    }
}

// create new instance of a block
const block1 = new Block({
    data: "foo-data",
    timestamp: "01/01/01",
    lastHash: "foo-lastHash",
    hash: "foo-hash",
});

console.log("block1", block1);

module.exports = Block;
