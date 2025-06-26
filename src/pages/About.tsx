import React from 'react';
// import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Zap, ShieldCheck, Briefcase, CheckCircle, Sparkles, Lightbulb, Globe } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Vision Section */}
      <section id="vision" className="pt-20 pb-32 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">Our Vision</h1>
          <p className="text-2xl text-gray-600 max-w-3xl mx-auto">
            To be the leading force in sustainable business transformation,<br />
            empowering organizations to thrive through seamless ESG integration.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="pt-10 pb-32 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">Our Mission</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            <div>
              <Zap className="mx-auto mb-6 w-12 h-12 text-green-500" />
              <p className="text-lg text-gray-700">
                Empower businesses to achieve a sustainable future through innovative tools and expert support for leveraging ESG data
              </p>
            </div>
            <div>
              <ShieldCheck className="mx-auto mb-6 w-12 h-12 text-green-500" />
              <p className="text-lg text-gray-700">
                Facilitate the transition to sustainable practices that enhance economic returns for businesses
              </p>
            </div>
            <div>
              <Briefcase className="mx-auto mb-6 w-12 h-12 text-green-500" />
              <p className="text-lg text-gray-700">
                Automate the ESG compliance process, making it accessible and efficient for all businesses
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section id="values" className="pt-10 pb-32 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-16">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-center">
            <div>
              <ShieldCheck className="mx-auto mb-6 w-12 h-12 text-green-500" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Integrity</h3>
              <p className="text-lg text-gray-700">Highest standards of honesty and ethical behavior</p>
            </div>
            <div>
              <Sparkles className="mx-auto mb-6 w-12 h-12 text-green-500" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Excellence</h3>
              <p className="text-lg text-gray-700">We strive for excellence in products, services and customer support</p>
            </div>
            <div>
              <Lightbulb className="mx-auto mb-6 w-12 h-12 text-green-500" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Innovation</h3>
              <p className="text-lg text-gray-700">Promoting new and existing solutions to sustainability challenges</p>
            </div>
            <div>
              <Globe className="mx-auto mb-6 w-12 h-12 text-green-500" />
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Sustainability</h3>
              <p className="text-lg text-gray-700">We build for impact and build to last in all areas of business</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
