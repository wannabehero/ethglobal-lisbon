import { App, Button, QRCode, Tag } from 'antd';
import { CheckCircleOutlined } from '@ant-design/icons';
import { query } from './query';
import { useState } from 'react';

interface PolygonIDProps {
  verified: boolean;
  onSuccess: () => void;
}

const PolygonID = ({ verified, onSuccess }: PolygonIDProps) => {
  const { modal } = App.useApp();

  const [isSuccess, setIsSuccess] = useState(false);

  const qr = (
    <QRCode
      value={JSON.stringify(query)}
      color='#6e38cc'
      size={512}
    />
  );

  const onProof = () => {
    modal.info({
      title: 'PolygonID ZK Diploma Verification',
      content: qr,
      width: 620,
      centered: true,
      okText: 'I am finished!',
      afterClose: () => {
        // alert('close');
        // OPTIONAL: watch transactions on Helper contract
        // TODO: update UI
      }
    });
  };

  return (
    <>
    {
      (verified || isSuccess) ? (
        <Tag icon={<CheckCircleOutlined />} color="success">
          Educated enough
        </Tag>
      ) : (
        <Button shape="round" onClick={onProof}>
          Prove GPA Score
        </Button>
      )
    }
    </>
  );
};

export default PolygonID;