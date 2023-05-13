import { App, Button, QRCode } from 'antd';
import { query } from './query';

const PolygonID = () => {
  const { modal } = App.useApp();

  const qr = (
    <QRCode
      value={JSON.stringify(query)}
      color='#6e38cc'
      size={512}
    />
  );

  const onProof = () => {
    modal.info({
      title: 'PolygonID ZK Age Verification',
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
    <Button shape="round" onClick={onProof}>
      Proof Age
    </Button>
  );
};

export default PolygonID;