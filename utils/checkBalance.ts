import { publicClient } from "../pages/_app";

export const checkBalance = async (
  address: `0x${string}`
): Promise<boolean> => {
  const balance = await publicClient.getBalance({ address });
  return balance > 10000000000000;
};
