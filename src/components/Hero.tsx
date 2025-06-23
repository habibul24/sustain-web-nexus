
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, Users, Building } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-cream min-h-screen">
      {/* Hero Image Section */}
      <div className="relative h-96 md:h-[500px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Rolling fields with blooming flowers" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/40"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              Transform Your Business with
              <span className="text-accent block">Sustainable Solutions</span>
            </h1>
            <p className="text-xl text-gray-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Comprehensive ESG tools and sustainability analytics to help your 
              organization meet compliance requirements and drive sustainable growth.
            </p>
          </div>
        </div>
      </div>

      {/* Cards Section - Integrated */}
      <div className="relative -mt-24 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Who We Serve
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {/* Individuals Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Individuals</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Start your sustainability journey with our comprehensive courses
              </p>
              <Button className="bg-secondary hover:bg-secondary/90 text-primary font-medium w-full">
                Start Learning
              </Button>
            </div>

            {/* Businesses Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Building className="w-8 h-8 text-accent-orange" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Businesses</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Comprehensive sustainability solutions for growing businesses
              </p>
              <Button className="bg-accent hover:bg-accent/90 text-primary font-medium w-full">
                Start Your Assessment
              </Button>
            </div>

            {/* Large Organizations Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center hover:shadow-md transition-shadow duration-300">
              <div className="w-16 h-16 bg-accent-orange/10 rounded-lg flex items-center justify-center mx-auto mb-6">
                <Leaf className="w-8 h-8 text-accent-orange" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Large Organizations</h3>
              <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                Have you already implemented ESG, or need help with governance metrics?
              </p>
              <Button className="bg-accent-orange hover:bg-accent-orange/90 text-white font-medium w-full">
                Simplify with GreenData
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
