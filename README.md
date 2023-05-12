> I have limited time for this project, so progress on this project is very slow. I hope the code here is helpful to you. You are welcome to submit an issue or PR.

# Divergent Technology

A blockchain, cryptocurrency, and comprehensive crypto platform implemented in JavaScript.

## Getting Started

### Requirements

- [Redis](https://redis.io/docs/getting-started/installation/install-redis-on-mac-os/)
- [Yarn](https://yarnpkg.com)

#### Initating Project

1. Clone Repo
2. Install dependencies `yarn`
3. Make sure Redis server is running `redis-server`
4. Run `yarn start`

## API
Note: Default port is 3000, therefore API address is `http://localhost:3000/api/{{endpoint}}`.

### Endpoints
#### `block`
- Read the blockchain
- Response is the blockchain
  
#### `mine`
- Use to mine a token, accepts body as data from request body
- Adds token to blockchain with data
- Broadcasts updated chain to network
- Response is the blockchain

#### `transact`
- Generate a transaction in the blockchain
- Amount and recipient accepted as data from request body
  
#### `transaction-pool-map`
- Get the transaction pool map
- Response is the transaction pool map

#### `mine transactions`
- Mines the transactions in the blockchain's transaction pool
- This will mine new blocks where the data will consist of a set of transactions from the transaction pool.
- Response is the blockchain

#### `wallet-info`
- Get the balance of a wallet
- Every wallet get's a starting balance
- Response is the balance for user's address public key

## Why?

One of my core beliefs is that cryptocurrencies and the blockchain are the future of finance, digital art, and governance. The transformation is happening now, but it is leaving too many people behind.

The biggest barriers to entry is simple: it is too difficult of a process to understand. Mining, wallets, transactions, and cryptography don't make sense unless you spend lots of time researching.

To overcome this barrier, I've created my own open source cryptocurrency/blockchain in JavaScript (I don't expect it to have any monetary value). I call it Divergent Technology and will be using it to create an open source platform to interact with the blockchain and more easily understand the technologies behind it without paying a dime.

The end goal is to help as many people understand cryptocurrencies/the blockchain and how it operates, so they can confidently participate in the rapidly growing divergent society of the future.

You are welcome to contribute, provide feedback, fork, and modify it to make it your own.

## Status

### The Blockchain...

- Created the fundamental blockchain class.
  - Built the genesis block
  - Added mining functionality
- Developed sha-256 hash function and applied it to mine a block.
- Developed functionality to validate the blockchain, to allow for chain replacement.
- Chain replacement
- Proof of Work
  - added difficulty and nonce value to each block
  - adjusted difficutly for each block to ensure block are mined closest to desired rate
  - switched to hexadecimal character-based difficulty criteria to binary bit-based difficulty criteria
  - protected chain from potential difficulty jump attacks by adding extra validation for the blockchain

### The API

- Set up express API to allow for interaction with the blockchain
  - GET request to read
  - POST request to mine
  - POST request to add transaction to transaction pool map
  - GET request to read transaction pool map
  - GET request to mine transactions
  - GET request to get wallet information
- Implemented real time messaging network through Redis to enable chain broadcasting
  - Confirmed real time messaging works by starting peers through alternate ports
- Optimized code to avoid redundant interaction

### The Cryptocurrency

#### The Wallet

- Set up the core wallet class for the cryptocurrency
- Developed key pair and public key addressing system
- Implemented signature generation and verification to suppor transactions
- Built the main transaction class to create output map and structure inputs
- Created functionality to validate transactions
- Improved hash function to recognize objects with new properties as changes in incoming data
- Tested to prevent vulnerabilities

#### The Transaction Pool

- Created core transaction pool
- Transactions are broadcasted when they are added to the pool
- The transaction pool is synced when new peers are connected
