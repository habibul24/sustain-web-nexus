
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const EducationalMaterials = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <section className="py-24 bg-gradient-to-b from-green-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Educational Materials</h1>
            <p className="text-xl text-gray-600">Coming Soon</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EducationalMaterials;
