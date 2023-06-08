import { useCallback, useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { getCryptoBureau, getHelperClaims } from '../../web3/contracts';
import useContract from '../../hooks/useContract';
import { CRYPTO_BUREAU_ADDRESS } from '../../web3/consts';

export interface HelperClaim {
  id: string;
  verified: boolean;
  enabled: boolean;
}

export const useHelperClaims = () => {
  const { contract: cryptoBureau } = useContract(CRYPTO_BUREAU_ADDRESS, getCryptoBureau);
  const { address } = useAccount();

  const [helperClaims, setHelperClaims] = useState<HelperClaim[]>();

  const reloadHelperClaims = useCallback(async (address: string) => {
    if (!cryptoBureau) {
      return;
    }

    try {
      const claims = await getHelperClaims(cryptoBureau, address);
      setHelperClaims(claims);
      console.log(`Loaded claims: ${JSON.stringify(claims)}`);
    } catch (e) {
      console.error(e);
    }
  }, [setHelperClaims, cryptoBureau]);

  useEffect(() => {
    if (!address || !cryptoBureau) {
      return;
    }
    reloadHelperClaims(address);
  }, [address, cryptoBureau]);

  const enableAllClaims = useCallback(() => {
    if (!helperClaims) {
      return;
    }

    const claims = helperClaims.map((claim) => ({
      ...claim,
      enabled: true,
    }));

    setHelperClaims(claims);
  }, [helperClaims, setHelperClaims]);

  return { helperClaims, reloadHelperClaims, enableAllClaims };
};
