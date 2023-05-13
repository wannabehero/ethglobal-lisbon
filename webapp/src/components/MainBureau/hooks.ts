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

  const reloadHelperClaims = useCallback(async (address: string) => {
    try {
      const claims = await getHelperClaims(address, provider);
      setHelperClaims(claims);
      console.log(`Loaded claims: ${JSON.stringify(claims)}`);
    } catch (e) {
      console.error(e);
    }
  }, [setHelperClaims, provider]);

  useEffect(() => {
    if (!address) {
      return;
    }
    reloadHelperClaims(address);
  }, [address]);

  return { helperClaims, reloadHelperClaims };
};
