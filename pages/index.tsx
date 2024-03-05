import type { NextPage } from "next";
import Head from "next/head";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import MainLayout from "../Components/layout/MainLayout";
import useMerkleTree from "../hooks/useMerkleTree";

const Home: NextPage = () => {
  const { merkelTree, generateProof } = useMerkleTree();
  const { address } = useAccount();

  useEffect(() => {
    if (address) {
      console.log("merkelTree : ", merkelTree);
      console.log("generateProof : ", generateProof(address));
    }
  }, [address, merkelTree, generateProof]);

  return (
    <MainLayout>
      <Head>
        <title>W.I.T.S - Mint Now</title>
        <meta content="Mint your Wits NFT here" name="description" />
        <link href="/images/w_logo.png" rel="icon" />
      </Head>

      <div className="min-h-screen"></div>
    </MainLayout>
  );
};

export default Home;
