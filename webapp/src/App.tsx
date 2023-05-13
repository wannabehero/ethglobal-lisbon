import { useState } from 'react';
import './App.css';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { WagmiConfig } from 'wagmi';
import { ConnectButton, darkTheme, lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { polygonMumbai } from 'wagmi/chains';
import { chains, wagmiClient } from './web3/wallet';
import { App as AntApp, ConfigProvider, Layout } from 'antd';
import Header from './components/Header';
import MainBureau from './components/MainBureau';

function App() {
  const [count, setCount] = useState(0);
  const ACCENT_COLOR = '#4A90E2';
  const BORDER_RADIUS = 6;
  const RAINBOW_THEME = {
    darkMode: darkTheme({
      fontStack: 'system',
      accentColor: ACCENT_COLOR,
    }),
    lightMode: lightTheme({
      fontStack: 'system',
      accentColor: ACCENT_COLOR,
    }),
  };

  RAINBOW_THEME.darkMode.radii.connectButton = `${BORDER_RADIUS}px`;
  RAINBOW_THEME.lightMode.radii.connectButton = `${BORDER_RADIUS}px`;

  return (
    <>
      <WagmiConfig client={wagmiClient}>
        <RainbowKitProvider
          chains={chains}
          // theme={RAINBOW_THEME}
          initialChain={polygonMumbai}
          showRecentTransactions
          appInfo={{
            appName: 'Credit Bureau',
          }}
        >
          <ConfigProvider
            theme={{ token: { colorPrimary: ACCENT_COLOR, borderRadius: BORDER_RADIUS } }}
          >
            <AntApp>
              <Layout className="app-layout">
                <Header />
                <Layout>
                  <Layout.Content className="app-content">
                    <MainBureau />
                  </Layout.Content>
                </Layout>
              </Layout>
            </AntApp>
          </ConfigProvider>
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
}

export default App;
