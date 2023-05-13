import { Card } from 'antd';
import { IClaimHelperItem } from '../MainBureau/interfaces';
import TrueLayerZK from '../TrueLayerZK';
import WorldIDBody from '../WorldID';
import PolygonID from '../PolygonID';
import SismoConnectBody from '../SismoConnect';

interface ClaimHelperCardProps {
  item: IClaimHelperItem;
  onSuccess: () => void;
}

export default function ClaimHelperCard({ item, onSuccess }: ClaimHelperCardProps) {

  let component;
  switch (item.cardKey) {
    case 'wc-id':
      {
        component = <WorldIDBody verified={item.verified} onSuccess={onSuccess} />;
      }
      break;
    case 'true-layer':
      {
        component = <TrueLayerZK verified={item.verified} onSuccess={onSuccess} />;
      }
      break;
    case 'sismo-noun':
      {
        component = <SismoConnectBody verified={item.verified} onSuccess={onSuccess} />;
      }
      break;
    case 'polygon-id':
      {
        component = <PolygonID verified={item.verified} onSuccess={onSuccess} />;
      }
      break;
    default:
      component = <></>;
  }

  return <Card title={item.label}>{component}</Card>;
}
