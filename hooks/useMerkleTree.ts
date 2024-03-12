"use client";
import { ethers } from "ethersv5";
import KECCAK256 from "keccak256";
import { MerkleTree } from "merkletreejs";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { checkIsPacketClaimed } from "../utils/checkIsClaimed";

interface MintRequest {
  id: number;
  amount: number;
}
export interface UserPacket {
  id: number;
  isClaimed: boolean;
  request: MintRequest;
  address: string;
}
interface MerkleTreeResponse {
  root: string;
  leavesBuffer: Uint8Array[];
  leaves: string[];
}

const mintRequests: MintRequest[] = [
  { id: 1, amount: 100 },
  { id: 2, amount: 200 },
  { id: 2, amount: 100 },
  { id: 2, amount: 300 },
  { id: 3, amount: 100 },
  { id: 3, amount: 200 },
  { id: 4, amount: 100 },
  { id: 4, amount: 200 },
  { id: 2, amount: 600 },
  { id: 2, amount: 500 },
  { id: 1, amount: 500 },
  { id: 2, amount: 500 },
  { id: 3, amount: 100 },
  { id: 2, amount: 200 },
  { id: 1, amount: 300 },
  { id: 4, amount: 400 },
];

// Setup addresses
const accounts: string[] = [
  "0x3B502B054715A8e0D8F657169615A88B2CCDD429",
  "0x9cA70B93CaE5576645F5F069524A9B9c3aef5006",
  "0x3B502B054715A8e0D8F657169615A88B2CCDD429",
  "0x0DB63C9613b3BECf644A298AfECBa450795f612B",
  "0x3B502B054715A8e0D8F657169615A88B2CCDD429",
  "0x0DB63C9613b3BECf644A298AfECBa450795f612B",
  "0x3B502B054715A8e0D8F657169615A88B2CCDD429",
  "0x0DB63C9613b3BECf644A298AfECBa450795f612B",
  "0x3B502B054715A8e0D8F657169615A88B2CCDD429",
  "0x0DB63C9613b3BECf644A298AfECBa450795f612B",
  "0x2B3937Fe6Ef38CD4be0D9ceb05823087B716d689",
  "0x2B3937Fe6Ef38CD4be0D9ceb05823087B716d689",
  "0x5951B59BE60295D90fdC6FEA1c2d4B33F0Ec1Ba1",
  "0x5951B59BE60295D90fdC6FEA1c2d4B33F0Ec1Ba1",
  "0x5951B59BE60295D90fdC6FEA1c2d4B33F0Ec1Ba1",
  "0x5951B59BE60295D90fdC6FEA1c2d4B33F0Ec1Ba1",
];

function generateLeaf(account: string, mintRequest: MintRequest): Uint8Array {
  return KECCAK256(
    ethers.utils.defaultAbiCoder.encode(
      ["address", "uint256", "uint256"],
      [account, mintRequest.id, mintRequest.amount]
    )
  );
}

const buf2hex = (x: any) => "0x" + x.toString("hex");

const useMerkleTree = () => {
  const { address, isConnected } = useAccount();
  const [merkelTree, setMerkelTree] = useState<MerkleTreeResponse | undefined>(
    undefined
  );
  const [userPackets, setUserPackets] = useState<UserPacket[]>([]);
  const [fetchingPackets, setfetchingPackets] = useState(false);

  useEffect(() => {
    setMerkelTree(generateMerkle(accounts, mintRequests));
  }, []);

  useEffect(() => {
    getUserPackets(address);
  }, [address, isConnected]);

  const generateMerkle = (accounts: string[], mintRequests: MintRequest[]) => {
    const leaves = mintRequests.map((mintRequest, index) =>
      generateLeaf(accounts[index], mintRequest)
    );
    const tree = new MerkleTree(leaves, KECCAK256, { sortPairs: true });

    const root = buf2hex(tree.getRoot());

    return {
      root,
      leavesBuffer: leaves,
      leaves: leaves.map((x) => buf2hex(x)),
    };
  };

  const generateProof = (
    account: string,
    mintRequest: MintRequest,
    accounts: string[],
    mintRequests: MintRequest[]
  ) => {
    const leaves = mintRequests.map((mintRequest, index) =>
      generateLeaf(accounts[index], mintRequest)
    );
    const tree = new MerkleTree(leaves, KECCAK256, { sortPairs: true });

    const leaf = buf2hex(generateLeaf(account, mintRequest));
    const proof = tree.getProof(leaf).map((x) => buf2hex(x.data));

    // Convert proof to bytes32 format
    // const bytes32Proof = proof.map((hex) => ethers.utils.hexZeroPad(hex, 32));
    return proof;
  };

  const getUserPackets = async (account: `0x${string}` | undefined) => {
    setfetchingPackets(true);
    const userPackets = [];
    if (account) {
      for (let i = 0; i < mintRequests.length; i++) {
        const request = mintRequests[i];
        const address = accounts[i];

        // If the account matches the requested address, add it to userPackets
        if (address.toLowerCase() === account.toLowerCase()) {
          const isClaimed = await checkIsPacketClaimed(
            buf2hex(generateLeaf(address, request))
          );
          userPackets.push({
            id: userPackets.length,
            isClaimed,
            request: request,
            address,
          });
        }
      }
    }
    setUserPackets(userPackets);
    setfetchingPackets(false);
  };

  return {
    accounts,
    mintRequests,
    merkelTree,
    generateProof,
    getUserPackets,
    userPackets,
    fetchingPackets,
  };
};

export default useMerkleTree;
