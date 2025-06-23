
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Building, Building2 } from 'lucide-react';

const OrganizationCards = () => {
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
      bgColor: "bg-white/90 backdrop-blur-sm"
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
      bgColor: "bg-white/90 backdrop-blur-sm"
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
      bgColor: "bg-white/90 backdrop-blur-sm"
    }
  ];

  return (
    <section className="bg-green-100/60 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {organizationCards.map((card, index) => (
            <Card key={index} className={`${card.bgColor} border-0 shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col transform hover:-translate-y-2 hover:scale-[1.02]`}>
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg ring-4 ring-green-50">
                  {card.icon}
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">{card.title}</CardTitle>
                <CardDescription className="text-gray-600 text-base leading-relaxed font-medium">
                  {card.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 flex flex-col flex-grow">
                <div className="space-y-4 mb-8 flex-grow">
                  {card.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm text-gray-700 font-medium">
                      <div className="w-2.5 h-2.5 bg-gradient-to-r from-green-500 to-green-600 rounded-full mr-4 flex-shrink-0 shadow-sm"></div>
                      {feature}
                    </div>
                  ))}
                </div>
                <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 mt-auto">
                  {card.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OrganizationCards;
