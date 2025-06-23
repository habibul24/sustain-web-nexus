
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ImageTextSection from '@/components/ImageTextSection';
import ESGCarousel from '@/components/ESGCarousel';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-emerald-100">
      <Header />
      <Hero />
      <ImageTextSection />
      <ESGCarousel />
      <Footer />
    </div>
  );
};

export default Index;
