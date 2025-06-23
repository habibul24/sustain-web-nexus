
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-white via-green-50 to-emerald-100 min-h-screen">
      {/* Hero Image Section */}
      <div className="relative h-96 md:h-[600px] overflow-hidden">
        <img 
          src="https://static.wixstatic.com/media/84770f_c2ce0da1dbc6481da30aa5b929f4ac3b~mv2.jpg" 
          alt="Green sustainable landscape with rolling hills" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/70 via-green-800/60 to-green-900/70"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Transform Your Business with
              <span className="text-green-300 block bg-gradient-to-r from-green-300 to-emerald-200 bg-clip-text text-transparent">
                Sustainable Solutions
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-10 max-w-4xl mx-auto leading-relaxed font-medium">
              Comprehensive ESG tools and sustainability analytics to help your 
              organization meet compliance requirements and drive sustainable growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg px-8 py-4 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300">
                Get Started Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-green-800 font-semibold text-lg px-8 py-4 rounded-full backdrop-blur-sm bg-white/10">
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
