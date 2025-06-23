
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
    <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-2 hover:border-secondary">
      <CardHeader>
        <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl text-primary">{title}</CardTitle>
        <CardDescription className="text-gray-600">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-gray-700">
              <div className="w-2 h-2 bg-secondary rounded-full mr-3"></div>
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;
