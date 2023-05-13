import { BigNumber } from 'ethers';

// TODO: Add your types here

export interface ScoreDate {
  verified: boolean;
  base: BigNumber;
  totalBorrowed: BigNumber;
  totalRepaid: BigNumber;
  totalCollateral: BigNumber;
}
