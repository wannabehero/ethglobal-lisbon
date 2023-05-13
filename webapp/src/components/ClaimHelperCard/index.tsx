import { Button, Card, Tag } from 'antd';
import { IClaimHelperItem } from '../MainBureau/interfaces';
import TrueLayerZK from '../TrueLayerZK';
import { SISMO_CLAIM, SISMO_CONFIG } from './consts';
import { SismoConnect } from '@sismo-core/sismo-connect-client';
import WorldIDBody from '../WorldID';
import PolygonID from '../PolygonID';
import { CheckCircleOutlined } from '@ant-design/icons';
import SismoConnectBody from '../SismoConnect';

export default function ClaimHelperCard(item: IClaimHelperItem) {

  let component;
  switch (item.cardKey) {
    case 'wc-id':
      {
        component = <WorldIDBody verified={item.verified} />;
      }
      break;
    case 'true-layer':
      {
        component = <TrueLayerZK />;
      }
      break;
    case 'sismo-noun':
      {
        component = <SismoConnectBody verified={item.verified} />;
      }
      break;
    case 'polygon-id':
      {
        component = <PolygonID />;
      }
      break;
    default:
      component = <></>;
  }

  return <Card title={item.label}>{component}</Card>;
}
