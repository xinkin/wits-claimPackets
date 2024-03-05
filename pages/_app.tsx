import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import "../styles/globals.css";

import { RainbowKitProvider, getDefaultConfig } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { skaleNebula, skaleNebulaTestnet } from "wagmi/chains";

const config = getDefaultConfig({
  appName: "RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: [skaleNebulaTestnet, skaleNebula],
  ssr: true,
});

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={client}>
        <RainbowKitProvider>
          <Component {...pageProps} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default MyApp;
