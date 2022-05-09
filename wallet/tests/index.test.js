const Wallet = require("../index");
const { verifySignature } = require("../../util");
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

    describe("signing data", () => {
        const data = "A string for data.";
        it("should verify a signature", () => {
            expect(
                verifySignature({
                    publicKey: wallet.publicKey,
                    data,
                    signature: wallet.sign(data),
                })
            ).toBe(true);
        });

        it("should not verify an invalid signature", () => {
            expect(
                verifySignature({
                    publicKey: wallet.publicKey,
                    data,
                    signature: new Wallet().sign(data),
                })
            ).toBe(false);
        });
    });
});
