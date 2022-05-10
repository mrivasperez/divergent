const MINE_RATE = 1000; // in milliseconds

const INITIAL_DIFFICULTY = 3;

const GENESIS_DATA = {
    timestamp: 1,
    lastHash: "-----",
    hash: "hash-one",
    difficulty: INITIAL_DIFFICULTY,
    nonce: 0,
    data: [],
};

const STARTING_BALANCE = 1000;

// set validating value for address used by reward tokens
const REWARD_INPUT = { address: "*authorized-reward*" };
const MINING_REWARD = 50;

module.exports = {
    GENESIS_DATA,
    MINE_RATE,
    STARTING_BALANCE,
    REWARD_INPUT,
    MINING_REWARD,
};
