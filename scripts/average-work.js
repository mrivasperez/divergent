const Blockchain = require("../blockchain");

const blockchain = new Blockchain();

blockchain.addBlock({ date: "initial" });
let previousTimestamp,
    nextTimestamp,
    nextBlock,
    timeDifference,
    averageMineRate;
// console.log("firstblock", blockchain.chain[blockchain.chain.length - 1]);
const times = [];

for (let i = 0; i < 10000; i++) {
    previousTimestamp = blockchain.chain[blockchain.chain.length - 1].timestamp;
    blockchain.addBlock({ data: `block ${i}` });
    nextBlock = blockchain.chain[blockchain.chain.length - 1];

    nextTimestamp = nextBlock.timestamp;

    timeDifference = nextTimestamp - previousTimestamp;

    times.push(timeDifference);

    averageMineRate = times.reduce((total, num) => total + num / times.length);

    console.log(
        `Time to mine block: ${timeDifference}ms. Difficulty: ${nextBlock.difficulty}. Average time: ${averageMineRate}ms`
    );
}
