# Divergent

A blockchain and cryptocurrency implemented in JavaScript.

## Why?

I wanted to understand blockchain and found it really difficult to understand the key concepts. To help me understand them better, I decide to build one myself.

**Also,** I hope that by reviewing this code and interacting with this blockchain, other people can more easily understand the blockchain.

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

### API and Network

-   [ ] Read
-   [ ] Write (mine)
