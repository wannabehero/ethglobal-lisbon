import { BigNumberish, ethers } from 'ethers';

export function bnToScore(
  tokenValue: BigNumberish,
  decimals = 0,
): string {
  const value = ethers.utils.formatEther(tokenValue);
  const numberValue = parseFloat(value);
  return numberValue.toFixed(decimals);
}

export function bnToMATIC(tokenValue: BigNumberish, addSymbol = false, decimals = 2): string {
  const value = ethers.utils.formatEther(tokenValue);
  const numberValue = parseFloat(value);
  const symbolString = addSymbol ? ' MATIC' : '';
  return numberValue.toFixed(decimals) + symbolString;
}
