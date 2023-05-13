import { CredentialType, ISuccessResult, IDKitWidget, solidityEncode } from '@worldcoin/idkit';
import { message, Button, Tag } from 'antd';
import { ContractTransaction, ethers } from 'ethers';
import { useCallback, useState } from 'react';
import {
  WORLD_ID_APP_ACTION,
  WORLD_ID_APP_SIGNAL,
  WORLD_ID_APP_ID,
} from '../ClaimHelperCard/consts';
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import { useProvider, useAccount, useSigner } from 'wagmi';
import { getCryptoBureau } from '../../web3/contracts';
import { CheckCircleOutlined } from '@ant-design/icons';

interface WorldIDProps {
  verified: boolean;
  onSuccess: () => void;
}

export default function WorldID({ verified, onSuccess }: WorldIDProps) {
  const provider = useProvider();
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const addRecentTransaction = useAddRecentTransaction();

  const [isCreating, setIsCreating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const credential_types = [CredentialType.Orb];
  const onSuccessWorldID = (result: ISuccessResult) => {
    console.log(result);
    onRegister(result);
  };

  const onRegister = useCallback(
    async (result: ISuccessResult) => {
      if (!result || !result.merkle_root || !result.proof) {
        return message.error('Proof generation failed! Please try again.');
      }
      if (!signer) {
        return message.error('Connect the wallet first');
      }

      setIsCreating(true);
      try {
        const unpackedProof = ethers.utils.defaultAbiCoder.decode(['uint256[8]'], result.proof)[0];

        const bureau = await getCryptoBureau(signer);
        const tx: ContractTransaction = await bureau
          .register(result.merkle_root, result.nullifier_hash, unpackedProof);
        addRecentTransaction({
          hash: tx.hash,
          description: 'Verify World ID',
        });
        await tx.wait();
        onSuccess();
        setIsSuccess(true);
        message.success('World ID Verified!');
      } catch (err: any) {
        console.log(err);
        message.error(err.reason ?? err.message);
      } finally {
        setIsCreating(false);
      }
    },
    [provider, signer, addRecentTransaction, message],
  );

  return (
    <>
      {(verified || isSuccess) && (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Sapiens enough
        </Tag>
      )}
      {!(verified || isSuccess) && (
        <IDKitWidget
          action={WORLD_ID_APP_ACTION}
          signal={solidityEncode(['address'], [address || WORLD_ID_APP_SIGNAL])}
          onSuccess={onSuccessWorldID}
          app_id={WORLD_ID_APP_ID}
          credential_types={credential_types}
        >
          {({ open }) => (
            <Button shape="round" onClick={open} loading={isCreating}>
              Prove Humanity
            </Button>
          )}
        </IDKitWidget>
      )}
    </>
  );
}
