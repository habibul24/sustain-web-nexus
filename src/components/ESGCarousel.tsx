
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
      bgGradient: "from-green-50 to-emerald-100"
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
      bgGradient: "from-green-50 to-green-100"
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
      bgGradient: "from-green-50 to-green-200"
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
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Business team meeting in modern office"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gray-900/80"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold text-sm mb-6">
            <TrendingUp className="w-4 h-4 mr-2" />
            ESG Solutions
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
            Comprehensive 
            <span className="text-green-400"> ESG Platform</span>
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Monitor, measure, and improve your environmental, social, and governance performance 
            with our integrated sustainability platform.
          </p>
        </div>

        {/* ESG Carousel with Navigation */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 hover:scale-110"
          >
            <ArrowRight className="w-6 h-6" />
          </button>

          <div className="flex justify-center items-center space-x-4 mb-12">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`transition-all duration-500 cursor-pointer ${
                  index === activeSlide 
                    ? 'scale-100 z-10 opacity-100' 
                    : 'scale-90 opacity-60'
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

          <div className="flex justify-center space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeSlide 
                    ? 'bg-green-400 scale-125' 
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
