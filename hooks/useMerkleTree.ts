import ethers from "ethersv5";
import KECCAK256 from "keccak256";
import { MerkleTree } from "merkletreejs";
import { useEffect, useState } from "react";

interface MintRequest {
  id: number;
  amount: number;
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
  { id: 2, amount: 200 },
  { id: 3, amount: 100 },
  { id: 3, amount: 200 },
  { id: 4, amount: 100 },
  { id: 4, amount: 200 },
  { id: 2, amount: 100 },
  { id: 2, amount: 200 },
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

const buf2hex = (x: Uint8Array): string =>
  "0x" + Buffer.from(x).toString("hex");

const useMerkleTree = () => {
  const [merkelTree, setMerkelTree] = useState<MerkleTreeResponse | undefined>(
    undefined
  );
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

  const generateProof = (account: string) => {
    const index = findIndexByAddress(account);
    const leaves = mintRequests.map((mintRequest, index) =>
      generateLeaf(accounts[index], mintRequest)
    );
    const tree = new MerkleTree(leaves, KECCAK256, { sortPairs: true });

    const leaf = buf2hex(generateLeaf(account, mintRequests[index]));
    const proof = tree.getProof(leaf).map((x) => buf2hex(x.data));
    return proof;
  };

  useEffect(() => {
    setMerkelTree(generateMerkle(accounts, mintRequests));
  }, []);

  return { merkelTree, generateProof };
};

export default useMerkleTree;
