import React from 'react';
import ConnectXeroSection from '../../components/esg/ConnectXeroSection';

const Introduction = () => (
  <div className="flex flex-col items-center justify-center h-full p-8">
    <h1 className="text-3xl font-bold mb-4 text-green-900">Welcome to Carbon Emission Calculator</h1>
    <p className="text-xl text-gray-700 mb-10">Let's start calculating your organization's carbon footprint</p>
    <div className="w-full max-w-5xl">
      <ConnectXeroSection />
    </div>
  </div>
);

export default Introduction; 