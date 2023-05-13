import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { WagmiConfig } from 'wagmi';
import { ConnectButton, darkTheme, lightTheme, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { polygonMumbai } from 'wagmi/chains';
import { chains, wagmiClient } from './web3/wallet';

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
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
        theme={RAINBOW_THEME}
        initialChain={polygonMumbai}
        showRecentTransactions
        appInfo={{
          appName: 'Wingman',
        }}
      >
        <div>
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
        </div>
        <h1>Vite + React</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>count is {count}</button>
          <p>
            Edit <code>src/App.tsx</code> and save to test HMR
          </p>
        </div>
        <ConnectButton />;
        <p className="read-the-docs">Click on the Vite and React logos to learn more</p>
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
