const Block = require("./block");
const Transaction = require("../wallet/transaction");
const { cryptoHash } = require("../util");
const { REWARD_INPUT, MINING_REWARD } = require("../config");
const Wallet = require("../wallet");

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

    replaceChain(chain, onSuccess) {
        // only replace if new chain is longer and valid
        if (chain.length <= this.chain.length) {
            console.error("The incoming chain must be longer.");
            return;
        } else if (!Blockchain.isValidChain(chain)) {
            console.error("The incoming chain must be valid.");
            return;
        }
        if (onSuccess) onSuccess();
        console.log("The chain was replaced with", chain);
        this.chain = chain;
    }

    validTransactionData({ chain }) {
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];
            const transactionSet = new Set();
            let rewardTransactionCount = 0;

            for (let transaction of block.data) {
                if (transaction.input.address === REWARD_INPUT.address) {
                    rewardTransactionCount += 1;

                    if (rewardTransactionCount > 1) {
                        console.error("Miner reward exceeds limit");
                        return false;
                    }

                    if (
                        Object.values(transaction.outputMap)[0] !==
                        MINING_REWARD
                    ) {
                        console.error("Miner reward invalid");
                        return false;
                    }
                } else {
                    if (!Transaction.validTransaction(transaction)) {
                        console.error("Invalid transaction");
                        return false;
                    }

                    const trueBalance = Wallet.calculateBalance({
                        chain: this.chain,
                        address: transaction.input.address,
                    });

                    if (transaction.input.amount !== trueBalance) {
                        console.error("Invalid input amount");
                        return false;
                    }

                    if(transactionSet.has(transaction)) {
                        console.error("An identical transaction appears more than once in the block");
                        return false;
                    } else {
                        transactionSet.add(transaction)
                    }
                }
            }
        }

        return true;
    }

    static isValidChain(chain) {
        // check if genesis block is correct using string values
        if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis()))
            return false;

        // loop through each block to make sure they meet conditions
        for (let i = 1; i < chain.length; i++) {
            const block = chain[i];

            // get the real last hash from the prior block
            const actualLastHash = chain[i - 1].hash;
            const { timestamp, lastHash, hash, nonce, difficulty, data } =
                block;

            const lastDifficulty = chain[i - 1].difficulty;

            // check if the hashes are the same
            if (lastHash !== actualLastHash) return false;
            // make sure that the difficulty has not been jumped
            if (Math.abs(lastDifficulty - difficulty > 1)) return false;

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
