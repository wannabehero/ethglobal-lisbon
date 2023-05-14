import { App, Button, QRCode, Tag, message } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { query } from './query';
import { useState } from 'react';
import { getPolygonHelper } from '../../web3/contracts';
import { useProvider } from 'wagmi';

interface PolygonIDProps {
  verified: boolean;
  onSuccess: () => void;
}

const PolygonID = ({ verified, onSuccess }: PolygonIDProps) => {
  const provider = useProvider();
  const { modal } = App.useApp();

  const [isSuccess, setIsSuccess] = useState(false);

  const qr = <QRCode value={JSON.stringify(query)} color="#6e38cc" size={512} />;

  const listenToVerify = async (destroyModal: any) => {
    console.log(`Listening to verify for Polygon...`);
    const polygonContract = await getPolygonHelper(provider);
    polygonContract.once('ProofAccepted', () => {
      console.log(`Proof accepted for Polygon! Received the event!`);
      onSuccess();
      polygonContract.removeAllListeners('ProofAccepted');
      destroyModal();
      setIsSuccess(true);
      message.success('Diploma via Polygon ID Verified!');
    });
  };

  const onProof = () => {
    const { destroy } = modal.info({
      title: 'PolygonID ZK Diploma Verification',
      content: qr,
      width: 620,
      centered: true,
      okText: 'I am finished!',
    });

    listenToVerify(destroy);
  };

  return (
    <>
      {verified || isSuccess ? (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Educated enough
        </Tag>
      ) : (
        <Button shape="round" onClick={onProof}>
          Prove GPA Score
        </Button>
      )}
    </>
  );
};

export default PolygonID;
