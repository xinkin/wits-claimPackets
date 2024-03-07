import { createConfig, http } from "@wagmi/core";
import { skaleNebulaTestnet } from "@wagmi/core/chains";

export const config = createConfig({
  chains: [skaleNebulaTestnet],
  transports: {
    [skaleNebulaTestnet.id]: http(),
  },
});
