import { useEffect, useState } from 'react';
import { getCryptoBureau } from '../web3/contracts';
import { bnToScore } from '../utils';
import { useAccount, useProvider } from 'wagmi';
import useContract from './useContract';
import { CRYPTO_BUREAU_ADDRESS } from '../web3/consts';

export function useCreditScore() {
  const provider = useProvider();
  const { address } = useAccount();

  const [creditScore, setCreditScore] = useState('0.0000');
  const [collateralCoef, setCollateralCoef] = useState('1.5000');

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
      setCreditScore(bnToScore(data.base, 4))
      setCollateralCoef(bnToScore(score.collateralCoef, 4))
    } catch {
      setCreditScore('0.0000')
      setCollateralCoef('1.5000')
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
