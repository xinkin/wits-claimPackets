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

      <div className="min-h-screen flex flex-col items-center justify-center px-4 gap-16">
        <span className=" text-mikado-100 text-xl text-center leading-relaxed font-beaufort uppercase">
          Migrate your packets from Ethereum to SKALE
          <br />
          Connect Wallet and Open your Packets
          <br />
          <a
            href={"https://www.wits.academy/"}
            className="underline-offset-2 underline"
            target="_blank"
            rel="noreferrer"
          >
            https://www.wits.academy/
          </a>
        </span>

        <Claim />
      </div>
    </MainLayout>
  );
};

export default Home;
