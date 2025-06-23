
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-primary to-secondary min-h-screen flex items-center">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Transform Your Business with
              <span className="text-accent block">Sustainable Solutions</span>
            </h1>
            <p className="text-xl text-gray-100 mb-8 leading-relaxed">
              Comprehensive ESG tools and sustainability analytics to help your 
              organization meet compliance requirements, reduce environmental impact, 
              and drive sustainable growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                asChild 
                size="lg" 
                className="bg-accent hover:bg-accent/90 text-primary font-semibold px-8 py-4 text-lg"
              >
                <Link to="/contact">Get Started Today</Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="border-white text-white hover:bg-white hover:text-primary px-8 py-4 text-lg"
              >
                <Link to="/services">Explore Services</Link>
              </Button>
            </div>
          </div>
          
          <div className="animate-slide-in-right">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">500+</div>
                  <div className="text-gray-200">Companies Served</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">95%</div>
                  <div className="text-gray-200">Compliance Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">40%</div>
                  <div className="text-gray-200">Carbon Reduction</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent mb-2">24/7</div>
                  <div className="text-gray-200">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
