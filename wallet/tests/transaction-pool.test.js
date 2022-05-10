const Wallet = require("../");
const Transaction = require("../transaction");
const TransactionPool = require("../transaction-pool");

describe("TransactionPool", () => {
    let transactionPool, transaction, senderWallet;

    beforeEach(() => {
        transactionPool = new TransactionPool();
        senderWallet = new Wallet();
        transaction = new Transaction({
            senderWallet,
            recipient: "foo-fake-recipient",
            amount: 50,
        });
    });

    describe("setTransaction()", () => {
        it("should add a transaction", () => {
            transactionPool.setTransaction(transaction);

            expect(transactionPool.transactionMap[transaction.id]).toBe(
                transaction
            );
        });
    });

    describe("existingTransaction()", () => {
        it("should return an existing transaction given an input address", () => {
            transactionPool.setTransaction(transaction);

            expect(
                transactionPool.existingTransaction({
                    inputAddress: senderWallet.publicKey,
                })
            ).toBe(transaction);
        });
    });
});
