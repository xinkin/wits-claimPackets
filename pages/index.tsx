import type { NextPage } from "next";
import Head from "next/head";
import Claim from "../Components/claim";
import MainLayout from "../Components/layout/MainLayout";

const Home: NextPage = () => {
  return (
    <MainLayout>
      <Head>
        <title>W.I.T.S - Mint Now</title>
        <meta content="Mint your Wits NFT here" name="description" />
        <link href="/images/w_logo.png" rel="icon" />
      </Head>

      <div className="min-h-screen flex items-center justify-center py-6 px-4">
        <Claim />
      </div>
    </MainLayout>
  );
};

export default Home;
