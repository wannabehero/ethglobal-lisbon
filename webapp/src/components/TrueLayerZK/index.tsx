import { App, Button, Space, Spin } from 'antd';
import { useCallback, useEffect } from 'react';
import { getTrueLayerHelper } from '../../web3/contracts';
import { useSigner } from 'wagmi';

const AUTH_URL = 'http://localhost:3000/truelayer/auth';
const TARGET = 200;

const TrueLayerZK = () => {
  const { modal, message } = App.useApp();
  const { data: signer } = useSigner();

  const Pr = {"a":["0x2e880372af439d55cac1d9dfd5e8dc01d8f0e19efdc8a2c00c201579794fe4b2","0x0ac7f045ad9d3773df7d676286278e8421bb1d21f228a5b78524ba48425fb6a0"],"b":[["0x02a5f533efcb559dc4a0eafb9ffb5c1daffb62609e563fc06cb815f8bed28d6b","0x0d43b45ee003ed29f1d5f5282ad3156a461e4b66e2f0d37f0e5ec4980404cb30"],["0x018d575e68b0227e3fe40bc6b44d26c69409e27fd12b8fb1cf112fd19c7aa5e7","0x0acbab65293bb80275f315ec7edbd3a0b5ead8c2de090b6f7df90628ea6f3699"]],"c":["0x10345fb6c935700146e422f4e62be20a8bb500d4d80ba2dfb0f624df355dea6c","0x199731b8a4b4877af21c0344d0924467b8c5bceb9a10e21846c25007a6b5d06e"]};

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
      await helper.verify(TARGET, proof)
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

  // const openAuth = () => window.open(AUTH_URL);
  const openAuth = () => submitProof(Pr);

  return (
    <Button shape="round" onClick={openAuth}>
      Connect Bank Account
    </Button>
  );
};

export default TrueLayerZK;
