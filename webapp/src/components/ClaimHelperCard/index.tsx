import { Button, Card } from 'antd';
import { IClaimHelperItem } from '../MainBureau/interfaces';
import { useProvider, useAccount } from 'wagmi';
import { CredentialType, IDKitWidget, ISuccessResult } from '@worldcoin/idkit';
import { WORLD_ID_APP_ACTION, WORLD_ID_APP_ID, WORLD_ID_APP_SIGNAL } from './consts';

export default function ClaimHelperCard(item: IClaimHelperItem) {
  const provider = useProvider();
  const { address } = useAccount();

  const credential_types = [CredentialType.Orb];

  const onSuccessWorldID = (result: ISuccessResult) => {
    console.log(result);
  };

  console.log(item);

  return (
    <Card title={item.label}>
      {item.cardKey === 'wc-id' && (
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
      )}
    </Card>
  );
}
