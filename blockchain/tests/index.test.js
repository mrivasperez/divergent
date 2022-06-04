const Block = require("../block");
const Blockchain = require("../../blockchain/index");
const { cryptoHash } = require("../../util");
const Wallet = require("../../wallet");
const Transaction = require("../../wallet/transaction");

describe("Blockchain", () => {
    let blockchain, newChain, originalChain;

    beforeEach(() => {
        blockchain = new Blockchain();
        originalChain = blockchain.chain;
        newChain = new Blockchain();
    });

    it("contains a `chain` array instance", () => {
        expect(blockchain.chain instanceof Array).toBe(true);
    });

    it("starts with the genesis block", () => {
        expect(blockchain.chain[0]).toEqual(Block.genesis());
    });

    it("adds a new block to the chain", () => {
        const newData = "foo bar";
        blockchain.addBlock({ data: newData });
        expect(blockchain.chain[blockchain.chain.length - 1].data).toEqual(
            newData
        );
    });

    describe("isValidChain()", () => {
        describe("when the chain does not start with the genesis block", () => {
            it("returns false", () => {
                blockchain.chain[0] = { data: "fake-genesis" };
                expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
            });
        });

        describe("when the chain starts with the genesis block and has multiple blocks", () => {
            beforeEach(() => {
                blockchain.addBlock({ data: "Bears" });
                blockchain.addBlock({ data: "Beets" });
                blockchain.addBlock({ data: "Battlestar Galactica" });
            });

            describe("and a lastHash reference has changed", () => {
                it("returns false", () => {
                    blockchain.chain[2].lastHash = "broken-lastHash";

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(
                        false
                    );
                });
            });

            describe("and the chain contains a block with an invalid field", () => {
                it("returns fasle", () => {
                    blockchain.chain[2].data = "something-bad-and-evil";

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(
                        false
                    );
                });
            });

            describe("and the chain contains a block with a jumped difficult", () => {
                it("should return false", () => {
                    const lastBlock =
                        blockchain.chain[blockchain.chain.length - 1];
                    const lastHash = lastBlock.hash;
                    const timestamp = Date.now();
                    const nonce = 0;
                    const data = [];
                    const difficulty = lastBlock.difficulty - 3;
                    const hash = cryptoHash(
                        timestamp,
                        lastHash,
                        difficulty,
                        nonce,
                        data
                    );

                    const badBlock = new Block({
                        timestamp,
                        lastHash,
                        hash,
                        nonce,
                        difficulty,
                        data,
                    });

                    blockchain.chain.push(badBlock);

                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(
                        false
                    );
                });
            });

            describe("and the chain does not contain any invalid blocks", () => {
                it("returns true", () => {
                    expect(Blockchain.isValidChain(blockchain.chain)).toBe(
                        true
                    );
                });
            });
        });
    });

    describe("replaceChain()", () => {
        let errorMock, logMock;

        beforeEach(() => {
            errorMock = jest.fn();
            logMock = jest.fn();

            global.console.error = errorMock;
            global.console.log = logMock;
        });

        describe("when the new chain is not longer", () => {
            it("does not replace the chain", () => {
                newChain.chain[0] = { new: "chain" };
                blockchain.replaceChain(newChain.chain);
                expect(blockchain.chain).toEqual(originalChain);
            });
        });

        describe("when the new chain is longer", () => {
            beforeEach(() => {
                newChain.addBlock({ data: "Bears" });
                newChain.addBlock({ data: "Beets" });
                newChain.addBlock({ data: "Battlestar Galactica" });
            });

            describe("and the chain is invalid", () => {
                it("does not replace the chain", () => {
                    newChain.chain[2].hash = "some-fake-hash";
                    blockchain.replaceChain(newChain.chain);
                    expect(blockchain.chain).toEqual(originalChain);
                });
            });

            describe("and the chain is valid", () => {
                it("replaces the chain", () => {
                    blockchain.replaceChain(newChain.chain);
                    expect(blockchain.chain).toEqual(newChain.chain);
                });
            });
        });
    });

    describe("validTransactionData()", () => {
        let transaction, rewardTransaction, wallet;

        beforeEach(() => {
            wallet = new Wallet();

            transaction = wallet.createTransaction({
                recipient: "foo-recipient",
                amount: 65,
            });

            rewardTransaction = Transaction.rewardTransaction({
                minerWallet: wallet,
            });
        });

        describe("and the transaction data is valid", () => {
            it("should return true", () => {
                newChain.addBlock({
                    data: [transaction, rewardTransaction],
                });

                expect(
                    blockchain.validTransactionData({ chain: newChain.chain })
                ).toBe(true);
            });
        });

        describe("and the transaction data has multiple rewards", () => {
            it("should return false", () => {
                newChain.addBlock({
                    data: [transaction, rewardTransaction, rewardTransaction],
                });

                expect(
                    blockchain.validTransactionData({ chain: newChain.chain })
                ).toBe(false);
            });
        });

        describe("the transaction data has at least one malformed `outputMap`", () => {
            describe("and the transactin is not a reward transaction", () => {
                it("should return false", () => {
                    transaction.outputMap[wallet.publicKey] = 999999;
                    newChain.addBlock({
                        data: [transaction, rewardTransaction],
                    });

                    expect(
                        blockchain.validTransactionData({
                            chain: newChain.chain,
                        })
                    ).toBe(false);
                });
            });

            describe("and the reward transaction is a reward transaction", () => {
                it("should return false", () => {
                    rewardTransaction.outputMap[wallet.publicKey] = 999999;
                    newChain.addBlock({
                        data: [transaction, rewardTransaction],
                    });

                    expect(
                        blockchain.validTransactionData({
                            chain: newChain.chain,
                        })
                    ).toBe(false);
                });
            });
        });

        describe("and the transaction data has at least one malformed input", () => {
            it("should return false", () => {
                wallet.balance = 9000;

                const devilOutputMap = {
                    [wallet.publicKey]: 8900,
                    fooRecipient: 100,
                };

                const devilTransaction = {
                    input: {
                        timestamp: Date.now(),
                        amount: wallet.balance,
                        address: wallet.publicKey,
                        signature: wallet.sign(devilOutputMap),
                    },
                    outputMap: devilOutputMap,
                };

                newChain.addBlock({
                    data: [devilTransaction, rewardTransaction],
                });

                expect(
                    blockchain.validTransactionData({
                        chain: newChain.chain,
                    })
                ).toBe(false);
            });
        });

        describe("and a block contains multiple identical transactions", () => {
            it("should return false", () => {});
        });
    });
});
