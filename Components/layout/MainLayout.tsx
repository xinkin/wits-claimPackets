import React from "react";
import { Toaster } from "react-hot-toast";
import Footer from "../ui/Footer";
import Header from "../ui/Header";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />

      <main className="bg-[url('/images/bg.png')] bg-no-repeat bg-center bg-cover bg-opacity-30">
        {children}
      </main>
      <Toaster position="bottom-center" reverseOrder={false} />
      <Footer />
    </>
  );
};

export default MainLayout;
