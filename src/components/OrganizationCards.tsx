import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrganizationCards = () => {
  const organizationCards = [
    {
      image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=600&q=80",
      title: "Individual",
      description: "Our comprehensive ESG hub is designed to help you master ESG implementation in companies. Gain the practical skills required to confidently calculate and interpret ESG metrics for reporting within hours.",
      features: [
        "ESG courses",
        "Policies & Templates",
        "Calculation Templates"
      ],
      buttonText: "Start Personal Journey",
      bgColor: "bg-white"
    },
    {
      image: "https://assets-blog.s3.amazonaws.com/office-furniture-blog/wp-content/uploads/2022/08/08004006/SP-HA_Blade-and-OFS-Opt-2-White_Frosted_Blue_Acrylic_Silver_Vectra_SP-scaled.jpg",
      title: "Business",
      description: "From first assessment to ESG report creation, we provide the expertise & tools you need to ensure regulatory compliance & successfully implement sustainability within your company.",
      features: [
        "First time ESG assessment",
        "Materiality assessment",
        "ESG Data management software",
        "Expert Advisory services"
      ],
      buttonText: "Explore Business Solutions",
      bgColor: "bg-white"
    },
    {
      image: "https://media.istockphoto.com/id/479842074/photo/empty-road-at-building-exterior.jpg?s=612x612&w=0&k=20&c=SbyfZGN0i2O_QPLCdBcu9vhuzbQvTz4bGEn-lIzrN0E=",
      title: "Large Organization",
      description: "Does gathering consistent ESG data across your global locations feel like an insurmountable hurdle? Our specialty is working with large and listed organizations like yours to centralize data and streamline reporting, transforming it from a burden into a strategic asset.",
      features: [
        "Customize Your Data Management Platform",
        "Supply chain data management",
        "Create & Share Custom Training"
      ],
      buttonText: "Schedule Enterprise Demo",
      bgColor: "bg-white"
    }
  ];

  return (
    <section className="py-12" style={{ 
      background: 'linear-gradient(to bottom, #eaffb2, #c6e97a)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center mb-16">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg px-8 py-6 max-w-2xl w-full border border-green-100 text-center">
            <h2 className="text-4xl font-bold text-orange-400 mb-2">Who We Serve</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {organizationCards.map((card, index) => (
            <Card key={index} className={`${card.bgColor} border-2 border-green-300 hover:border-green-600 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col rounded-3xl`}>
              <CardHeader className="text-center pb-4">
                <img src={card.image} alt={card.title + ' illustration'} className="w-36 h-36 object-cover rounded-full mx-auto mb-6 shadow-xl border-4 border-green-200" />
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
                <Button asChild className="w-full btn-orange-gradient font-semibold py-3 rounded-lg mt-auto">
                  <Link to="/sign-up">
                    {card.buttonText}
                  </Link>
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
