import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import "../styles/globals.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import {
  configureChains,
  createConfig,
  usePublicClient,
  WagmiConfig,
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { skaleNebula } from "viem/chains";
import { createPublicClient, createWalletClient, http } from "viem";

export const { chains, webSocketPublicClient } = configureChains(
  [skaleNebula],
  [publicProvider()]
);

export const publicClient = createPublicClient({
  chain: skaleNebula,
  transport: http(),
});

export const walletClient = createWalletClient({
  chain: skaleNebula,
  transport: http(),
});

const { connectors } = getDefaultWallets({
  appName: "wits",
  projectId: "151fefc365d4d7e68f0272463d8e7c34",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
