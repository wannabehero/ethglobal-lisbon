import { Button, Card, Space } from 'antd';
import { IClaimHelperItem } from '../MainBureau/interfaces';
import TrueLayerZK from '../TrueLayerZK';
import WorldIDBody from '../WorldID';
import PolygonID from '../PolygonID';
import SismoConnectBody from '../SismoConnect';

interface ClaimHelperCardProps {
  item: IClaimHelperItem;
  onSuccess: (key: string) => void;
}

export default function ClaimHelperCard({ item, onSuccess }: ClaimHelperCardProps) {
  let component;
  let titleButton;
  switch (item.cardKey) {
    case 'wc-id':
      {
        component = (
          <WorldIDBody
            verified={item.verified}
            onSuccess={() => onSuccess(item.cardKey)}
          />
        );
        titleButton = (
          <Button
            type='dashed'
            onClick={() => open('https://simulator.worldcoin.org/', '_blank')}
          >
            Open simulator
          </Button>
        )
      }
      break;
    case 'true-layer':
      {
        component = (
          <TrueLayerZK
            verified={item.verified}
            enabled={item.enabled}
            onSuccess={() => onSuccess(item.cardKey)}
          />
        );
      }
      break;
    case 'sismo-noun':
      {
        component = (
          <SismoConnectBody
            verified={item.verified}
            enabled={item.enabled}
            onSuccess={() => onSuccess(item.cardKey)}
          />
        );
      }
      break;
    case 'polygon-id':
      {
        component = (
          <PolygonID
            verified={item.verified}
            enabled={item.enabled}
            onSuccess={() => onSuccess(item.cardKey)}
          />
        );
        titleButton = (
          <Button
            type='dashed'
            onClick={() => open('https://github.com/wannabehero/ethglobal-lisbon/blob/develop/chain/id/README.md', '_blank')}
          >
            Issue Claim
          </Button>
        );
      }
      break;
    default:
      component = <></>;
  }

  return (
    <Card
      title={
        <Space style={{justifyContent: 'space-between', width: '100%'}}>
          {item.label}
          {titleButton}
        </Space>
      }
    >
      {component}
    </Card>);
}
