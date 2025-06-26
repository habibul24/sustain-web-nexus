import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-[120vh] flex items-start justify-center pt-40">
      {/* Hero Image Section */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=100&sharp=10"
          alt="Dark forest with mystical lighting"
          className="w-full h-full object-cover object-center blur-lg scale-105"
          style={{ imageRendering: 'crisp-edges', filter: 'blur(16px) brightness(1.15)' }}
        />
      </div>
      <div className="relative z-10 text-center text-white px-4 max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold mb-6" style={{ lineHeight: '1.15', textShadow: '0 0 24px #7fae2e, 0 2px 12px #b6e36b' }}>
          Navigate Your<br />
          Sustainability Journey With<br />
          Clarity
        </h1>
        <p className="text-xl md:text-2xl text-gray-100 mb-10 max-w-4xl mx-auto font-medium" style={{ textShadow: '0 0 12px #7fae2e, 0 1px 8px #b6e36b' }}>
          Master the complexities of ESG compliance and make sustainability the cornerstone<br />
          of your competitive advantage
        </p>
        <div className="flex justify-center mt-16">
          <Button asChild className="btn-orange-gradient font-bold text-lg px-8 py-4 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300">
            <Link to="/sign-up">
              Get Started Today
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
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
