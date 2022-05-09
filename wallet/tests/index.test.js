const Wallet = require("../index");

describe("Wallet", () => {
    let wallet;

    beforeEach(() => {
        wallet = new Wallet();
    });

    it("should have a `balance`", () => {
        expect(wallet).toHaveProperty("balance");
    });

    it("should have a `publicKey`", () => {
        expect(wallet).toHaveProperty("publicKey");
    });
});
