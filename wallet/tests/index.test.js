const Wallet = require("../index");
const Transaction = require("../transaction");
const { verifySignature } = require("../../util");
const Blockchain = require("../../blockchain");
const { STARTING_BALANCE } = require("../../config");
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

    describe("createTransaction()", () => {
        describe("and the amount exceeds available balance", () => {
            it("should throw an error", () => {
                expect(() =>
                    wallet.createTransaction({
                        amount: 987654321,
                        recipient: "foo-recipient",
                    })
                ).toThrow("Amount exceeds balance");
            });
        });

        describe("and the amount is valid", () => {
            let transaction, amount, recipient;

            beforeEach(() => {
                amount = 50;
                recipient = "foo-recipient";
                transaction = wallet.createTransaction({ amount, recipient });
            });

            it("should create an instance of `Transaction`", () => {
                expect(transaction instanceof Transaction).toBe(true);
            });

            it("should match the transaction input with the wallet", () => {
                expect(transaction.input.address).toEqual(wallet.publicKey);
            });

            it("should output the amount to the recipient", () => {
                expect(transaction.outputMap[recipient]).toEqual(amount);
            });
        });

        describe("and a chain is passed", () => {
            it("should call `Wallet.calculateBalanace`", () => {
                const calculateBalanceMock = jest.fn();

                const originalCalculateBalance = Wallet.calculateBalance;

                Wallet.calculateBalance = calculateBalanceMock;

                wallet.createTransaction({
                    recipient: "foo-recipient",
                    amount: 10,
                    chain: new Blockchain().chain,
                });

                expect(calculateBalanceMock).toHaveBeenCalled();

                Wallet.calculateBalance = originalCalculateBalance;
            });
        });
    });

    describe("calculateBalance()", () => {
        let blockchain;

        beforeEach(() => {
            blockchain = new Blockchain();
        });

        describe("and there are no outputs for the wallet", () => {
            it("should return the `STARTING_BALANCE`", () => {
                expect(
                    Wallet.calculateBalance({
                        chain: blockchain.chain,
                        address: wallet.publicKey,
                    })
                ).toEqual(STARTING_BALANCE);
            });
        });

        describe("and there are outputs for the wallet", () => {
            let transactionOne, transactionTwo;
            beforeEach(() => {
                transactionOne = new Wallet().createTransaction({
                    recipient: wallet.publicKey,
                    amount: 50,
                });

                transactionTwo = new Wallet().createTransaction({
                    recipient: wallet.publicKey,
                    amount: 25,
                });

                blockchain.addBlock({ data: [transactionOne, transactionTwo] });
            });

            it("should add the sum of all outputs to the wallet balance", () => {
                expect(
                    Wallet.calculateBalance({
                        chain: blockchain.chain,
                        address: wallet.publicKey,
                    })
                ).toEqual(
                    STARTING_BALANCE +
                        transactionOne.outputMap[wallet.publicKey] +
                        transactionTwo.outputMap[wallet.publicKey]
                );
            });

            describe("and the wallet has made a transaction", () => {
                let recentTransaction;

                beforeEach(() => {
                    recentTransaction = wallet.createTransaction({
                        recipient: "foo-recipient",
                        amount: 30,
                    });

                    blockchain.addBlock({ data: [recentTransaction] });
                });

                it("should return the output amount of the recent transaction", () => {
                    expect(
                        Wallet.calculateBalance({
                            chain: blockchain.chain,
                            address: wallet.publicKey,
                        })
                    ).toEqual(recentTransaction.outputMap[wallet.publicKey]);
                });
                describe("and there are outputs next to and after the recent transaction", () => {
                    let sameBlockTransaction, nextBlockTransaction;

                    beforeEach(() => {
                        recentTransaction = wallet.createTransaction({
                            recipient: "foo-foo-recipient",
                            amount: 60,
                        });

                        sameBlockTransaction = Transaction.rewardTransaction({
                            minerWallet: wallet,
                        });

                        blockchain.addBlock({
                            data: [recentTransaction, sameBlockTransaction],
                        });

                        nextBlockTransaction = new Wallet().createTransaction({
                            recipient: wallet.publicKey,
                            amount: 75,
                        });

                        blockchain.addBlock({ data: [nextBlockTransaction] });
                    });

                    it("should include the output amounts in the returned blanace", () => {
                        expect(
                            Wallet.calculateBalance({
                                chain: blockchain.chain,
                                address: wallet.publicKey,
                            })
                        ).toEqual(
                            recentTransaction.outputMap[wallet.publicKey] +
                                sameBlockTransaction.outputMap[
                                    wallet.publicKey
                                ] +
                                nextBlockTransaction.outputMap[wallet.publicKey]
                        );
                    });
                });
            });
        });
    });
});
