import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { HiMenu } from "react-icons/hi";

const Header = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const toggleMobileNav = () => {
    setIsMobileNavOpen(!isMobileNavOpen);
  };
  return (
    <header className="relative font-lato">
      <div className="bg-mikado-950 border-b border-mikado-100">
        <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
          <Link className="block text-mikado-400" href="/">
            <span className="sr-only">Home</span>
            <Image
              src="/images/w_logo.png"
              alt="wits"
              height={40}
              width={40}
              className="rounded-md"
            />
          </Link>

          <div className="flex flex-1 items-center justify-end md:justify-between">
            <nav aria-label="Global" className="hidden md:block">
              <ul className="flex items-center gap-6 text-sm">
                <li>
                  <a
                    className="text-mikado-100 transition hover:text-mikado-100/75"
                    href="https://trade.wits.academy/home"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    className="text-mikado-100 transition hover:text-mikado-100/75"
                    href="https://trade.wits.academy/collections/0x2b0243f5a0f8c690bcdae0e00c669e45e44d6a0d/networks/mainnet"
                  >
                    Collections
                  </a>
                </li>
                <li>
                  <Link
                    className="text-mikado-100 transition hover:text-mikado-100/75"
                    href="/"
                  >
                    Mint
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="flex items-center gap-4">
              <div className="sm:flex sm:gap-4">
                <ConnectButton label="CONNECT" />
              </div>

              <button
                onClick={toggleMobileNav}
                className="block rounded bg-mikado-400/5 p-2.5 text-mikado-300 transition hover:text-mikado-400/75 md:hidden"
              >
                <span className="sr-only">Toggle menu</span>
                <HiMenu className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`absolute ${
          isMobileNavOpen ? "top-full opacity-100" : "-top-[1200px] opacity-0"
        } left-0 w-full bg-mikado-950 transition-all ease-in-out duration-700 lg:hidden `}
      >
        <ul className="space-y-1 my-4">
          <li>
            <a
              href="#"
              className="flex items-center gap-2 rounded-lg bg-mikado-400/5 px-4 py-2 text-mikado-300"
            >
              <span className="text-sm font-medium"> General </span>
            </a>
          </li>

          <li>
            <a
              href="#"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-mikado-100 hover:bg-mikado-400/5 hover:text-mikado-300"
            >
              <span className="text-sm font-medium"> Teams </span>
            </a>
          </li>

          <li>
            <a
              href="#"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-mikado-100 hover:bg-mikado-400/5 hover:text-mikado-300"
            >
              <span className="text-sm font-medium"> Billing </span>
            </a>
          </li>

          <li>
            <a
              href="#"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-mikado-100 hover:bg-mikado-400/5 hover:text-mikado-300"
            >
              <span className="text-sm font-medium"> Invoices </span>
            </a>
          </li>

          <li>
            <a
              href="#"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-mikado-100 hover:bg-mikado-400/5 hover:text-mikado-300"
            >
              <span className="text-sm font-medium"> Account </span>
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
