const crypto = require("crypto");

const cryptoHash = (...inputs) => {
    const hash = crypto.createHash("sha256");

    // sort and join inputs
    hash.update(inputs.sort().join(" "));

    // create hex hash and return in binary form
    const hexHash = hash.digest("hex");
    return hexHash;
};

module.exports = cryptoHash;
