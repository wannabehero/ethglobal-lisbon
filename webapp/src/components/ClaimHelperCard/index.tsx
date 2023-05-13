import { Button, Card } from 'antd';
import { IClaimHelperItem } from '../MainBureau/interfaces';
import TrueLayerZK from '../TrueLayerZK';
import {
  SISMO_CLAIM,
  SISMO_CONFIG,
} from './consts';
import {
  SismoConnect,
} from '@sismo-core/sismo-connect-client';
import WorldIDBody from '../WorldID';

export default function ClaimHelperCard(item: IClaimHelperItem) {
  const onSismoProofRequest = async () => {
    // create a new SismoConnect instance with the client configuration
    const sismoConnect = SismoConnect(SISMO_CONFIG);
    localStorage.setItem('sismo-connect', '');
    // The `request` function sends your user to the Sismo Vault App
    // to generate the proof of group membership
    // After the proof generation, the user is redirected with it to your app
    sismoConnect.request({ claim: SISMO_CLAIM });
  };

  let component;
  switch (item.cardKey) {
    case 'wc-id':
      {
        component = <WorldIDBody />;
      }
      break;
    case 'true-layer':
      {
        component = <TrueLayerZK />;
      }
      break;
    case 'sismo-noun':
      {
        component = (
          <Button shape="round" onClick={onSismoProofRequest}>
            Proof Noun Ownership
          </Button>
        );
      }
      break;
    default:
      component = <></>;
  }

  return <Card title={item.label}>{component}</Card>;
}
