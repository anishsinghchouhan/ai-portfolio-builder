import React from "react";
import Navbar from "../components/navbar/Navbar";
import TemplatesMarketplacePage from "./dashboard/TemplatesMarketplacePage";
import Footer from "../components/footer/Footer";

export const TemplatesPage = () => {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "80px" }}>
        <TemplatesMarketplacePage />
      </main>
      <Footer />
    </>
  );
};

export default TemplatesPage;
