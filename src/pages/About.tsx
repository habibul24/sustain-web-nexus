import React from 'react';
// import Header from '@/components/Header';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
            About SustainTech
          </h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto animate-fade-in">
            We're on a mission to make sustainability accessible, measurable, and profitable 
            for businesses of all sizes.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-3xl font-bold text-primary mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                At SustainTech, we believe that every business has the power to create positive 
                environmental impact while driving growth and profitability. Our comprehensive 
                suite of ESG and sustainability tools empowers organizations to measure, manage, 
                and improve their environmental performance.
              </p>
              <p className="text-lg text-gray-600">
                Founded in 2020 by a team of environmental scientists and tech innovators, 
                we've helped over 500 companies reduce their carbon footprint by an average 
                of 40% while maintaining regulatory compliance.
              </p>
            </div>
            <div className="animate-slide-in-right">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-primary mb-6">Our Values</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-secondary rounded-full"></div>
                    <span className="text-gray-700">Transparency in all our operations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-accent rounded-full"></div>
                    <span className="text-gray-700">Innovation for sustainable solutions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-accent-orange rounded-full"></div>
                    <span className="text-gray-700">Collaboration for global impact</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold text-primary mb-4">Meet Our Leadership Team</h2>
            <p className="text-xl text-gray-600">
              Experienced professionals dedicated to driving sustainable change
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Dr. Sarah Chen",
                role: "CEO & Co-Founder",
                bio: "Environmental scientist with 15+ years in sustainability consulting"
              },
              {
                name: "Michael Rodriguez",
                role: "CTO & Co-Founder",
                bio: "Former tech lead at major SaaS companies, expert in scalable solutions"
              },
              {
                name: "Emma Thompson",
                role: "Head of ESG Solutions",
                bio: "Former regulatory compliance officer with deep industry knowledge"
              }
            ].map((member, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 0.2}s` }}>
                <div className="w-32 h-32 bg-gradient-to-br from-secondary to-accent rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-bold text-primary mb-2">{member.name}</h3>
                <p className="text-secondary font-medium mb-3">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
