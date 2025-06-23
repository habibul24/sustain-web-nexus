
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import ServiceCard from '@/components/ServiceCard';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const services = [
    {
      title: "ESG Reporting",
      description: "Comprehensive Environmental, Social, and Governance reporting tools",
      icon: <div className="w-6 h-6 bg-secondary rounded"></div>,
      features: ["Automated data collection", "Regulatory compliance", "Custom dashboards", "Real-time monitoring"]
    },
    {
      title: "Carbon Tracking",
      description: "Advanced carbon footprint monitoring and reduction strategies",
      icon: <div className="w-6 h-6 bg-accent rounded-full"></div>,
      features: ["Scope 1, 2, 3 emissions", "Carbon offset management", "Reduction planning", "Verification tools"]
    },
    {
      title: "Sustainability Analytics",
      description: "Data-driven insights for sustainable business decisions",
      icon: <div className="w-6 h-6 bg-accent-orange rounded"></div>,
      features: ["Performance metrics", "Trend analysis", "Benchmarking", "ROI calculations"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      
      {/* Services Section */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
              Our Core Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive sustainability tools designed to help your business 
              thrive while protecting our planet.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {services.map((service, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <ServiceCard {...service} />
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white">
              <Link to="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-6">
                Why Choose SustainTech?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-secondary rounded-full flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-2">Expert Guidance</h3>
                    <p className="text-gray-600">Our team of sustainability experts provides personalized support for your unique challenges.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-accent rounded-full flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-2">Cutting-Edge Technology</h3>
                    <p className="text-gray-600">Advanced analytics and AI-powered insights to optimize your sustainability performance.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-6 h-6 bg-accent-orange rounded-full flex-shrink-0 mt-1"></div>
                  <div>
                    <h3 className="text-lg font-semibold text-primary mb-2">Proven Results</h3>
                    <p className="text-gray-600">Track record of helping companies achieve measurable sustainability improvements.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="animate-slide-in-right">
              <div className="bg-gradient-to-br from-secondary/10 to-accent/10 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-primary mb-6">Ready to Get Started?</h3>
                <p className="text-gray-600 mb-6">
                  Join hundreds of companies already transforming their sustainability practices with our tools.
                </p>
                <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white w-full">
                  <Link to="/contact">Schedule a Demo</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
