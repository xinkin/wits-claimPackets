"use client";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAccount, useContractWrite, usePublicClient } from "wagmi";
import useMerkleTree, { UserPacket } from "../../hooks/useMerkleTree";
import ABI from "../../utils/abi.json";
import { deployedContractAddress } from "../../utils/constant";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Screen from "./Screen";
import { CallWithERC2771Request, GelatoRelay } from "@gelatonetwork/relay-sdk";
import { ethers } from "ethers";

const Claim = () => {
  const { address } = useAccount();
  const relay = new GelatoRelay();

  // const userNounce = async () => {
  //   const nonce = await publicClient.getTransactionCount({
  //     address: address!,
  //   });
  //   return nonce;
  // };

  const {
    generateProof,
    getUserPackets,
    userPackets,
    mintRequests,
    accounts,
    fetchingPackets,
  } = useMerkleTree();
  const { openConnectModal } = useConnectModal();
  const [polling, setPolling] = useState(false);
  const [taskId, setTaskId] = useState<string | null>(null);
  const { data: claimTxHash, writeAsync: writeContract } = useContractWrite({
    abi: ABI,
    address: deployedContractAddress as `0x${string}`,
    functionName: "claimPacket",
  });

  const [proofsAndRequests, setProofsAndRequests] = useState<any>(null);

  useEffect(() => {
    const validProofs: any = [];
    const validPackets: any = [];

    userPackets.forEach((packet) => {
      if (!packet?.isClaimed) {
        validProofs.push(
          generateProof(packet.address, packet.request, accounts, mintRequests)
        );
      }
    });

    userPackets.map((packet) => {
      if (!packet?.isClaimed) {
        validPackets.push(packet.request);
      }
    });

    setProofsAndRequests({
      proofs: validProofs,
      requests: validPackets,
    });
  }, [userPackets]);

  useEffect(() => {
    if (polling && taskId) {
      const intervalId = setInterval(async () => {
        const status = await relay.getTaskStatus(taskId);
        if (status?.taskState === "ExecSuccess") {
          toast.success("transaction successful");
          getUserPackets(address);
          setPolling(false);
        } else if (status?.taskState === "Cancelled") {
          toast.error("transaction failed");
          setPolling(false);
        }
      }, 1000);

      // Cleanup the interval on component unmount
      return () => clearInterval(intervalId);
    }
  }, [polling]);

  const handleClaim = async () => {
    // if (
    //   address &&
    //   proofsAndRequests?.requests?.length > 0 &&
    //   proofsAndRequests?.proofs?.length > 0
    // ) {
    // const nonce = await userNounce();
    // const mineGas = await mineGasForTransaction(nonce, 300000, address);
    // console.log(mineGas);
    // try {
    //   await writeContract({
    //     args: [address, proofsAndRequests.requests, proofsAndRequests.proofs],
    //     value: BigInt(0),
    //   });
    //   toast.success("transaction initiated");
    //   setTimeout(() => {
    //     getUserPackets(address);
    //   }, 3000);
    // } catch (error) {
    //   console.log(error);
    //   toast.error("transaction failed");
    // }
    // }

    try {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        deployedContractAddress,
        ABI,
        signer
      );
      const { data } = await contract.claimPacket.populateTransaction(
        address,
        proofsAndRequests.requests,
        proofsAndRequests.proofs
      );

      const request: CallWithERC2771Request = {
        chainId: BigInt(421614),
        target: deployedContractAddress,
        data: data as string,
        user: address!,
      };

      const response = await relay.sponsoredCallERC2771(
        request,
        signer as any,
        process.env.NEXT_PUBLIC_GELATO_KEY as string
      );
      setTaskId(response.taskId);
      setPolling(true);
    } catch (error) {
      toast.error("transaction failed");
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center min-w-screen-md rounded-xl border  p-4 border-mikado-200 bg-mikado-100/10">
      {address ? (
        <div className="flex flex-col items-center justify-center gap-4 w-full">
          {userPackets.length > 0 ? (
            <>
              <div className="flex flex-wrap items-center justify-center gap-4 w-full flex-shrink-0 flex-grow">
                {userPackets.map((item: UserPacket) => (
                  <Card key={item?.id} data={item} />
                ))}
              </div>
              <Button
                onClick={handleClaim}
                // disabled={
                //   !address ||
                //   userPackets?.length === 0 ||
                //   proofsAndRequests?.requests?.length === 0 ||
                //   proofsAndRequests?.proofs?.length === 0
                // }
                text="claim"
              />
            </>
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
