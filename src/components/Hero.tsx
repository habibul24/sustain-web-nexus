
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Leaf, Users, Building } from 'lucide-react';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-green-50 to-emerald-100 min-h-screen">
      {/* Hero Image Section */}
      <div className="relative h-96 md:h-[600px] overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
          alt="Rolling fields with blooming flowers" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/70 via-green-800/60 to-teal-900/70"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Transform Your Business with
              <span className="text-yellow-300 block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Sustainable Solutions
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-10 max-w-4xl mx-auto leading-relaxed font-medium">
              Comprehensive ESG tools and sustainability analytics to help your 
              organization meet compliance requirements and drive sustainable growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-lg px-8 py-4 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300">
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

      {/* Cards Section - Integrated */}
      <div className="relative -mt-32 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-green-800 mb-6">
              Who We Serve
            </h2>
            <p className="text-xl text-green-700 max-w-3xl mx-auto">
              Tailored sustainability solutions for every stage of your journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {/* Individuals Card */}
            <div className="bg-white rounded-2xl shadow-xl border-0 p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Individuals</h3>
              <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                Start your sustainability journey with our comprehensive courses
              </p>
              <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold w-full py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                Start Learning
              </Button>
            </div>

            {/* Businesses Card */}
            <div className="bg-white rounded-2xl shadow-xl border-0 p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Building className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Businesses</h3>
              <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                Comprehensive sustainability solutions for growing businesses
              </p>
              <Button className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-bold w-full py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                Start Your Assessment
              </Button>
            </div>

            {/* Large Organizations Card */}
            <div className="bg-white rounded-2xl shadow-xl border-0 p-8 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Leaf className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Large Organizations</h3>
              <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                Have you already implemented ESG, or need help with governance metrics?
              </p>
              <Button className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold w-full py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
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
