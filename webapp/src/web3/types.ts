import { BigNumber, Contract, ContractTransaction } from 'ethers';

export type ERC20Contract = Contract | {
  balanceOf: (address: string) => Promise<BigNumber>;
  transfer: (address: string, amount: BigNumber) => Promise<ContractTransaction>;
  allowance: (owner: string, spender: string) => Promise<BigNumber>;
  approve: (spender: string, amount: BigNumber) => Promise<ContractTransaction>;
  transferFrom: (from: string, to: string, amount: BigNumber) => Promise<ContractTransaction>;
  symbol: () => Promise<string>;
  decimals: () => Promise<number>;
  name: () => Promise<string>;
}

export type LenderContract = Contract | {
  LENDING_TOKEN: () => Promise<string>;
  COLLATERAL_TOKEN: () => Promise<string>;
  collateralBalance: (address: string) => Promise<BigNumber>;
  borrowedBalance: (address: string) => Promise<BigNumber>;
  collateralRequired: (address: string, amount: BigNumber) => Promise<BigNumber>;
  borrow: (amount: BigNumber) => Promise<ContractTransaction>;
  repay: (amount: BigNumber) => Promise<ContractTransaction>;
  increaseCollateral: (amount: BigNumber) => Promise<ContractTransaction>;
  decreaseCollateral: (amount: BigNumber) => Promise<ContractTransaction>;
}

export type CryptoBureauContract = Contract | {
  register: (root: string, hash: string, proof: any) => Promise<ContractTransaction>;
  isHelperUsed: (address: string, helperAddress: string) => Promise<boolean>;
  scoreData: (address: string) => Promise<ScoreData>;
  score: (address: string) => Promise<[BigNumber]>;
}

export type AnyContract = Contract | ERC20Contract | LenderContract | CryptoBureauContract;

export interface ScoreData {
  verified: boolean;
  base: BigNumber;
  totalBorrowed: BigNumber;
  totalRepaid: BigNumber;
  totalCollateral: BigNumber;
}
