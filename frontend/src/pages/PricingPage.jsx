import React from "react";
import Navbar from "../components/navbar/Navbar";
import PricingSection from "../components/pricing/PricingSection";
import FAQSection from "../components/faq/FAQSection";
import Footer from "../components/footer/Footer";

export const PricingPage = () => {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: "80px" }}>
        <PricingSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
};

export default PricingPage;
