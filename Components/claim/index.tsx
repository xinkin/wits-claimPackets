"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";
import useMerkleTree, { UserPacket } from "../../hooks/useMerkleTree";
import ABI from "../../utils/abi.json";
import { deployedContractAddress } from "../../utils/constant";
import Button from "../ui/Button";
import Card from "../ui/Card";
import Screen from "./Screen";
import { useAbstractClient } from "@abstract-foundation/agw-react";
import { Address, encodeFunctionData } from "viem";
import RequiredInfoModal from "../../Components/ui/PopupModal";
import { useWaitForTransactionReceipt } from "wagmi";
import { useWriteContractSponsored } from "@abstract-foundation/agw-react";
import { getGeneralPaymasterInput } from "viem/zksync";
import { usePersistentState } from "../../hooks/usePersistantState";
import { PAYMASTER_ADDRESS } from "../../utils/constant";

const Claim = () => {
  const { address: agwAddress, isConnected } = useAccount();
  const [address, setAddress] = usePersistentState("address", undefined);
  const [hash, setHash] = useState<string | undefined>(undefined);
  const [isLinked, setIsLinked] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [proofsAndRequests, setProofsAndRequests] = useState<any>(null);

  const { data: agwClient } = useAbstractClient();

  useEffect(() => {
    let isMounted = true;

    const checkLinkedAccounts = async () => {
      if (!agwClient || !isConnected) return;

      try {
        const { linkedAccounts } = await agwClient.getLinkedAccounts({
          agwAddress: agwAddress as Address,
        });

        if (!isMounted) return;

        setIsLinked(false);
        setAddress(undefined);

        if (linkedAccounts.length > 0) {
          setIsLinked(true);
          setAddress(linkedAccounts[0]);
          setModalOpen(true);
        } else if (isConnected) {
          setModalOpen(true);
        }
      } catch (error) {
        console.error("Error in getting linked accounts", error);
        if (isMounted) {
          setIsLinked(false);
          setAddress(undefined);
        }
      }
    };

    checkLinkedAccounts();

    return () => {
      isMounted = false;
    };
  }, [agwClient, agwAddress, isConnected]);

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

  const { writeContractSponsored, isSuccess, isPending } =
    useWriteContractSponsored();

  // const { isSuccess, isPending } = useWaitForTransactionReceipt({
  //   hash: hash as `0x${string}`,
  // });

  useEffect(() => {
    if (address) {
      getUserPackets(address);
    }
  }, [address, isSuccess, isConnected]);

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
              mintRequests,
            ),
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

        console.log("requests", proofsAndRequests.requests);
        console.log("proofs", proofsAndRequests.proofs);
        console.log("address", address);

        // if (!agwClient) return;

        // const encodedWriteData = encodeFunctionData({
        //   abi: ABI,
        //   functionName: "claimPacket",
        //   args: [address, proofsAndRequests.requests, proofsAndRequests.proofs],
        // });

        // const hash = await agwClient.sendTransaction({
        //   to: deployedContractAddress,
        //   data: encodedWriteData,
        // });

        // setHash(hash);
        // console.log("hash", hash);

        writeContractSponsored({
          abi: ABI,
          address: deployedContractAddress,
          functionName: "claimPacket",
          args: [address, proofsAndRequests.requests, proofsAndRequests.proofs],
          paymaster: PAYMASTER_ADDRESS,
          paymasterInput: getGeneralPaymasterInput({
            innerInput: "0x",
          }),
        });
        await getUserPackets(address);

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
      {isConnected ? (
        <div className="flex items-center justify-center gap-4 w-full">
          <RequiredInfoModal
            isOpen={modalOpen}
            onOpenChange={setModalOpen}
            isAccountLinked={isLinked}
            linkedAccount={address}
          />
          {userPackets.length > 0 && address ? (
            <div className="flex flex-col items-center gap-4">
              <div className="flex items-center justify-center gap-4 w-full flex-shrink-0 flex-grow">
                {userPackets.map((item: UserPacket) => (
                  <Card key={item?.id} data={item} />
                ))}
              </div>
              <div className="w-1/2 flex justify-center">
                <Button
                  onClick={handleClaim}
                  text={hash && isPending ? "claiming..." : "claim"}
                  disabled={Boolean(hash && isPending)}
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
        <Screen
          title="Welcome"
          desc="Please connect your wallet to continue"
        ></Screen>
      )}
    </div>
  );
};

export default Claim;
