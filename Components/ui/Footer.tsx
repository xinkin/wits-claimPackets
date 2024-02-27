import Image from "next/image";
import React, { useState } from "react";
import { FaDiscord, FaInstagram, FaTelegramPlane } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  const [showFullText, setShowFullText] = useState(false);

  const toggleText = () => {
    setShowFullText(!showFullText);
  };
  return (
    <footer className="bg-mikado-950 border-t border-mikado-100 mt-5">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center text-mikado-300 gap-4">
          <Image
            src="/images/w_logo.png"
            alt="wits"
            height={40}
            width={40}
            className="rounded-md"
          />
          <span className="text-4xl font-semibold">What Is This Sorcery</span>
        </div>
        <p className="mx-auto mt-6 max-w-5xl text-center leading-relaxed text-mikado-50/50">
          {showFullText ? (
            <>
              What is WITS? WITS, short for &apos;What is This Sorcery?&apos;,
              is an innovative and immersive trading card game (TCG) set in a
              fantastical universe called Catena. Imagine a world where wizards
              and mythical creatures are not just part of folklore but are
              deeply intertwined with the revolutionary technology of
              blockchain. In WITS, players collect and trade digital cards, each
              representing unique characters, spells, and artifacts. These cards
              are not just virtual assets; They are physical as well! Making
              each one unique, owned by you, and potentially increasing in value
              based on rarity and demand. Owning your cards is earning from your
              cards. A new in-game way to forward yourself and outrank
              opponents. The game is set in a richly detailed world, where each
              character and item has its own backstory, inspired by real-world
              events and concepts from the crypto world. For example, a
              character might represent a &apos;miner&apos; in the blockchain,
              not in the traditional sense of mining, but as a powerful wizard
              who extracts magical essence, akin to how cryptocurrencies are
              mined. (
              <button className="text-mikado-300" onClick={toggleText}>
                ...show less
              </button>
              )
            </>
          ) : (
            <>
              What is WITS? WITS, short for &apos;What is This Sorcery?&apos;,
              is an innovative and immersive trading card game (TCG) set in a
              fantastical universe called Catena. Imagine a world where wizards
              and mythical creatures are not just part of folklore but are
              deeply intertwined with the revolutionary technology of
              blockchain. (
              <button className="text-mikado-300" onClick={toggleText}>
                Read more...
              </button>
              )
            </>
          )}
        </p>

        <ul className="mt-12 flex flex-wrap justify-center gap-3 md:gap-4 lg:gap-6">
          <li>
            <a
              className="text-mikado-300 transition hover:text-mikado-300/75"
              href="https://www.wits.academy/"
              rel="noreferrer"
              target="_blank"
            >
              wits academy
            </a>
          </li>

          <li>
            <a
              className="text-mikado-300 transition hover:text-mikado-300/75"
              href="https://trade.wits.academy/home"
              rel="noreferrer"
              target="_blank"
            >
              trade
            </a>
          </li>
          <li>
            <a
              className="text-mikado-300 transition hover:text-mikado-300/75"
              href="https://trade.wits.academy/collections/0x2b0243f5a0f8c690bcdae0e00c669e45e44d6a0d/networks/mainnet"
              rel="noreferrer"
              target="_blank"
            >
              collections
            </a>
          </li>
        </ul>

        <ul className="mt-12 flex justify-center gap-6 md:gap-8">
          <li>
            <a
              href="https://discord.com/invite/wits"
              rel="noreferrer"
              target="_blank"
              className="text-mikado-300 transition hover:text-mikado-300/75"
            >
              <span className="sr-only">Discord</span>
              <FaDiscord className="h-6 w-6" />
            </a>
          </li>

          {/* <li>
            <a
              href="#"
              rel="noreferrer"
              target="_blank"
              className="text-mikado-300 transition hover:text-mikado-300/75"
            >
              <span className="sr-only">Instagram</span>
              <FaInstagram className="h-6 w-6" />
            </a>
          </li> */}

          <li>
            <a
              href="https://twitter.com/wits_tcg"
              rel="noreferrer"
              target="_blank"
              className="text-mikado-300 transition hover:text-mikado-300/75"
            >
              <span className="sr-only">Twitter</span>
              <FaXTwitter className="h-6 w-6" />
            </a>
          </li>

          <li>
            <a
              href="https://telegram.me/wits_tcg"
              rel="noreferrer"
              target="_blank"
              className="text-mikado-300 transition hover:text-mikado-300/75"
            >
              <span className="sr-only">telegram</span>
              <FaTelegramPlane className="h-6 w-6" />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
