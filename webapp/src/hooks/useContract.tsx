import { useEffect, useState } from 'react';
import { useProvider, useSigner } from 'wagmi';
import { Signer, providers } from 'ethers';
import { AnyContract } from '../web3/types';

const useContract = <C extends AnyContract,>(
  address: string,
  loader: (address: string, signerOrProvider: Signer | providers.Provider) => Promise<C>
) => {
  const provider = useProvider();
  const { data: signer } = useSigner();
  const [contract, setContract] = useState<C | null>(null);

  useEffect(() => {
    if (!provider && !signer) {
      return;
    }
    loader(address, signer ?? provider)
      .then(setContract);
  }, [provider, signer, setContract]);

  return { contract };
};

export default useContract;
