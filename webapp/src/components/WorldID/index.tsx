import { CredentialType, ISuccessResult, IDKitWidget, solidityEncode } from '@worldcoin/idkit';
import { message, Button } from 'antd';
import { BigNumberish, ContractTransaction } from 'ethers';
import { useCallback, useState } from 'react';
import {
  WORLD_ID_APP_ACTION,
  WORLD_ID_APP_SIGNAL,
  WORLD_ID_APP_ID,
} from '../ClaimHelperCard/consts';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useProvider, useAccount, useSigner } from 'wagmi';
import { getCryptoBureau } from '../../web3/contracts';

export default function WorldIDBody() {
  const { openConnectModal } = useConnectModal();

  const provider = useProvider();
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const [isCreating, setIsCreating] = useState(false);

  const credential_types = [CredentialType.Orb];
  const onSuccessWorldID = (result: ISuccessResult) => {
    console.log(result);
  };

  const handleProof = (result: ISuccessResult) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 3000);
      // NOTE: Example of how to decline the verification request and show an error message to the user
      console.log(result);
    });
  };

  // const onRegister = useCallback(
  //     async (result: ISuccessResult) => {
  //       if (!result || !result.merkle_root || !result.proof) {
  //         return message.error('Proof generation failed! Please try again.');
  //       }
  //       if (!signer) {
  //         if (!openConnectModal) {
  //           return message.error('Connect the wallet first');
  //         }
  //         return openConnectModal();
  //       }

  //       setIsCreating(true);
  //       try {
  //         const { merkle_root, nullifier_hash, proof } = result;

  //         const bureau = await getCryptoBureau(provider);
  //         const tx: ContractTransaction = await bureau
  //           .connect(signer)
  //           .register(betYes, request, { value });
  //         addRecentTransaction({
  //           hash: tx.hash,
  //           description: 'Create market',
  //         });
  //         const receipt = await tx.wait();
  //         const marketAddress = await findMarketAddress(insurance, receipt);
  //         if (marketAddress) {
  //           await viewMarket(marketAddress);
  //         }
  //         setMarketCreateData(null);
  //         message.success('Market created');
  //       } catch (err: any) {
  //         console.log(err);
  //         message.error(err.reason ?? err.message);
  //       } finally {
  //         setIsCreating(false);
  //       }
  //     },
  //     [
  //       provider,
  //       marketCreateData,
  //       signer,
  //       viewMarket,
  //       addRecentTransaction,
  //       message,
  //       openConnectModal,
  //     ],
  //   );

  return (
    <IDKitWidget
      action={WORLD_ID_APP_ACTION}
      signal={solidityEncode(['address'], [address || WORLD_ID_APP_SIGNAL])}
      onSuccess={onSuccessWorldID}
      // handleVerify={handleProof}
      app_id={WORLD_ID_APP_ID}
      credential_types={credential_types}
      // walletConnectProjectId="get_this_from_walletconnect_portal"
    >
      {({ open }) => (
        // TODO: add World ID icon icon={<icon here />}
        <Button shape="round" onClick={open}>
          Proof Humanity
        </Button>
      )}
    </IDKitWidget>
  );
}
