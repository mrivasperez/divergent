const crypto = require("crypto");

const cryptoHash = (...inputs) => {
    const hash = crypto.createHash("sha256");

    // sort and join inputs as JSON strings
    hash.update(
        inputs
            .map((input) => JSON.stringify(input))
            .sort()
            .join(" ")
    );

    const hexHash = hash.digest("hex");
    return hexHash;
};

module.exports = cryptoHash;
