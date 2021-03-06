# WASABI - UI generated based on an ARC-4 App's ABI Interface

[WASABI Live Demo](https://algo-wasabi.netlify.app)

This project intends to provide a UI for developers and regular dApp users to interact with [ARC-4](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0004.md)-compliant smart contracts using a dApp-agnostic UI as long as the contract interface is provided.

#### How to run this project

1. Start the project

   ```sh
   yarn start
   ```

2. Run sandbox using [go-algorand c2c branch](https://github.com/algorand/go-algorand/tree/feature/contract-to-contract)

   **config.c2c**

   ```sh
   export ALGOD_CHANNEL=""
   export ALGOD_URL="https://github.com/algorand/go-algorand"
   export ALGOD_BRANCH="feature/contract-to-contract"
   export ALGOD_SHA=""
   export NETWORK=""
   export NETWORK_TEMPLATE="images/algod/Future.json"
   export NETWORK_BOOTSTRAP_URL=""
   export NETWORK_GENESIS_FILE=""
   export INDEXER_URL="https://github.com/algorand/indexer"
   export INDEXER_BRANCH="develop"
   export INDEXER_SHA=""
   export INDEXER_DISABLED=""
   ```

   For the network template, set `"ConsensusProtocol": "future"`.

3. Paste an ARC4-compliant contract interface json and click submit
   There is an example file called `ERC20_interface.json` under `/examples`. It was taken from [nullun/ARC4-ERC20-ABI-DEMO](https://github.com/nullun/ARC4-ERC20-ABI-DEMO`), written by [nullun](https://github.com/nullun).

4. Interact with the contract methods

#### Wallet Support

As of 9th Feb 2022, AVM is still on 1.0. AVM 1.1 which supports ARC-4 apps have not been deployed to testnet. Developers can develop and test their ARC-4 smart contracts using sandbox with some configuration tweaks but the AVM 1.1 features are not available to regular users yet. For this reason, this UI app only supports sandbox and KMD. In the future, this might change when AVM 1.1 has been deployed to testnet.

#### Additional Demo

The following is a working demo integrated with a specific ARC-4 smart contract's interface.<br>
[ARC4-ERC20-ABI-DEMO Live Demo](https://arc4-erc20-abi-demo.netlify.app/)
