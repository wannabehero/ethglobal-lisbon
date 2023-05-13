import { App, Button, Space, Spin } from 'antd';
import { useCallback, useEffect } from 'react';
import { getTrueLayerHelper } from '../../web3/contracts';
import { useSigner } from 'wagmi';

const AUTH_URL = 'http://localhost:3000/truelayer/auth';
const TARGET = 200;

const TrueLayerZK = () => {
  const { modal, message } = App.useApp();
  const { data: signer } = useSigner();

  const submitProof = useCallback(async (proof: any) => {
    if (!signer) {
      return message.error('Please connect your wallet first');
    }

    const { destroy } = modal.info({
      title: 'Submit your Proof of Funds',
      content: <Space><Spin size='large' /></Space>,
      closable: false,
      centered: true,
      footer: null,
    });

    const helper = await getTrueLayerHelper(signer);

    try {
      await helper.verify(TARGET, proof);
    } catch (err: any) {
      message.error(err.reason ?? err.message);
    } finally {
      destroy();
    }

  }, [signer, message, modal]);

  const receiveMessage = (event: MessageEvent) => {
    if (event.origin !== "http://localhost:3000") return;

    submitProof(event.data);
  }

  useEffect(() => {
    window.addEventListener('message', receiveMessage);
    return () => {
      window.removeEventListener('message', receiveMessage);
    };
  }, []);

  const openAuth = () => window.open(AUTH_URL);

  return (
    <Button shape="round" onClick={openAuth}>
      Connect Bank Account
    </Button>
  );
};

export default TrueLayerZK;
