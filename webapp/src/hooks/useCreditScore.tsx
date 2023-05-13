import { useEffect, useState } from 'react';
import { Provider, getScoreData } from '../web3/contracts';
import { bnToScore } from '../utils';
import { ScoreData } from '../web3/types';

export function useCreditScore(address?: string, provider?: Provider) {
  const [creditScore, setCreditScore] = useState('0');

  useEffect(() => {
    if (!address || !provider) {
      return;
    }
    getScoreData(address, provider).then((score: ScoreData) => setCreditScore(bnToScore(score.base, 10)));
  });

  return [creditScore] as const;
}
