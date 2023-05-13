import { App, Button, Descriptions, List, Result, Spin, Typography } from 'antd';
import { useAccount, useProvider, useSigner } from 'wagmi';
import { useCreditScore } from '../../hooks/useCreditScore';
import ClaimHelperCard from '../ClaimHelperCard';
import { IClaimHelperItem } from './interfaces';
import { SismoConnect } from '@sismo-core/sismo-connect-client';
import { SISMO_CONFIG } from '../ClaimHelperCard/consts';
import { useHelperClaims } from './hooks';

export default function MainBureau() {
  const { helperClaims, isLoading, reloadHelperClaims } = useHelperClaims();
  const { modal, message } = App.useApp();

  const reloadButton = <Button onClick={reloadHelperClaims}>Reload</Button>;

  const provider = useProvider();
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const claimsData: IClaimHelperItem[] = [
    {
      cardKey: 'wc-id',
      label: 'World ID',
      url: 'https://develop.worldcoin.org/',
      scoreRate: '0.2',
      verified: false,
    },
    {
      cardKey: 'sismo-noun',
      label: 'Noun owner with Sismo',
      url: 'https://sismo.io/',
      scoreRate: '0.05',
      verified: false,
    },
    {
      cardKey: 'true-layer',
      label: 'ZK Proof of Funds',
      url: 'https://truelayer.com/',
      scoreRate: '0.2',
      verified: false,
    },
    {
      cardKey: 'polygon-id',
      label: 'ZP Proof of Diploma',
      url: 'https://polygon.technology/',
      scoreRate: '0.1',
      verified: false,
    },
  ];

  // TODO: pull from smart contract
  const borrowedBalance = 0;

  // TODO: pull from smart contract
  const collateralBalance = 150;

  const creditScore = useCreditScore(address, provider);

  const urlParams = new URLSearchParams(window.location.search);
  const sismoConnectResponse = urlParams.get('sismoConnectResponseCompressed');
  const storedValue = localStorage.getItem('sismo-connect');
  if (sismoConnectResponse && (!storedValue || storedValue === '')) {
    // create a new SismoConnect instance with the client configuration
    const sismoConnect = SismoConnect(SISMO_CONFIG);
    const sismoConnectResponseBytes = sismoConnect.getResponseBytes();
    if (sismoConnectResponseBytes) {
      console.log(`Sismo response proof: ${sismoConnectResponseBytes}`);

      // TODO: show loading and send verification response to the chain
      message.info('Sending verification to verify Sismo proof: ' + sismoConnectResponse);
      localStorage.setItem('sismo-connect', sismoConnectResponseBytes);
    } else {
      console.log(`Failed to get sismo response: reverted`);
    }
  }

  return (
    <div className="content-inner">
      {isLoading && <Spin tip="Loading" />}
      {!isLoading && helperClaims === undefined && (
        <Result status="error" title="Cannot load markets" extra={reloadButton} />
      )}
      {!address && <Typography.Title level={3}> Please connect your wallet </Typography.Title>}
      {address && (
        <Descriptions layout="vertical" bordered column={3}>
          <Descriptions.Item label="Address" span={2}>
            {address}
          </Descriptions.Item>
          <Descriptions.Item label="Credit Score">{creditScore}</Descriptions.Item>
          <Descriptions.Item label="Score Goals" span={3}>
            <List
              grid={{ gutter: 16, column: 4 }}
              dataSource={claimsData}
              renderItem={(item) => {
                item.verified =
                  helperClaims?.find((claim) => claim.id === item.cardKey)?.verified || false;
                return (
                  <List.Item>
                    <ClaimHelperCard {...item} />
                  </List.Item>
                );
              }}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Borrowed Balance">{borrowedBalance}</Descriptions.Item>
          <Descriptions.Item>
            <Button type="primary">Borrow</Button>
          </Descriptions.Item>
          <Descriptions.Item>
            <Button type="primary">Repay</Button>
          </Descriptions.Item>
          <Descriptions.Item label="Collateral Balance">{collateralBalance}</Descriptions.Item>
          <Descriptions.Item>
            <Button type="primary">Increase</Button>
          </Descriptions.Item>
          <Descriptions.Item>
            <Button type="primary">Withdraw</Button>
          </Descriptions.Item>
        </Descriptions>
      )}
    </div>
  );
}
