"use client";
import { parseEther } from "ethers";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAccount, useContractWrite, useWaitForTransaction } from "wagmi";
import useMerkleTree, { UserPacket } from "../../hooks/useMerkleTree";
import ABI from "../../utils/abi.json";
import { deployedContratAddress } from "../../utils/constant";
import Card from "../ui/Card";
const Claim = () => {
  const { address } = useAccount();
  const { generateProof, userPackets, mintRequests } = useMerkleTree(address);
  const { data: claimTxHash, write: writeContract } = useContractWrite({
    abi: ABI,
    address: deployedContratAddress as `0x${string}`,
    functionName: "claimPacket",
  });
  const { status, isLoading } = useWaitForTransaction({
    confirmations: 2,
    hash: claimTxHash?.hash as `0x${string}`,
  });
  const [selectedPacket, setselectedPacket] = useState<UserPacket | null>(null);

  useEffect(() => {
    switch (status) {
      case "error":
        toast.error("something went wrong");
        break;
      case "success":
        toast.success("transaction successful");
        break;

      default:
        break;
    }
  }, [status]);

  const handleClaim = () => {
    if (address && selectedPacket?.request) {
      const proof = generateProof(address, selectedPacket?.request);
      console.log("selectedPacket?.request", selectedPacket?.request);
      console.log("handle claim", [address, mintRequests, proof]);
      writeContract({
        args: [address, mintRequests, proof],
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-w-screen-md rounded-xl border  p-4 border-mikado-200 bg-mikado-100/10">
      <div className="flex flex-wrap max-w-screen-2xl items-center justify-center gap-4 w-full flex-shrink-0 flex-grow">
        {userPackets.length > 0 ? (
          userPackets.map((item: UserPacket) => (
            <Card
              key={item?.id}
              data={item}
              onSelect={(data) => setselectedPacket(data)}
              isSelected={selectedPacket?.id === item?.id}
            />
          ))
        ) : (
          <p>Nothing to claim here</p>
        )}
      </div>
      <button
        onClick={handleClaim}
        disabled={
          isLoading || !address || userPackets?.length === 0 || !selectedPacket
        }
        className="relative group disabled:cursor-not-allowed disabled:opacity-50"
      >
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gold group-hover:text-black group-active:text-black font-dragon">
          CLAIM
        </div>
        <picture>
          <img
            src="/images/default.png"
            className="w-full group-hover:hidden group-active:hidden"
            alt=""
          />
        </picture>
        <picture>
          <img
            src="/images/hover.png"
            className="w-full hidden group-hover:block group-active:hidden"
            alt=""
          />
        </picture>
        <picture>
          <img
            src="/images/active.png"
            className="w-full hidden group-active:block"
            alt=""
          />
        </picture>
      </button>
    </div>
  );
};

export default Claim;
