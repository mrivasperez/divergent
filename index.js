const bodyParser = require("body-parser");
const express = require("express");
const Blockchain = require("./blockchain");
const PubSub = require("./pubsub");

const app = express();
const blockchain = new Blockchain();
const pubsub = new PubSub({ blockchain });

setTimeout(() => {
    pubsub.broadcastChain();
}, 1000);

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

    res.redirect("/api/blocks");
});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Listening to localhost ${PORT}....`);
});
