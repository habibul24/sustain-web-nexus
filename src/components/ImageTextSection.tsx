
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, CheckCircle, TrendingUp, User, Building, Building2 } from 'lucide-react';

const ImageTextSection = () => {
  const organizationCards = [
    {
      icon: <User className="w-8 h-8 text-green-600" />,
      title: "Individual",
      description: "Personal sustainability tracking for conscious consumers",
      features: [
        "Personal carbon footprint calculator",
        "Sustainable lifestyle recommendations",
        "Green purchasing guides",
        "Environmental impact tracking"
      ],
      buttonText: "Start Personal Journey",
      bgColor: "bg-gradient-to-br from-green-50 to-white"
    },
    {
      icon: <Building className="w-8 h-8 text-green-700" />,
      title: "Business",
      description: "Comprehensive ESG solutions for growing companies",
      features: [
        "ESG reporting and analytics",
        "Compliance management",
        "Sustainability metrics",
        "Stakeholder communication"
      ],
      buttonText: "Explore Business Solutions",
      bgColor: "bg-gradient-to-br from-green-100 to-green-50"
    },
    {
      icon: <Building2 className="w-8 h-8 text-green-800" />,
      title: "Large Organization",
      description: "Enterprise-grade sustainability platform for complex operations",
      features: [
        "Advanced ESG analytics",
        "Multi-location tracking",
        "Custom reporting dashboards",
        "API integrations"
      ],
      buttonText: "Schedule Enterprise Demo",
      bgColor: "bg-gradient-to-br from-green-200 to-green-100"
    }
  ];

  return (
    <section className="bg-gradient-to-br from-green-50 via-gray-50 to-white py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Organization Size Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {organizationCards.map((card, index) => (
            <Card key={index} className={`${card.bgColor} border-2 border-green-200 hover:border-green-400 shadow-lg hover:shadow-xl transition-all duration-300 h-full`}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  {card.icon}
                </div>
                <CardTitle className="text-2xl text-gray-900 mb-2">{card.title}</CardTitle>
                <CardDescription className="text-gray-700 text-base">
                  {card.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 flex flex-col h-full">
                <div className="space-y-3 mb-6 flex-grow">
                  {card.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm text-gray-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                      {feature}
                    </div>
                  ))}
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg">
                  {card.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold text-sm mb-6">
              <TrendingUp className="w-4 h-4 mr-2" />
              Leading Sustainability Platform
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              Building a 
              <span className="text-green-600"> Sustainable Future</span>
              <br />Together
            </h2>
            <p className="text-gray-700 text-xl mb-8 leading-relaxed">
              Our platform empowers organizations of all sizes to measure, manage, and 
              improve their environmental, social, and governance performance.
            </p>
            
            <div className="space-y-4 mb-10">
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
                <span className="text-lg text-gray-700">Carbon footprint tracking and reduction strategies</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
                <span className="text-lg text-gray-700">Comprehensive ESG reporting and compliance</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 text-green-500 mr-4 flex-shrink-0" />
                <span className="text-lg text-gray-700">Data-driven sustainability insights</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
                Learn More About Our Impact
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-3xl blur opacity-20"></div>
              <img
                src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                alt="People working together collaboratively"
                className="relative w-full h-96 lg:h-[500px] object-cover rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ImageTextSection;
