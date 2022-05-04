const cryptoHash = require("../crypto-hash");
const hexToBinary = require("hex-to-binary");

describe("cryptoHash()", () => {
    it("produces a SHA-256 hashed output", () => {
        expect(cryptoHash("foo")).toEqual(
            "2c26b46b68ffc68ff99b453c1d30413413422d706483bfa0f98a5e886266e7ae"
        );
    });

    it("produces the same hash when called with the same input arguments in any order", () => {
        expect(cryptoHash("one", "two", "three")).toEqual(
            cryptoHash("two", "three", "one")
        );
    });
});
