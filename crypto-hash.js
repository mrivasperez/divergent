const crypto = require("crypto");

const cryptoHash = (...inputs) => {
    const hash = crypto.createHash("sha256");

    // sort and join inputs
    hash.update(inputs.sort().join(" "));

    // return the generated hex hash
    return hash.digest("hex");
};

module.exports = cryptoHash;
