import type { AppProps } from "next/app";
import "../styles/globals.css";
import { abstractTestnet, abstract } from "viem/chains";
import { createPublicClient, http } from "viem";
import { AbstractWalletProvider } from "@abstract-foundation/agw-react";
import { abstractTestnetRPC } from "../utils/constant";

export const publicClient = createPublicClient({
  chain: abstract,
  transport: http(),
});

const config = {
  chain: abstract,
  transport: http(abstractTestnetRPC),
};

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AbstractWalletProvider chain={config.chain} transport={config.transport}>
      <Component {...pageProps} />
    </AbstractWalletProvider>
  );
}

export default MyApp;
