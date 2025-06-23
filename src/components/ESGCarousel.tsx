
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf, Users, Shield, ArrowRight } from 'lucide-react';

const ESGCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const esgData = [
    {
      letter: 'E',
      title: 'Environmental',
      icon: <Leaf className="w-12 h-12" />,
      description: 'Monitor and reduce your environmental impact',
      features: [
        'Carbon footprint tracking',
        'Energy consumption analysis',
        'Waste management optimization',
        'Water usage monitoring',
        'Renewable energy integration'
      ],
      color: 'from-emerald-500 via-green-500 to-teal-600',
      bgColor: 'bg-gradient-to-br from-green-50 to-emerald-100',
      iconColor: 'text-emerald-600',
      accent: 'bg-emerald-500'
    },
    {
      letter: 'S',
      title: 'Social',
      icon: <Users className="w-12 h-12" />,
      description: 'Build stronger communities and workforce',
      features: [
        'Employee engagement metrics',
        'Diversity & inclusion tracking',
        'Community impact assessment',
        'Health & safety monitoring',
        'Supply chain responsibility'
      ],
      color: 'from-blue-500 via-indigo-500 to-purple-600',
      bgColor: 'bg-gradient-to-br from-blue-50 to-indigo-100',
      iconColor: 'text-blue-600',
      accent: 'bg-blue-500'
    },
    {
      letter: 'G',
      title: 'Governance',
      icon: <Shield className="w-12 h-12" />,
      description: 'Ensure transparent and ethical operations',
      features: [
        'Board composition analysis',
        'Executive compensation tracking',
        'Risk management systems',
        'Compliance monitoring',
        'Stakeholder engagement'
      ],
      color: 'from-purple-500 via-violet-500 to-indigo-600',
      bgColor: 'bg-gradient-to-br from-purple-50 to-violet-100',
      iconColor: 'text-purple-600',
      accent: 'bg-purple-500'
    }
  ];

  const getCardPosition = (index) => {
    if (index === activeIndex) {
      return 'translate-x-0 scale-100 z-20 opacity-100';
    } else if (index === (activeIndex - 1 + esgData.length) % esgData.length) {
      return '-translate-x-32 scale-90 z-10 opacity-60 blur-sm';
    } else {
      return 'translate-x-32 scale-90 z-10 opacity-60 blur-sm';
    }
  };

  return (
    <section className="bg-gradient-to-br from-gray-50 to-white py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 text-green-800 rounded-full font-semibold text-sm mb-6">
            <Shield className="w-4 h-4 mr-2" />
            Complete ESG Solution
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              ESG Excellence
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Comprehensive Environmental, Social, and Governance solutions designed 
            to transform your sustainability strategy and drive meaningful change
          </p>
        </div>

        {/* Custom Carousel Container */}
        <div className="relative max-w-6xl mx-auto mb-16">
          <div className="relative h-[650px] flex items-center justify-center">
            {esgData.map((item, index) => (
              <div
                key={index}
                className={`absolute transition-all duration-700 ease-in-out ${getCardPosition(index)}`}
                style={{ width: '520px' }}
              >
                <Card className="bg-white border-0 shadow-2xl overflow-hidden cursor-pointer hover:shadow-3xl transition-all duration-300 group">
                  <CardContent className="p-0">
                    <div className="relative">
                      {/* Gradient Header */}
                      <div className={`bg-gradient-to-r ${item.color} p-10 text-white relative overflow-hidden`}>
                        <div className="flex items-center justify-between relative z-10">
                          <div>
                            <h3 className="text-4xl font-bold mb-3">{item.title}</h3>
                            <p className="text-xl opacity-90 font-medium">{item.description}</p>
                          </div>
                          <div className="text-white/90 group-hover:scale-110 transition-transform duration-300">
                            {item.icon}
                          </div>
                        </div>
                        <div className="text-9xl font-bold opacity-10 absolute -top-6 -right-10">
                          {item.letter}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                      </div>

                      {/* Content */}
                      <div className="p-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div>
                            <h4 className="text-2xl font-bold text-gray-800 mb-6">
                              Key Capabilities
                            </h4>
                            <ul className="space-y-4">
                              {item.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center text-gray-700 text-lg">
                                  <div className={`w-3 h-3 rounded-full ${item.accent} mr-4 flex-shrink-0`}></div>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className={`${item.bgColor} rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden`}>
                            <div className={`${item.iconColor} mb-6 flex justify-center group-hover:scale-110 transition-transform duration-300`}>
                              {React.cloneElement(item.icon, { className: "w-20 h-20" })}
                            </div>
                            <p className="text-gray-700 font-semibold text-lg mb-6">
                              Advanced analytics and reporting for {item.title.toLowerCase()} metrics
                            </p>
                            <div className="flex items-center text-green-600 font-semibold group-hover:text-green-700 transition-colors duration-300">
                              <span>Explore Features</span>
                              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                            </div>
                            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/20 rounded-full"></div>
                            <div className="absolute -top-2 -left-2 w-8 h-8 bg-white/30 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Dot Navigation */}
        <div className="flex justify-center space-x-6">
          {esgData.map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative transition-all duration-300 ${
                index === activeIndex
                  ? 'scale-125'
                  : 'hover:scale-110'
              }`}
              aria-label={`Go to ${item.title} slide`}
            >
              <div className={`w-5 h-5 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? `bg-gradient-to-r ${item.color} shadow-lg`
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}></div>
              {index === activeIndex && (
                <div className={`absolute -inset-2 rounded-full bg-gradient-to-r ${item.color} opacity-20 animate-pulse`}></div>
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ESGCarousel;
