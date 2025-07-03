import React from 'react';
// import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ImageTextSection from '@/components/ImageTextSection';
import ESGCarousel from '@/components/ESGCarousel';
import OrganizationCards from '@/components/OrganizationCards';
import SustainabilitySection from '@/components/SustainabilitySection';
import FloatInOnView from '@/components/FloatInOnView';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <FloatInOnView><ImageTextSection /></FloatInOnView>
      <OrganizationCards />
      <SustainabilitySection />
      <ESGCarousel />
    </div>
  );
};

export default Index;
