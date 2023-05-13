import { useEffect, useState } from 'react';
import { Provider, getScoreData } from '../web3/contracts';
import { bnToScore } from '../utils';

export function useCreditScore(address?: string, provider?: Provider) {
  const [creditScore, setCreditScore] = useState('0');

  function handleScoreChange(creditScore: string) {
    setCreditScore(creditScore);
  }

  useEffect(() => {
    if (!address || !provider) {
      return;
    }
    console.log('useCreditScore', address, provider);
    getScoreData(address, provider).then((score) => handleScoreChange(bnToScore(score)));
  });

  return [creditScore] as const;
}
