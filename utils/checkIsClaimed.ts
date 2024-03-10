import { ethers } from "ethersv5";
import { skaleNebulaTestnetCustom } from "../utils/chainTestnet";
import { deployedContratAddress } from "../utils/constant";
import ABI from "./abi.json";

export async function checkIsPacketClaimed(leaf: string) {
  // 1. Connect to Ethereum provider
  const provider = new ethers.providers.JsonRpcProvider(
    skaleNebulaTestnetCustom?.rpcUrls?.default.http[0]
  );

  // 2. Define ABI and contract address
  const abi = ABI;
  const contractAddress = deployedContratAddress;

  // 3. Get an instance of your smart contract
  const contract = new ethers.Contract(contractAddress, abi, provider);

  try {
    // 4. Call the function you want to read with the argument(s)
    const argument = leaf;
    const result = await contract.isClaimed(argument);
    console.log("result", result);
    return result;
  } catch (error) {
    console.error("Error reading contract function:", error);
  }
}
