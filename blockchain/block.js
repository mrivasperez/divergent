const hexToBinary = require("hex-to-binary");

const cryptoHash = require("../util/crypto-hash");

const { GENESIS_DATA, MINE_RATE } = require("../config");

class Block {
    // construct block
    constructor({ timestamp, lastHash, hash, data, nonce, difficulty }) {
        this.timestamp = timestamp;
        this.lastHash = lastHash;
        this.hash = hash;
        this.data = data;
        this.nonce = nonce;
        this.difficulty = difficulty;
    }

    // construct the genesis block
    static genesis() {
        return new Block(GENESIS_DATA);
    }

    // mine a block
    static mineBlock({ lastBlock, data }) {
        let hash, timestamp;
        const lastHash = lastBlock.hash;
        let { difficulty } = lastBlock;
        let nonce = 0;

        // create the hash after setting nonce correctly
        do {
            nonce++;
            timestamp = Date.now();
            // create difficulty relevant to current timestamp and last block
            difficulty = Block.adjustDifficulty({
                originalBlock: lastBlock,
                timestamp,
            });
            hash = cryptoHash(timestamp, lastHash, data, nonce, difficulty);
        } while (
            // run difficutly based on binary
            hexToBinary(hash).substring(0, difficulty) !==
            "0".repeat(difficulty)
        );

        return new this({
            timestamp,
            lastHash,
            data,
            difficulty,
            nonce,
            hash,
        });
    }

    // set mining difficulty value
    static adjustDifficulty({ originalBlock, timestamp }) {
        const { difficulty } = originalBlock;

        // make sure difficulty is never below 1 to prevent errors
        if (difficulty < 1) return 1;

        const differenceInTimestamps = timestamp - originalBlock.timestamp;

        // check if mining rate meets preferred rate
        if (differenceInTimestamps > MINE_RATE) return difficulty - 1;
        return difficulty + 1;
    }
}

// create new instance of a block
const block1 = new Block({
    data: "foo-data",
    timestamp: "01/01/01",
    lastHash: "foo-lastHash",
    hash: "foo-hash",
});

module.exports = Block;
