
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ServiceCard from '@/components/ServiceCard';

const Services = () => {
  const services = [
    {
      title: "ESG Reporting & Compliance",
      description: "Comprehensive tools for Environmental, Social, and Governance reporting",
      icon: <div className="w-6 h-6 bg-secondary rounded"></div>,
      features: [
        "Automated data collection from multiple sources",
        "Regulatory compliance tracking (SEC, EU, etc.)",
        "Custom reporting dashboards",
        "Real-time compliance monitoring",
        "Stakeholder communication tools"
      ]
    },
    {
      title: "Carbon Footprint Management",
      description: "End-to-end carbon tracking and reduction solutions",
      icon: <div className="w-6 h-6 bg-accent rounded-full"></div>,
      features: [
        "Scope 1, 2, and 3 emissions tracking",
        "Carbon offset portfolio management",
        "Reduction target setting and tracking",
        "Supply chain emissions analysis",
        "Third-party verification support"
      ]
    },
    {
      title: "Sustainability Analytics",
      description: "Data-driven insights for informed sustainability decisions",
      icon: <div className="w-6 h-6 bg-accent-orange rounded"></div>,
      features: [
        "Performance benchmarking against peers",
        "Trend analysis and forecasting",
        "ROI calculations for sustainability initiatives",
        "Risk assessment and scenario planning",
        "Custom KPI development"
      ]
    },
    {
      title: "Supply Chain Sustainability",
      description: "Tools to manage and improve supplier sustainability performance",
      icon: <div className="w-6 h-6 bg-primary/60 rounded"></div>,
      features: [
        "Supplier sustainability assessments",
        "Supply chain risk mapping",
        "Vendor sustainability scorecards",
        "Collaborative improvement programs",
        "Sustainable procurement guidelines"
      ]
    },
    {
      title: "Energy Management",
      description: "Optimize energy usage and transition to renewable sources",
      icon: <div className="w-6 h-6 bg-secondary/80 rounded-full"></div>,
      features: [
        "Energy consumption monitoring",
        "Renewable energy planning",
        "Energy efficiency optimization",
        "Utility bill analysis and management",
        "Grid integration for solar/wind"
      ]
    },
    {
      title: "Waste Management Solutions",
      description: "Comprehensive waste reduction and circular economy tools",
      icon: <div className="w-6 h-6 bg-accent/80 rounded"></div>,
      features: [
        "Waste stream tracking and analysis",
        "Recycling program optimization",
        "Circular economy planning",
        "Waste-to-energy assessments",
        "Zero waste certification support"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
            Our Services
          </h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto animate-fade-in">
            Comprehensive sustainability solutions designed to help your business 
            achieve environmental goals while driving operational efficiency.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm: px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <ServiceCard {...service} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold text-primary mb-4">How We Work</h2>
            <p className="text-xl text-gray-600">
              Our proven methodology ensures successful sustainability transformations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Assessment", description: "Comprehensive evaluation of current sustainability practices" },
              { step: "2", title: "Planning", description: "Custom strategy development with clear goals and timelines" },
              { step: "3", title: "Implementation", description: "Deployment of tools and processes with full support" },
              { step: "4", title: "Optimization", description: "Continuous monitoring and improvement of performance" }
            ].map((item, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
