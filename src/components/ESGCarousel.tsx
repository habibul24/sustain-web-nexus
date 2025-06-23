
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Users, Shield, TrendingUp, BarChart3, Award } from 'lucide-react';

const ESGCarousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      icon: <Leaf className="w-8 h-8 text-green-600" />,
      title: "Environmental Impact",
      description: "Comprehensive carbon footprint tracking and environmental sustainability metrics",
      features: [
        "Carbon emissions monitoring",
        "Renewable energy tracking",
        "Waste reduction analytics",
        "Water usage optimization"
      ],
      bgGradient: "from-green-50 to-emerald-100"
    },
    {
      icon: <Users className="w-8 h-8 text-blue-600" />,
      title: "Social Responsibility", 
      description: "Track social impact initiatives and community engagement programs",
      features: [
        "Employee diversity metrics",
        "Community investment tracking",
        "Safety performance indicators",
        "Training and development programs"
      ],
      bgGradient: "from-blue-50 to-sky-100"
    },
    {
      icon: <Shield className="w-8 h-8 text-purple-600" />,
      title: "Governance Excellence",
      description: "Ensure transparency, accountability, and ethical business practices",
      features: [
        "Board diversity tracking",
        "Ethics compliance monitoring",
        "Risk management protocols",
        "Stakeholder engagement"
      ],
      bgGradient: "from-purple-50 to-violet-100"
    }
  ];

  return (
    <section className="bg-gradient-to-br from-white via-gray-50 to-green-50 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold text-sm mb-6">
            <TrendingUp className="w-4 h-4 mr-2" />
            ESG Solutions
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
            Comprehensive 
            <span className="text-green-600"> ESG Platform</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Monitor, measure, and improve your environmental, social, and governance performance 
            with our integrated sustainability platform.
          </p>
        </div>

        {/* Custom Carousel */}
        <div className="relative">
          {/* Cards Container */}
          <div className="flex justify-center items-center space-x-4 mb-12">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`transition-all duration-500 cursor-pointer ${
                  index === activeSlide 
                    ? 'scale-100 z-10 opacity-100' 
                    : 'scale-90 opacity-60 blur-sm'
                } ${
                  index === activeSlide 
                    ? 'w-96' 
                    : 'w-80'
                }`}
                onClick={() => setActiveSlide(index)}
              >
                <Card className={`h-96 bg-gradient-to-br ${slide.bgGradient} border-2 hover:border-green-300 shadow-xl hover:shadow-2xl transition-all duration-300`}>
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                      {slide.icon}
                    </div>
                    <CardTitle className="text-2xl text-gray-900 mb-2">{slide.title}</CardTitle>
                    <CardDescription className="text-gray-700 text-base px-2">
                      {slide.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-6">
                    <div className="space-y-3">
                      {slide.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-gray-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* Dot Navigation */}
          <div className="flex justify-center space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeSlide 
                    ? 'bg-green-600 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
            <BarChart3 className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
            <div className="text-gray-600">Companies Tracking ESG</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
            <TrendingUp className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <div className="text-3xl font-bold text-gray-900 mb-2">40%</div>
            <div className="text-gray-600">Average Carbon Reduction</div>
          </div>
          <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100">
            <Award className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <div className="text-3xl font-bold text-gray-900 mb-2">95%</div>
            <div className="text-gray-600">Compliance Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ESGCarousel;
