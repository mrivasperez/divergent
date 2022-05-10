const Wallet = require("../");
const Transaction = require("../transaction");
const TransactionPool = require("../transaction-pool");

describe("TransactionPool", () => {
    let transactionPool, transaction;

    beforeEach(() => {
        transactionPool = new TransactionPool();

        transaction = new Transaction({
            senderWallet: new Wallet(),
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
});
