
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, TrendingUp, Globe } from 'lucide-react';

const ImageTextSection = () => {
  return (
    <section className="bg-gradient-to-br from-emerald-100 via-green-50 to-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold text-sm mb-6">
              <TrendingUp className="w-4 h-4 mr-2" />
              Leading Sustainability Platform
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              Building a 
              <span className="text-green-600"> Sustainable Future</span>
              <br />Together
            </h2>
            <p className="text-gray-700 text-xl mb-8 leading-relaxed">
              Our platform empowers organizations of all sizes to measure, manage, and 
              improve their environmental, social, and governance performance.
            </p>
            
            <div className="space-y-4 mb-10">
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
                <span className="text-lg text-gray-700">Carbon footprint tracking and reduction strategies</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
                <span className="text-lg text-gray-700">Comprehensive ESG reporting and compliance</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
                <span className="text-lg text-gray-700">Data-driven sustainability insights</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                Learn More About Our Impact
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button variant="outline" className="border-2 border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold text-lg px-8 py-4 rounded-xl">
                <Globe className="mr-2 w-5 h-5" />
                View Case Studies
              </Button>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl blur opacity-20"></div>
              <img
                src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="Sunlight filtering through green forest canopy"
                className="relative w-full h-96 lg:h-[500px] object-cover rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-6 shadow-xl border border-gray-100">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">1000+</div>
                  <div className="text-sm text-gray-600 font-medium">Companies Trust Us</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageTextSection;
