const bodyParser = require("body-parser");
const express = require("express");
const request = require("request");
const Blockchain = require("./blockchain/index");
const PubSub = require("./app/pubsub");
const TransactionPool = require("./wallet/transaction-pool");
const Wallet = require("./wallet");

const app = express();
const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain });
const DEFAULT_PORT = 3000;

const ROOT_NODE_ADDRESS = `http://localhost:${DEFAULT_PORT}`;

// make sure that the user has access to blockchain on connect

// use body parsor middleware to read json
app.use(bodyParser.json());

// read blockchain
app.get("/api/blocks", (req, res) => {
    res.json(blockchain.chain);
});

// mine a block
app.post("/api/mine", (req, res) => {
    // get requested data to add
    const { data } = req.body;

    // add blockchain with data
    blockchain.addBlock({ data });

    // broadcast chain
    pubsub.broadcastChain();

    res.redirect("/api/blocks");
});

// create a transaction
app.post("/api/transact", (req, res) => {
    // set amount and recipient
    const { amount, recipient } = req.body;

    // check if transaction by wallet already exists
    let transaction = transactionPool.existingTransaction({
        inputAddress: wallet.publicKey,
    });

    try {
        if (transaction) {
            transaction.update({ senderWallet: wallet, recipient, amount });
        } else {
            transaction = wallet.createTransaction({ recipient, amount });
        }
    } catch (error) {
        return res.status(400).json({ type: "error", message: error.message });
    }

    transactionPool.setTransaction(transaction);

    res.json({ type: "success", transaction });
});

// DEV ENV ONLY - to test multiple blocks being mined
let PEER_PORT;

if (process.env.GENERATE_PEER_PORT === "true") {
    PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

// replace local chain with most accurate chain
const syncChains = () => {
    request(
        { url: `${ROOT_NODE_ADDRESS}/api/blocks` },
        (error, response, body) => {
            if (!error && response.statusCode === 200) {
                const rootChain = JSON.parse(body);
                console.log("Syncing blockchain...");
                blockchain.replaceChain(rootChain);
            }
        }
    );
};

const PORT = PEER_PORT || DEFAULT_PORT;

app.listen(PORT, () => {
    // syncChains when connected outside of default port
    if (PORT !== DEFAULT_PORT) return syncChains();
});
