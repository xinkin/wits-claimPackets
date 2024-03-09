import ethers from "ethersv5";
import KECCAK256 from "keccak256";
import { MerkleTree } from "merkletreejs";
import { useEffect, useState } from "react";

interface MintRequest {
  id: number;
  amount: number;
}
export interface UserPacket {
  id: number;
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
  { id: 2, amount: 200 }, //
  { id: 3, amount: 100 },
  { id: 3, amount: 200 }, //
  { id: 4, amount: 100 },
  { id: 4, amount: 200 }, //
  { id: 2, amount: 100 },
  { id: 2, amount: 200 }, //
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
];

const findIndexByAddress = (address: string): number => {
  return accounts.findIndex(
    (acc) => acc.toLowerCase() === address.toLowerCase()
  );
};

function generateLeaf(account: string, mintRequest: MintRequest): Uint8Array {
  return KECCAK256(
    ethers?.utils?.defaultAbiCoder.encode(
      ["address", "uint256", "uint256"],
      [account, mintRequest.id, mintRequest.amount]
    )
  );
}

const buf2hex = (x: any) => "0x" + x.toString("hex");

const useMerkleTree = (account: `0x${string}` | undefined) => {
  const [merkelTree, setMerkelTree] = useState<MerkleTreeResponse | undefined>(
    undefined
  );
  const [userPackets, setUserPackets] = useState<UserPacket[]>([]);
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

  const generateProof = (account: string, mintRequest: MintRequest) => {
    const leaves = mintRequests.map((mintRequest, index) =>
      generateLeaf(accounts[index], mintRequest)
    );
    const tree = new MerkleTree(leaves, KECCAK256, { sortPairs: true });

    const leaf = buf2hex(generateLeaf(account, mintRequest));
    const proof = tree.getProof(leaf).map((x) => buf2hex(x.data));
    return proof;
  };

  const getUserPackets = (account: string) => {
    const userPackets = [];

    // Iterate over mintRequests and accounts simultaneously
    for (let i = 0; i < mintRequests.length; i++) {
      const request = mintRequests[i];
      const address = accounts[i];

      // If the account matches the requested address, add it to userPackets
      if (address.toLowerCase() === account.toLowerCase()) {
        userPackets.push({ id: userPackets.length, request: request, address });
      }
    }
    console.log("userPackets", userPackets);
    setUserPackets(userPackets);
  };

  useEffect(() => {
    setMerkelTree(generateMerkle(accounts, mintRequests));
  }, []);

  useEffect(() => {
    if (account) {
      getUserPackets(account);
    }
  }, [account]);

  return {
    merkelTree,
    generateProof,
    getUserPackets,
    userPackets,
    mintRequests,
  };
};

export default useMerkleTree;
