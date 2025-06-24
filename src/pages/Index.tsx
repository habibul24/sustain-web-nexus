import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ImageTextSection from '@/components/ImageTextSection';
import ESGCarousel from '@/components/ESGCarousel';
import OrganizationCards from '@/components/OrganizationCards';
import SustainabilitySection from '@/components/SustainabilitySection';
import FloatInOnView from '@/components/FloatInOnView';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <FloatInOnView><ImageTextSection /></FloatInOnView>
      <OrganizationCards />
      <SustainabilitySection />
      <ESGCarousel />
      <Footer />
    </div>
  );
};

export default Index;
