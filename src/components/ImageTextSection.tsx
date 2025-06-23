
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const ImageTextSection = () => {
  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
              Building a Sustainable Future Together
            </h2>
            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
              Our platform empowers organizations of all sizes to measure, manage, and 
              improve their environmental, social, and governance performance. From carbon 
              footprint tracking to comprehensive ESG reporting, we provide the tools you 
              need to drive meaningful change.
            </p>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Join thousands of companies already making a difference with data-driven 
              sustainability insights and actionable recommendations that align with 
              global standards and frameworks.
            </p>
            <Button className="bg-primary hover:bg-primary/90 text-white font-medium">
              Learn More About Our Impact
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
          <div className="order-1 lg:order-2">
            <img
              src="https://images.unsplash.com/photo-1518495973542-4542c06a5843?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt="Sunlight filtering through green forest canopy"
              className="w-full h-96 object-cover rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageTextSection;
