const Block = require("./block");
const cryptoHash = require("./crypto-hash");

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()];
    }

    addBlock({ data }) {
        const newBlock = Block.mineBlock({
            lastBlock: this.chain[this.chain.length - 1],
            data,
        });

        this.chain.push(newBlock);
    }

    replaceChain(chain) {
        // only replace if new chain is longer and valid
        if (chain.length <= this.chain.length) {
            return console.error("The incoming chain must be longer.");
        } else if (!Blockchain.isValidChain(chain)) {
            return console.error("The incoming chain must be valid.");
        } else {
            console.log("The chain was replaced with", chain);
            return (this.chain = chain);
        }
    }

    static isValidChain(chain) {
        // check if genesis block is correct using string values
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
            return false;

        // loop through each block
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];

            // get the real last hash from the prior block
            const actualLastHash = chain[i - 1].hash;
            const { timestamp, lastHash, hash, nonce, difficulty, data } =
                block;

            // check if the hashes are the same
            if (lastHash !== actualLastHash) return false;

            // validate the hash
            const validatedHash = cryptoHash(
                timestamp,
                lastHash,
                data,
                nonce,
                difficulty
            );

            // confirm the hash is valid
            if (hash !== validatedHash) return false;
        }
        return true;
    }
}

module.exports = Blockchain;
