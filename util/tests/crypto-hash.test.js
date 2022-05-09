const cryptoHash = require("../crypto-hash");
const hexToBinary = require("hex-to-binary");

describe("cryptoHash()", () => {
    it("should produce a SHA-256 hashed output", () => {
        expect(cryptoHash("foo")).toEqual(
            "b2213295d564916f89a6a42455567c87c3f480fcd7a1c15e220f17d7169a790b"
        );
    });

    it("should produce the same hash when called with the same input arguments in any order", () => {
        expect(cryptoHash("one", "two", "three")).toEqual(
            cryptoHash("two", "three", "one")
        );
    });

    it("should product a unique hash when the properties have changed on an input", () => {
        const foo = {};
        const originalHash = cryptoHash(foo);

        foo["a"] = "a";

        expect(cryptoHash(foo)).not.toEqual(originalHash);
    });
});
