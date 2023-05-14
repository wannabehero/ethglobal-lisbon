# CryptoBureau

The suite is deployed on Polygon Mumbai as most of ZK tech are not available on other testnets.

Customers initially register with [CryptoBureau](./chain/contracts/CryptoBureau.sol) contract using WorldID which is used for unique identification. Then, different frontend integrations help to generate ZK proofs to be submitted and verified on-chain. Successful verifications result in updated credit score. Interaction with lender affects the collaterization coefficiant as the history is being preserved.

ZK Technologies:
- WorldID for Proof of Personhood: [frontend integration](./webapp/src/components/WorldID/index.tsx) + [on-chain proof verification](./chain/contracts/CryptoBureau.sol)
- Sismo for Proof of NFT ownership: [frontend integration](./webapp/src/components/SismoConnect/index.tsx) + [on-chain proof verififcation](./chain/contracts/helpers/SismoHelper.sol)
- PolygonID for Proof of Education: trivial [frontend integration](./webapp/src/components/PolygonID/index.tsx) + [custom claim schema](./chain/id/diploma.json) + [on-chain proof verification](./chain//contracts/helpers/PolygonIdHelper.sol)
- zokrates: [zk-SNARKs circuit](./chain/circuits/gte.zok) + [backend proof generation](./backend/src/zk/zk.service.ts) + [on-chain proof verification](./chain/contracts/ZKVerifier.sol)

Frontend:
- vite + react
- rainbowkit + wagmi + ethers
- antd for layout and UI

Backend:
- nest.js
- TrueLayer API - to [fetch bank account information](./backend/src/truelayer/truelayer.service.ts)

Smart Contracts:
- hardhat + solidity
- unit-tests to simplify development
- aave for handy testnet DAI and jEUR tokens

