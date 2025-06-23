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
      bgColor: "bg-white"
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
      bgColor: "bg-white"
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
      bgColor: "bg-white"
    }
  ];

  return (
    <section className="py-24" style={{ 
      background: 'linear-gradient(to bottom, #e3e480, #d4c973)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {organizationCards.map((card, index) => (
            <Card key={index} className={`${card.bgColor} border-2 border-green-300 hover:border-green-600 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col`}>
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  {card.icon}
                </div>
                <CardTitle className="text-2xl text-gray-900 mb-2">{card.title}</CardTitle>
                <CardDescription className="text-gray-700 text-base">
                  {card.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="px-6 flex flex-col flex-grow">
                <div className="space-y-3 mb-6 flex-grow">
                  {card.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-sm text-gray-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                      {feature}
                    </div>
                  ))}
                </div>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg mt-auto">
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
