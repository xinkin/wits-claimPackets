import type { AppProps } from "next/app";
import "../styles/globals.css";
import { abstract } from "viem/chains";
import { createPublicClient, http } from "viem";
import { AbstractWalletProvider } from "@abstract-foundation/agw-react";
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export const publicClient = createPublicClient({
  chain: abstract,
  transport: http(),
});

const config = {
  chain: abstract,
  transport: http(abstract.rpcUrls.default.http[0]),
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AbstractWalletProvider
      chain={config.chain}
      transport={config.transport}
      queryClient={queryClient}
    >
      <Component {...pageProps} />
    </AbstractWalletProvider>
  );
}

export default MyApp;
