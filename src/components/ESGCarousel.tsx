
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Users, Shield, TrendingUp, ArrowLeft, ArrowRight } from 'lucide-react';

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
      bgGradient: "from-green-50/95 to-emerald-100/95"
    },
    {
      icon: <Users className="w-8 h-8 text-green-700" />,
      title: "Social Responsibility", 
      description: "Track social impact initiatives and community engagement programs",
      features: [
        "Employee diversity metrics",
        "Community investment tracking",
        "Safety performance indicators",
        "Training and development programs"
      ],
      bgGradient: "from-green-50/95 to-green-100/95"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-800" />,
      title: "Governance Excellence",
      description: "Ensure transparency, accountability, and ethical business practices",
      features: [
        "Board diversity tracking",
        "Ethics compliance monitoring",
        "Risk management protocols",
        "Stakeholder engagement"
      ],
      bgGradient: "from-green-50/95 to-green-200/95"
    }
  ];

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative bg-white py-24">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Modern sustainable office building"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gray-900/75"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-green-100/90 backdrop-blur-sm text-green-800 rounded-full font-bold text-sm mb-8 shadow-lg">
            <TrendingUp className="w-5 h-5 mr-3" />
            ESG Solutions
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight tracking-tight">
            Comprehensive 
            <span className="text-green-400"> ESG Platform</span>
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed font-medium">
            Monitor, measure, and improve your environmental, social, and governance performance 
            with our integrated sustainability platform.
          </p>
        </div>

        {/* ESG Carousel with Navigation */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-4 rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-md hover:bg-white/30 text-white p-4 rounded-full transition-all duration-300 hover:scale-110 shadow-lg"
          >
            <ArrowRight className="w-6 h-6" />
          </button>

          <div className="flex justify-center items-center space-x-6 mb-12">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`transition-all duration-500 cursor-pointer ${
                  index === activeSlide 
                    ? 'scale-100 z-10 opacity-100' 
                    : 'scale-90 opacity-70'
                } ${
                  index === activeSlide 
                    ? 'w-96' 
                    : 'w-80'
                }`}
                onClick={() => setActiveSlide(index)}
              >
                <Card className={`h-96 bg-gradient-to-br ${slide.bgGradient} backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1`}>
                  <CardHeader className="text-center pb-6">
                    <div className="w-20 h-20 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl ring-4 ring-white/30">
                      {slide.icon}
                    </div>
                    <CardTitle className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">{slide.title}</CardTitle>
                    <CardDescription className="text-gray-700 text-base px-2 leading-relaxed font-medium">
                      {slide.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-6">
                    <div className="space-y-4">
                      {slide.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-gray-700 font-medium">
                          <div className="w-2.5 h-2.5 bg-gradient-to-r from-green-500 to-green-600 rounded-full mr-4 flex-shrink-0 shadow-sm"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === activeSlide 
                    ? 'bg-green-400 scale-125 shadow-lg' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ESGCarousel;
