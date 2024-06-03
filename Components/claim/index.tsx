"use client";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import {
  useAccount,
  useContractWrite,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import useMerkleTree, { UserPacket } from "../../hooks/useMerkleTree";
import { publicClient, walletClient } from "../../pages/_app";
import ABI from "../../utils/abi.json";
import { skaleNebulaTestnetCustom } from "../../utils/chainTestnet";
import { checkBalance } from "../../utils/checkBalance";
import {
  deployedContractAddress,
  fuelStation,
  functionSignature,
} from "../../utils/constant";
import mineGasForTransaction from "../../utils/mineGas";
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

  const userNonce = async (address: `0x${string}`) => {
    const nonce = await publicClient.getTransactionCount({ address });
    return nonce;
  };

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
      const gasLimit = 300000;
      try {
        if (!(await checkBalance(address))) {
          toast.success("Claiming initiated, this might take a minute");
          const randomKey = generatePrivateKey();
          const randomAccount = privateKeyToAccount(randomKey);
          const nonce = await userNonce(randomAccount.address);
          const { gasPrice } = await mineGasForTransaction(
            nonce,
            gasLimit,
            randomAccount.address
          );
          await walletClient.sendTransaction({
            account: randomAccount,
            to: fuelStation,
            data: `${functionSignature}000000000000000000000000${address.substring(
              2
            )}`,
            gasPrice,
          });
        }

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
                  disabled={
                    isLoading || chain?.id != skaleNebulaTestnetCustom.id
                  }
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
