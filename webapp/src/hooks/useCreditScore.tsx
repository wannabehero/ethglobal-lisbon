import { useEffect, useState } from 'react';
import { getCryptoBureau } from '../web3/contracts';
import { useAccount, useProvider } from 'wagmi';
import useContract from './useContract';
import { CRYPTO_BUREAU_ADDRESS } from '../web3/consts';
import { ethers } from 'ethers';

const DEFAULT_SCORE = ethers.utils.parseEther('0');
const DEFAULT_COEF = ethers.utils.parseEther('0');

export function useCreditScore() {
  const provider = useProvider();
  const { address } = useAccount();

  const [creditScore, setCreditScore] = useState(DEFAULT_SCORE);
  const [collateralCoef, setCollateralCoef] = useState(DEFAULT_COEF);

  const { contract: cryptoBureau } = useContract(CRYPTO_BUREAU_ADDRESS, getCryptoBureau)

  const reloadScore = async () => {
    if (!address || !cryptoBureau) {
      return;
    }
    try {
      const [data, score] = await Promise.all([
        cryptoBureau.scoreData(address),
        cryptoBureau.score(address)
      ]);
      setCreditScore(data.base)
      setCollateralCoef(score.collateralCoef)
    } catch {
      setCreditScore(DEFAULT_SCORE)
      setCollateralCoef(DEFAULT_COEF)
    }
  };

  useEffect(() => {
    if (!address || !cryptoBureau) {
      return;
    }
    reloadScore();
  }, [address, provider, cryptoBureau]);

  return { creditScore, collateralCoef, reloadScore };
}
