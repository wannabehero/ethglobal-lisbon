import { Button, Card } from 'antd';
import { IClaimHelperItem } from '../MainBureau/interfaces';
import { useProvider, useAccount } from 'wagmi';
import { CredentialType, IDKitWidget, ISuccessResult } from '@worldcoin/idkit';
import TrueLayerZK from '../TrueLayerZK';
import { SISMO_CLAIM, SISMO_CONFIG, WORLD_ID_APP_ACTION, WORLD_ID_APP_ID, WORLD_ID_APP_SIGNAL } from './consts';
import {
  ClaimRequest,
  SismoConnect,
  SismoConnectClientConfig,
} from '@sismo-core/sismo-connect-client';
import PolygonID from '../PolygonID';

export default function ClaimHelperCard(item: IClaimHelperItem) {
  const provider = useProvider();
  const { address } = useAccount();

  const credential_types = [CredentialType.Orb];

  const onSuccessWorldID = (result: ISuccessResult) => {
    console.log(result);
  };

  const onSismoProofRequest = async () => {
    // create a new SismoConnect instance with the client configuration
    const sismoConnect = SismoConnect(SISMO_CONFIG);
    localStorage.setItem("sismo-connect", "");
    // The `request` function sends your user to the Sismo Vault App
    // to generate the proof of group membership
    // After the proof generation, the user is redirected with it to your app
    sismoConnect.request({ claim: SISMO_CLAIM });
  };

  let component;
  switch (item.cardKey) {
    case 'wc-id':
      {
        component = (
          <IDKitWidget
            action={WORLD_ID_APP_ACTION}
            signal={address || WORLD_ID_APP_SIGNAL}
            onSuccess={onSuccessWorldID}
            app_id={WORLD_ID_APP_ID}
            credential_types={credential_types}
            // walletConnectProjectId="get_this_from_walletconnect_portal"
          >
            {({ open }) => (
              // TODO: add World ID icon icon={<icon here />}
              <Button shape="round" onClick={open}>
                Proof Humanity
              </Button>
            )}
          </IDKitWidget>
        );
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
    case 'polygon-id':
      {
        component = (
          <PolygonID />
        );
      }
      break;
    default:
      component = <></>;
  }

  return <Card title={item.label}>{component}</Card>;
}
