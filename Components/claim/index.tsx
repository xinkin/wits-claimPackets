"use client";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { skaleNebula } from "viem/chains";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import useMerkleTree, { UserPacket } from "../../hooks/useMerkleTree";
import { publicClient } from "../../pages/_app";
import ABI from "../../utils/abi.json";
import { checkBalance } from "../../utils/checkBalance";
import { deployedContractAddress } from "../../utils/constant";
import { dripGas } from "../../utils/mineGas";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Screen from "./Screen";

const Claim = () => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const [isClient, setIsClient] = useState(false); // State to check if component is client-side
  const [proofsAndRequests, setProofsAndRequests] = useState<any>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    generateProof,
    getUserPackets,
    userPackets,
    mintRequests,
    accounts,
    fetchingPackets,
  } = useMerkleTree();
  const { openConnectModal } = useConnectModal();
  const {
    data: claimTxHash,
    writeAsync: writeContract,
    isLoading,
  } = useContractWrite({
    abi: ABI,
    address: deployedContractAddress as `0x${string}`,
    functionName: "claimPacket",
  });

  const { data } = useWaitForTransaction({ hash: claimTxHash?.hash });

  useEffect(() => {
    if (address) {
      getUserPackets(address);
    }
  }, [address, data]);

  useEffect(() => {
    if (address && userPackets.length > 0) {
      dripGas(address);
    }
  }, [address, userPackets]);

  useEffect(() => {
    if (isClient) {
      const validProofs: any[] = [];
      const validPackets: any = [];

      userPackets.forEach((packet) => {
        if (!packet?.isClaimed) {
          validProofs.push(
            generateProof(
              packet.address,
              packet.request,
              accounts,
              mintRequests
            )
          );
        }
      });

      userPackets.forEach((packet) => {
        if (!packet?.isClaimed) {
          validPackets.push(packet.request);
        }
      });

      setProofsAndRequests({
        proofs: validProofs,
        requests: validPackets,
      });
    }
  }, [isClient, userPackets, address]);

  const handleClaim = async () => {
    if (
      address &&
      proofsAndRequests?.requests?.length > 0 &&
      proofsAndRequests?.proofs?.length > 0
    ) {
      try {
        toast.success("Claiming initiated, this might take a minute");
        await dripGas(address);

        await writeContract({
          args: [address, proofsAndRequests.requests, proofsAndRequests.proofs],
          value: BigInt(0),
        });

        if (claimTxHash) {
          await publicClient.waitForTransactionReceipt({
            hash: claimTxHash?.hash,
          });
          await getUserPackets(address);
        }

        toast.success("transaction initiated");
      } catch (error) {
        console.log(error);
        toast.error("transaction failed");
      }
    }
  };

  if (!isClient) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-w-screen-md rounded-xl border p-4 border-mikado-200 bg-mikado-100/10">
      {address ? (
        <div className="flex items-center justify-center gap-4 w-full">
          {userPackets.length > 0 ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-center gap-4 w-full flex-shrink-0 flex-grow">
                {userPackets.map((item: UserPacket) => (
                  <Card key={item?.id} data={item} />
                ))}
              </div>
              <div className="w-1/2 flex justify-center">
                <Button
                  onClick={handleClaim}
                  text={isLoading ? "claiming..." : "claim"}
                  disabled={isLoading || chain?.id != skaleNebula.id}
                />
              </div>
            </div>
          ) : fetchingPackets ? (
            <Screen
              title="Please wait..."
              desc="Getting your packets ready to be claimed..."
            />
          ) : (
            <Screen
              title="Sorry, Ineligible!!"
              desc="Sorry we can't find any packets for this wallets, please try again with different accounts"
            />
          )}
        </div>
      ) : (
        <Screen title="Welcome" desc="Please connect your wallet to continue">
          <Button onClick={openConnectModal} text="connect" />
        </Screen>
      )}
    </div>
  );
};

export default Claim;
