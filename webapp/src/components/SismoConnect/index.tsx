import { CheckCircleOutlined } from '@ant-design/icons';
import { Tag, Button, message } from 'antd';
import { SISMO_CLAIM, SISMO_CONFIG, SISMO_GROUP_ID } from '../ClaimHelperCard/consts';
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import { ContractTransaction } from 'ethers';
import { useEffect, useState } from 'react';
import { useSigner } from 'wagmi';
import { getSismoHelper } from '../../web3/contracts';
import { useSismoConnect } from '@sismo-core/sismo-connect-react';

interface SismoConnectProps {
  verified: boolean;
  onSuccess: () => void;
}

export default function SismoConnect({ verified, onSuccess }: SismoConnectProps) {
  const { data: signer } = useSigner();
  const addRecentTransaction = useAddRecentTransaction();

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { sismoConnect, responseBytes } = useSismoConnect({
    config: SISMO_CONFIG
  });

  const onVerify = async (responseBytes: string) => {
    console.log(`In sismo verification loop with ${responseBytes}`);
    if (!signer) {
      return message.error('Connect the wallet first');
    }

    setIsLoading(true);
    try {
      const sismoHelper = await getSismoHelper(signer);
      const tx: ContractTransaction = await sismoHelper
        .verify(SISMO_GROUP_ID, responseBytes);
      addRecentTransaction({
        hash: tx.hash,
        description: 'Verify Nouns Ownership via Sismo Proof',
      });
      const receipt = await tx.wait();
      console.log(`Sismo transaction responded with: ${receipt}`);

      setIsSuccess(true);
      onSuccess();
      message.success('Nouns via Sismo Verified!');
    } catch (err: any) {
      console.log(err);
      message.error(err.reason ?? err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const onSismoProofRequest = () => {
    sismoConnect.request({ claim: SISMO_CLAIM });
  };


  useEffect(() => {
    if (!responseBytes || !signer) return;
    onVerify(responseBytes);
  }, [responseBytes, signer]);

  return (
    <>
      {(verified || isSuccess) ? (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Noun owner! Wow!
        </Tag>
      ) : (
        <Button
          shape="round"
          onClick={onSismoProofRequest}
          loading={isLoading}
        >
          Prove Noun Ownership
        </Button>
      )}
    </>
  );
}
