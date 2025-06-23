
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
}

const ServiceCard = ({ title, description, icon, features }: ServiceCardProps) => {
  return (
    <Card className="h-full hover:shadow-2xl transition-all duration-300 border-0 bg-white/95 backdrop-blur-sm shadow-lg transform hover:-translate-y-2 hover:scale-[1.02] group">
      <CardHeader className="pb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-secondary/20 to-secondary/30 rounded-2xl flex items-center justify-center mb-6 shadow-lg ring-4 ring-secondary/10 group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <CardTitle className="text-2xl font-bold text-primary mb-3 tracking-tight group-hover:text-secondary transition-colors duration-300">{title}</CardTitle>
        <CardDescription className="text-gray-600 leading-relaxed font-medium text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-gray-700 font-medium">
              <div className="w-2.5 h-2.5 bg-gradient-to-r from-secondary to-primary rounded-full mr-4 shadow-sm"></div>
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
