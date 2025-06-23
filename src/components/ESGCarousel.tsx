
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Leaf, Users, Shield } from 'lucide-react';

const ESGCarousel = () => {
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
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
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
      color: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
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
      color: 'from-purple-500 to-indigo-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <section className="bg-cream py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            ESG Excellence
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive Environmental, Social, and Governance solutions designed 
            to transform your sustainability strategy
          </p>
        </div>

        <Carousel className="w-full max-w-5xl mx-auto">
          <CarouselContent>
            {esgData.map((item, index) => (
              <CarouselItem key={index}>
                <div className="p-4">
                  <Card className="bg-white border-0 shadow-2xl overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative">
                        {/* Gradient Header */}
                        <div className={`bg-gradient-to-r ${item.color} p-8 text-white`}>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-6xl font-bold opacity-20 absolute top-4 right-8">
                                {item.letter}
                              </div>
                              <h3 className="text-3xl font-bold mb-2">{item.title}</h3>
                              <p className="text-lg opacity-90">{item.description}</p>
                            </div>
                            <div className="text-white/80">
                              {item.icon}
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                              <h4 className="text-xl font-semibold text-primary mb-4">
                                Key Capabilities
                              </h4>
                              <ul className="space-y-3">
                                {item.features.map((feature, idx) => (
                                  <li key={idx} className="flex items-center text-gray-700">
                                    <div className={`w-2 h-2 rounded-full ${item.iconColor.replace('text-', 'bg-')} mr-3`}></div>
                                    {feature}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className={`${item.bgColor} rounded-2xl p-6 flex items-center justify-center`}>
                              <div className="text-center">
                                <div className={`${item.iconColor} mb-4 flex justify-center`}>
                                  {React.cloneElement(item.icon, { className: "w-16 h-16" })}
                                </div>
                                <p className="text-gray-700 font-medium">
                                  Advanced analytics and reporting for {item.title.toLowerCase()} metrics
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-4" />
          <CarouselNext className="right-4" />
        </Carousel>
      </div>
    </section>
  );
};

export default ESGCarousel;
