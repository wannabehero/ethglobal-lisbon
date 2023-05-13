import { CredentialType, ISuccessResult, IDKitWidget, solidityEncode } from '@worldcoin/idkit';
import { message, Button, Tag } from 'antd';
import { ContractTransaction, ethers } from 'ethers';
import { useCallback, useState } from 'react';
import {
  WORLD_ID_APP_ACTION,
  WORLD_ID_APP_SIGNAL,
  WORLD_ID_APP_ID,
} from '../ClaimHelperCard/consts';
import { useAddRecentTransaction, useConnectModal } from '@rainbow-me/rainbowkit';
import { useProvider, useAccount, useSigner } from 'wagmi';
import { getCryptoBureau } from '../../web3/contracts';
import { CheckCircleOutlined } from '@ant-design/icons';

export default function WorldIDBody({ verified }: { verified: boolean }) {
  const { openConnectModal } = useConnectModal();

  const provider = useProvider();
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const addRecentTransaction = useAddRecentTransaction();

  const [isCreating, setIsCreating] = useState(false);

  const credential_types = [CredentialType.Orb];
  const onSuccessWorldID = (result: ISuccessResult) => {
    console.log(result);
    onRegister(result);
  };

  const handleProof = (result: ISuccessResult) => {
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), 3000);
      // NOTE: Example of how to decline the verification request and show an error message to the user
      console.log(result);
    });
  };

  const onRegister = useCallback(
    async (result: ISuccessResult) => {
      if (!result || !result.merkle_root || !result.proof) {
        return message.error('Proof generation failed! Please try again.');
      }
      if (!signer) {
        if (!openConnectModal) {
          return message.error('Connect the wallet first');
        }
        return openConnectModal();
      }

      setIsCreating(true);
      try {
        const unpackedProof = ethers.utils.defaultAbiCoder.decode(['uint256[8]'], result.proof)[0];

        const bureau = await getCryptoBureau(provider);
        const tx: ContractTransaction = await bureau
          .connect(signer)
          .register(result.merkle_root, result.nullifier_hash, unpackedProof);
        addRecentTransaction({
          hash: tx.hash,
          description: 'Verify World ID',
        });
        const receipt = await tx.wait();

        // TODO: check receipt and trigger stats reload?
        // setIsVerified(true);

        message.success('World ID Verified!');
      } catch (err: any) {
        console.log(err);
        message.error(err.reason ?? err.message);
      } finally {
        setIsCreating(false);
      }
    },
    [provider, signer, addRecentTransaction, message, openConnectModal],
  );

  return (
    <>
      {verified && (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Humanity Verified!
        </Tag>
      )}
      {!verified && (
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
      )}
    </>
  );
}
