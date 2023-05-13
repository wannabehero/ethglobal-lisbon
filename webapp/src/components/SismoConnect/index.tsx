import { CheckCircleOutlined } from '@ant-design/icons';
import { SismoConnect } from '@sismo-core/sismo-connect-client';
import { Tag, Button, message } from 'antd';
import { SISMO_CLAIM, SISMO_CONFIG, SISMO_GROUP_ID } from '../ClaimHelperCard/consts';
import { useAddRecentTransaction, useConnectModal } from '@rainbow-me/rainbowkit';
import { ContractTransaction } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useProvider, useAccount, useSigner } from 'wagmi';
import { getSismoHelper } from '../../web3/contracts';

export default function SismoConnectBody({ verified }: { verified: boolean }) {
  const { openConnectModal } = useConnectModal();

  const provider = useProvider();
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const addRecentTransaction = useAddRecentTransaction();

  const [isLoading, setIsLoading] = useState(false);

  const [hasSendVerify, setHasSendVerify] = useState(false);

  const reloadApp = useCallback(() => window.location.reload(), []);

  const onVerify = async (sismoConnectResponseBytes: string) => {
    console.log(`In sismo verification loop with ${sismoConnectResponseBytes}`);
    if (!signer) {
      if (!openConnectModal) {
        return message.error('Connect the wallet first');
      }
      return openConnectModal();
    }

    setIsLoading(true);
    try {
      const sismoHelper = await getSismoHelper(provider);
      const tx: ContractTransaction = await sismoHelper
        .connect(signer)
        .verify(SISMO_GROUP_ID, sismoConnectResponseBytes);
      addRecentTransaction({
        hash: tx.hash,
        description: 'Verify Nouns Ownership via Sismo Proof',
      });
      const receipt = await tx.wait();
      console.log(`Sismo transaction responded with: ${receipt}`);
      
      // TODO: check receipt and trigger stats reload?

      message.success('Nouns via Sismo Verified!');
    } catch (err: any) {
      console.log(err);
      message.error(err.reason ?? err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasSendVerify) {
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const sismoConnectResponse = urlParams.get('sismoConnectResponseCompressed');
    const storedValue = localStorage.getItem('sismo-connect');
    
    if (sismoConnectResponse && (!storedValue || storedValue === '')) {
      // create a new SismoConnect instance with the client configuration
      const sismoConnect = SismoConnect(SISMO_CONFIG);
      const sismoConnectResponseBytes = sismoConnect.getResponseBytes();
      if (sismoConnectResponseBytes) {
        console.log(`Sismo response proof: ${sismoConnectResponseBytes}`);

        // TODO: show loading and send verification response to the chain
        message.info('Sending verification to verify Sismo proof: ' + sismoConnectResponse);
        setHasSendVerify(true);
        onVerify(sismoConnectResponseBytes);
        localStorage.setItem('sismo-connect', sismoConnectResponseBytes);
      } else {
        console.log(`Failed to get sismo response: reverted`);
      }
    }
  }, [window.location.search, hasSendVerify]);

  const onSismoProofRequest = async () => {
    // create a new SismoConnect instance with the client configuration
    const sismoConnect = SismoConnect(SISMO_CONFIG);
    localStorage.setItem('sismo-connect', '');
    // The `request` function sends your user to the Sismo Vault App
    // to generate the proof of group membership
    // After the proof generation, the user is redirected with it to your app
    sismoConnect.request({ claim: SISMO_CLAIM });
  };

  return (
    <>
      {verified ? (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Noun owner! Wow!
        </Tag>
      ) : (
        <Button shape="round" onClick={onSismoProofRequest}>
          Proof Noun Ownership
        </Button>
      )}
    </>
  );
}
