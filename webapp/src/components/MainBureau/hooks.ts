import { useCallback, useEffect, useState } from 'react';
import { useProvider, useAccount } from 'wagmi';
import { getHelperClaims } from '../../web3/contracts';

export interface HelperClaim {
  id: string;
  verified: boolean;
}

export const useHelperClaims = () => {
  const provider = useProvider();
  const { address } = useAccount();

  const [helperClaims, setHelperClaims] = useState<HelperClaim[]>();
  const [isLoading, setIsLoading] = useState(false);

  const reloadHelperClaims = useCallback(async () => {
    setIsLoading(true);
    try {
      const claims = await getHelperClaims(address, provider);
      setHelperClaims(claims);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [setHelperClaims, setIsLoading]);

  useEffect(() => {
    reloadHelperClaims();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { helperClaims, isLoading, reloadHelperClaims };
};
