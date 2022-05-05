# Divergent

A blockchain and cryptocurrency implemented in JavaScript.

## Why?

One of my core beliefs is that cryptocurrencies and the blockchain are the future of finance, digital art, and IT. The transformation is happening now, but it is leaving too many people behind.

The biggest barriers to entry is simple: it is too difficult of a process to understand. Mining, wallets, transactions, and cryptography don't make sense unless you spend hours researching.

To overcome this barrier, I've created my own open source cryptocurrency/blockchain in JavaScript (I don't expect it to have any monetary value). I call it Divergent Technology and will be using it to create an open source platform to interact with the blockchain and more easily understand the technologies behind it without paying a dime.

The end goal is to help as many people understand cryptocurrencies/the blockchain and how it operates, so they can confidently participate in the rapidly growing divergent society of the future.

You are welcome to contribute, provide feedback, fork, and modify it to make it your own.

## Status

### The Blockchain...

-   Created the fundamental blockchain class.
    -   Built the genesis block
    -   Added mining functionality
-   Developed sha-256 hash function and applied it to mine a block.
-   Developed functionality to validate the blockchain, to allow for chain replacement.
-   Chain replacement
-   Proof of Work
    -   added difficulty and nonce value to each block
    -   adjusted difficutly for each block to ensure block are mined closest to desired rate
    -   switched to hexadecimal character-based difficulty criteria to binary bit-based difficulty criteria
    -   protected chain from potential difficulty jump attacks by adding extra validation for the blockchain
    -

### To Dos (you're welcome to help)

-   [ ] Organize file structure
-   [ ] Create front-end
-   [ ] Complete
