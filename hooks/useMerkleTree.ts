"use client";
import { ethers } from "ethersv5";
import KECCAK256 from "keccak256";
import { MerkleTree } from "merkletreejs";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { checkIsPacketClaimed } from "../utils/checkIsClaimed";
import mintRequestAndAccounts from "../utils/output.prod.json";

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

const mintRequests: MintRequest[] = mintRequestAndAccounts.mintRequests;

// Setup addresses
const accounts: string[] = mintRequestAndAccounts.accounts;

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
    const bytes32Proof = proof.map((hex) => ethers.utils.hexZeroPad(hex, 32));
    return bytes32Proof;
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
