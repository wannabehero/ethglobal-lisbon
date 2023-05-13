import { useEffect, useState } from 'react';
import { getScoreData } from '../web3/contracts';
import { bnToScore } from '../utils';
import { ScoreData } from '../web3/types';
import { useAccount, useProvider } from 'wagmi';

export function useCreditScore() {
  const provider = useProvider();
  const { address } = useAccount();
  const [creditScore, setCreditScore] = useState('0');

  const reloadScore = () => {
    if (!address || !provider) {
      return;
    }
    getScoreData(address, provider)
      .then((score: ScoreData) => setCreditScore(bnToScore(score.base, 10)));
  };

  useEffect(() => {
    if (!address || !provider) {
      return;
    }
    reloadScore();
  }, [address, provider]);

  return { creditScore, reloadScore };
}
