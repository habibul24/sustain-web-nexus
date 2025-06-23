
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ImageTextSection from '@/components/ImageTextSection';
import ESGCarousel from '@/components/ESGCarousel';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black">
      <Header />
      <Hero />
      <ImageTextSection />
      <ESGCarousel />
      <Footer />
    </div>
  );
};

export default Index;
