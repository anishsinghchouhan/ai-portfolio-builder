import React, { useEffect } from "react";
import Navbar from "../components/navbar/Navbar";
import Hero from "../components/hero/Hero";
import TrustedBy from "../components/common/TrustedBy";
import HowItWorks from "../components/common/HowItWorks";
import FeaturesSection from "../components/features/FeaturesSection";
import TemplateShowcase from "../components/common/TemplateShowcase";
import PricingSection from "../components/pricing/PricingSection";
import TestimonialsSection from "../components/testimonials/TestimonialsSection";
import FAQSection from "../components/faq/FAQSection";
import Footer from "../components/footer/Footer";
import { scrollToSection } from "../utils/scrollUtils";

export const HomePage = () => {
  useEffect(() => {
    if (window.location.hash) {
      const targetId = window.location.hash.replace(/^#/, "").split("?")[0];
      if (targetId) {
        setTimeout(() => {
          scrollToSection(targetId);
        }, 150);
      }
    }
  }, []);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <HowItWorks />
        <FeaturesSection />
        <TemplateShowcase />
        <PricingSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
