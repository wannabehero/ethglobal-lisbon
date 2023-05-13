import { BigNumber, Contract } from 'ethers';

export type ERC20Contract = Contract | {
  balanceOf: (address: string) => Promise<BigNumber>;
  transfer: (address: string, amount: BigNumber) => Promise<void>;
  allowance: (owner: string, spender: string) => Promise<BigNumber>;
  approve: (spender: string, amount: BigNumber) => Promise<void>;
  transferFrom: (from: string, to: string, amount: BigNumber) => Promise<void>;
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
  borrow: (amount: BigNumber) => Promise<void>;
  repay: (amount: BigNumber) => Promise<void>;
  increaseCollateral: (amount: BigNumber) => Promise<void>;
  decreaseCollateral: (amount: BigNumber) => Promise<void>;
}

export type AnyContract = Contract | ERC20Contract | LenderContract;

export interface ScoreDate {
  verified: boolean;
  base: BigNumber;
  totalBorrowed: BigNumber;
  totalRepaid: BigNumber;
  totalCollateral: BigNumber;
}
