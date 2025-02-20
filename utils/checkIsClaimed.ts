import { ethers } from "ethersv5";
import { deployedContractAddress } from "../utils/constant";
import ABI from "./abi.json";
import { abstractTestnet } from "viem/chains";

export async function checkIsPacketClaimed(leaf: string) {
  const provider = new ethers.providers.JsonRpcProvider(
    abstractTestnet?.rpcUrls?.default.http[0],
  );

  const abi = ABI;
  const contractAddress = deployedContractAddress;

  const contract = new ethers.Contract(contractAddress, abi, provider);

  try {
    const argument = leaf;
    const result = await contract.isClaimed(argument);
    return result;
  } catch (error) {
    console.error("Error reading contract function:", error);
  }
}
