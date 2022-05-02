const { GENESIS_DATA } = require("./config");

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
        return new this({
            timestamp: Date.now(),
            lastHash: lastBlock.hash,
            data,
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
