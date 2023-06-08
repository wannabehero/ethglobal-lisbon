import { App, Button, Space, Spin, Tag } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { getTrueLayerHelper } from '../../web3/contracts';
import { useSigner } from 'wagmi';
import { CheckCircleOutlined } from '@ant-design/icons';

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL as string;
const AUTH_URL = `${BASE_URL}/truelayer/auth`;
const TARGET = 200;

interface TrueLayerZKProps {
  verified: boolean;
  enabled: boolean;
  onSuccess: () => void;
}

const TrueLayerZK = ({ verified, enabled, onSuccess }: TrueLayerZKProps) => {
  const { modal, message } = App.useApp();
  const { data: signer } = useSigner();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [proof, setProof] = useState<any>();

  const submitProof = useCallback(async (proof: any) => {
    if (!signer) {
      return message.error('Please connect your wallet first');
    }

    setIsLoading(true);

    const { destroy } = modal.info({
      title: 'Submit your Proof of Funds',
      content: <Space><Spin size='large' /></Space>,
      closable: false,
      centered: true,
      footer: null,
    });

    const helper = await getTrueLayerHelper(signer);

    try {
      const tx = await helper.verify(TARGET, proof);
      await tx.wait();
      setIsSuccess(true);
      message.success('Proof of Funds verified!');
      onSuccess();
    } catch (err: any) {
      message.error(err.reason ?? err.message);
    } finally {
      destroy();
      setIsLoading(false);
    }

  }, [signer, message, modal]);

  const receiveMessage = (event: MessageEvent) => {
    if (event.origin !== BASE_URL) return;

    setProof(event.data);
  }

  useEffect(() => {
    if (!proof || !signer) return;

    submitProof(proof);
  }, [proof, signer]);

  useEffect(() => {
    window.addEventListener('message', receiveMessage);
    return () => {
      window.removeEventListener('message', receiveMessage);
    };
  }, []);

  const openAuth = () => window.open(AUTH_URL);

  return (
    <>
    {
      (verified || isSuccess) ? (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Wealthy enough
        </Tag>
      ) : (
        <Button shape="round" onClick={openAuth} loading={isLoading} disabled={!enabled}>
          Prove old-school wealth
        </Button>
      )
    }
    </>
  );
};

export default TrueLayerZK;
