const EC = require("elliptic").ec;
const cryptoHash = require("./crypto-hash");

const ec = new EC("secp256k1");

const verifySignature = ({ publicKey, data, signature }) => {
    // create temp key for verification
    const keyFromPublic = ec.keyFromPublic(publicKey, "hex");
    
    let hashedData = cryptoHash(data);

    // verify if signature is valid or not
    return keyFromPublic.verify(hashedData, signature);
};

module.exports = { ec, verifySignature };
