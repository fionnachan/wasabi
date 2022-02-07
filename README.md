# WASABI - UI generated based on an ARC-4 App's ABI Interface

This project intends to provide a UI for developers and regular dApp users to interact with [ARC-4](https://github.com/algorandfoundation/ARCs/blob/main/ARCs/arc-0004.md)-compliant smart contracts using a dApp-agnostic UI as long as the contract interface is provided.

The following is a working demo integrated with an ARC-4 smart contract's interface.
[Netlify Live Demo Site](https://arc4-erc20-abi-demo.netlify.app/)
[nullun/ARC4-ERC20-ABI-DEMO Github Repository](https://github.com/nullun/ARC4-ERC20-ABI-DEMO)

#### Wallet Support

As of 8th Feb 2022, AVM is still on 1.0. AVM 1.1 which supports ARC-4 apps have not been merged to the main branch of [go-algorand](https://github.com/algorand/go-algorand). Developers can only develop and test their ARC-4 smart contracts using sandbox with configuration pointing to the [contract-to-contract working branch](https://github.com/algorand/go-algorand/pull/3397). For this reason, this UI app only supports sandbox and KMD. In the future, this might change when AVM 1.1 has been deployed to testnet.
