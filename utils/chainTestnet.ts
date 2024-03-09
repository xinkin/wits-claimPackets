import { Chain } from "wagmi";

export const skaleNebulaTestnetCustom = {
  id: 37084624,
  name: "SKALE Nebula Hub Testnet",
  network: "SKALE Nebula Hub Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "sFUEL",
    symbol: "sFUEL",
  },
  rpcUrls: {
    public: {
      http: ["https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet"],
    },
    default: {
      http: ["https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet"],
    },
  },
  blockExplorers: {
    etherscan: {
      name: "SnowTrace",
      url: "https://lanky-ill-funny-testnet.explorer.testnet.skalenodes.com",
    },
    default: {
      name: "SnowTrace",
      url: "https://lanky-ill-funny-testnet.explorer.testnet.skalenodes.com",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 11_907_934,
    },
  },
} as const satisfies Chain;
