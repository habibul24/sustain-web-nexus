import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative min-h-[120vh] flex items-center justify-center">
      {/* Hero Image Section */}
      <div className="absolute inset-0 overflow-hidden"> {/* Changed to absolute inset-0 to cover the full section */}
        <img
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=100&sharp=10"
          alt="Dark forest with mystical lighting"
          className="w-full h-full object-cover object-center"
          style={{ imageRendering: 'crisp-edges' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-green-900/70 to-black/80"></div>
      </div>
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto"> {/* Added relative z-10 to bring content to front */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Navigate Your Sustainability Journey With Clarity
        </h1>
        <p className="text-xl md:text-2xl text-gray-100 mb-10 max-w-4xl mx-auto leading-relaxed font-medium">
          Explore courses that equip you with the knowledge to drive positive
          ESG practices within your business.
        </p>
        <div className="flex justify-center">
          <Button className="btn-orange-gradient font-bold text-lg px-8 py-4 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300">
            Get Started Today
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </div>
      {/* SVG Wave Divider */}
      <div className="w-full overflow-hidden leading-none absolute bottom-0 left-0" style={{lineHeight:0}}>
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="block w-full h-24 md:h-32" preserveAspectRatio="none">
          <path d="M0,40 C360,120 1080,0 1440,80 L1440,120 L0,120 Z" fill="#fff"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;