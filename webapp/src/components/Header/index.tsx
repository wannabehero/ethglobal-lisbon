import './style.css';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Layout, Space, Typography } from 'antd';


export default function Header() {
  return (
    <Layout.Header className="header">
      <Space direction="horizontal" size="large">
        <Typography.Title level={2}>
          <span style={{ color: 'white' }}>Credit Bureau</span>
        </Typography.Title>
        <ConnectButton />
      </Space>
    </Layout.Header>
  );
}
