import { Button, Card, Descriptions, List, Typography } from 'antd';
import { useAccount, useProvider, useSigner } from 'wagmi';
import { useCreditScore } from '../../hooks/useCreditScore';

export default function MainBureau() {
  const provider = useProvider();
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const claimsData = [
    {
      key: 'wc-id',
      label: 'World ID',
      url: 'https://develop.worldcoin.org/',
      scoreRate: 0.2,
      // todo: data to get proof of identity
    },
    {
      key: 'sismo-noun',
      label: 'Noun owner with Sismo',
      url: 'https://sismo.io/',
      scoreRate: 0.05,
      // todo: data to get proof of ownership
    },
    {
      key: 'true-layer',
      label: 'Proof of Funds',
      url: 'https://truelayer.com/',
      scoreRate: 0.2,
      // todo: data to get proof of funds
    },
  ];

  // TODO: pull from smart contract
  const borrowedBalance = 0;

  // TODO: pull from smart contract
  const collateralBalance = 150;

  const creditScore = useCreditScore(address, provider);

  return (
    <div className="content-inner">
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
              renderItem={(item) => (
                <List.Item>
                  <Card title={item.label}>// here will be button + score details</Card>
                </List.Item>
              )}
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
