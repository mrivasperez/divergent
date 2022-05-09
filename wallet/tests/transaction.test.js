const Wallet = require("../");
const { verifySignature } = require("../../util");
const Transaction = require("../transaction");

describe("Transaction", () => {
    let transaction, senderWallet, recipient, amount;

    beforeEach(() => {
        senderWallet = new Wallet();
        recipient = "recipient-public-key";
        amount = 50;

        transaction = new Transaction({ senderWallet, recipient, amount });
    });

    it("should have an `id`", () => {
        expect(transaction).toHaveProperty("id");
    });

    describe("outputMap", () => {
        it("should have an `outputMap`", () => {
            expect(transaction).toHaveProperty("outputMap");
        });

        it("should ouput the amount to the recipient", () => {
            expect(transaction.outputMap[recipient]).toEqual(amount);
        });

        it("should output the remaining balance for the `senderWallet`", () => {
            expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
                senderWallet.balance - amount
            );
        });
    });

    describe("input", () => {
        it("should have an `input`", () => {
            expect(transaction).toHaveProperty("input");
        });

        it("should have a `timestamp` in the input", () => {
            expect(transaction.input).toHaveProperty("timestamp");
        });

        it("should set the `amount` to the `senderWallet` balance", () => {
            expect(transaction.input.amount).toEqual(senderWallet.balance);
        });

        it("should set the `address` to the `senderWallet` publicKey", () => {
            expect(transaction.input.address).toEqual(senderWallet.publicKey);
        });

        it("should sign the input", () => {
            expect(
                verifySignature({
                    publicKey: senderWallet.publicKey,
                    data: transaction.outputMap,
                    signature: transaction.input.signature,
                })
            ).toBe(true);
        });
    });

    describe("validTransaction()", () => {
        let errorMock;
        beforeEach(() => {
            errorMock = jest.fn();
            global.console.error = errorMock;
        });

        describe("the transaction is valid", () => {
            it("should return true", () => {
                expect(Transaction.validTransaction(transaction)).toBe(true);
            });
        });

        describe("the transaction is not valid", () => {
            describe("and a transaction outputMap value is invalud", () => {
                it("should return false and log an error", () => {
                    transaction.outputMap[senderWallet.publicKey] = 987654321;
                    expect(Transaction.validTransaction(transaction)).toBe(
                        false
                    );
                    expect(errorMock).toHaveBeenCalled();
                });
            });

            describe("and the transaction input signature is invalud", () => {
                it("should return false and log an error", () => {
                    transaction.input.signature = new Wallet().sign("data");
                    expect(Transaction.validTransaction(transaction)).toBe(
                        false
                    );
                    expect(errorMock).toHaveBeenCalled();
                });
            });
        });
    });

    describe("update()", () => {
        let originalSignature, originalSenderOutput, nextRecipient, nextAmount;

        beforeEach(() => {
            originalSignature = transaction.input.signature;
            originalSenderOutput =
                transaction.outputMap[senderWallet.publicKey];
            nextRecipient = "bar-next-recipient";
            nextAmount = 50;

            transaction.update({
                senderWallet,
                recipient: nextRecipient,
                amount: nextAmount,
            });
        });

        it("should output the amount to the next recipient", () => {
            expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount);
        });

        it("should subtract the amount from the original sender output amount", () => {
            expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
                originalSenderOutput - nextAmount
            );
        });

        it("should maintain a total output that matches the input amount", () => {
            expect(
                Object.values(transaction.outputMap).reduce(
                    total,
                    (outputAmount) => total + outputAmount
                )
            ).toEqual(transaction.input.amount);
        });

        it("should re-sign the transaction", () => {
            expect(transaction.input.signature).not.toEqual(originalSignature);
        });
    });
});
