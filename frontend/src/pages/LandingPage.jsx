import React from 'react';
import Navbar from '../components/landing/Navbar';
import Hero from '../components/landing/Hero';
import PartnerStrip from '../components/landing/PartnerStrip';
import Features from '../components/landing/Features';
import Triggers from '../components/landing/Triggers';
import Pricing from '../components/landing/Pricing';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="pt-24 flex-grow">
        <Hero />
        <PartnerStrip />
        <Features />
        <Triggers />
        <Pricing />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
