import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle, TrendingUp } from 'lucide-react';

const ImageTextSection = () => {
  return (
    <section className="relative py-12" style={{ 
      background: 'linear-gradient(to bottom, #ffffff, #eaffb2)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            {/*
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold text-sm mb-6">
              <TrendingUp className="w-4 h-4 mr-2" />
              Leading Sustainability Platform
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-8 leading-tight" style={{ color: '#294e36' }}>
               Building a Sustainable Future Together
            </h2>
            */}
            <p className="text-gray-700 text-xl mb-8 leading-relaxed">
              Getting started with ESG and sustainability can be complex. We make the process clear and straightforward for faster implementation.<br /><br />
              As your ESG consulting partner, we provide the practical tools, expertise and clear guidance from your first step to full compliance and handle the complexities of ESG regulations so you can make confident decisions.<br /><br />
              We elevate your existing ESG process through trusted technology and expert training, partnering with you to build a resilient and future-ready business.
            </p>
            
            {/*}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="btn-orange-gradient font-bold text-lg px-8 py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                Learn More About Our Impact
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
            */}
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl blur opacity-20"></div>
              <img
                src="https://d.newsweek.com/en/full/2138885/business-people-working-together.jpg"
                alt="Business people working together"
                className="relative w-full h-96 lg:h-[500px] object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageTextSection;
