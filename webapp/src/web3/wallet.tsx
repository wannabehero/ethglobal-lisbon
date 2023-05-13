import '@rainbow-me/rainbowkit/styles.css';

import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  braveWallet,
  coinbaseWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { configureChains, createClient } from 'wagmi';
import { polygonMumbai } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const ALCHEMY_KEY = '';

export const { chains, provider } = configureChains(
  [polygonMumbai],
  [publicProvider(), alchemyProvider({ apiKey: ALCHEMY_KEY })],
);

const connectors = connectorsForWallets([
  {
    groupName: 'Popular',
    wallets: [
      braveWallet({ chains }),
      metaMaskWallet({ chains }),
      coinbaseWallet({ appName: 'CryptoBureau', chains }),
      rainbowWallet({ chains }),
      walletConnectWallet({ chains }),
    ],
  }
]);

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
