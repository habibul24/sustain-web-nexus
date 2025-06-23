import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Globe, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';

const SustainabilitySection = () => {
  const sustainabilityStats = [
    {
      icon: <Leaf className="w-8 h-8 text-green-600" />,
      title: "Carbon Reduction",
      value: "2.5M+",
      description: "Tons of CO2 reduced annually"
    },
    {
      icon: <Globe className="w-8 h-8 text-blue-600" />,
      title: "Global Impact",
      value: "150+",
      description: "Countries with active sustainability programs"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-emerald-600" />,
      title: "Efficiency Gains",
      value: "35%",
      description: "Average improvement in resource efficiency"
    }
  ];

  const keyFeatures = [
    "Real-time environmental monitoring and reporting",
    "Advanced analytics for sustainability optimization",
    "Comprehensive ESG compliance tracking",
    "Stakeholder engagement and transparency tools",
    "Supply chain sustainability management",
    "Climate risk assessment and mitigation strategies"
  ];

  return (
    <section className="py-24" style={{ 
      background: 'linear-gradient(to bottom, #d4c973, #374151)'
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 mb-6">
            <Leaf className="w-4 h-4 text-green-400" />
            <span className="text-sm font-medium text-white">Sustainability Excellence</span>
          </div>
          <h2 className="text-4xl font-bold text-white mb-6">
            Driving Global Sustainability Transformation
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed">
            Our comprehensive sustainability platform empowers organizations worldwide to achieve 
            meaningful environmental impact while driving business growth and stakeholder value.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {sustainabilityStats.map((stat, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 text-center hover:bg-white/15 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {stat.icon}
                </div>
                <CardTitle className="text-2xl font-bold text-white">{stat.value}</CardTitle>
                <CardDescription className="text-lg font-semibold text-green-300">{stat.title}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h3 className="text-3xl font-bold text-white mb-6">
              Comprehensive Sustainability Solutions
            </h3>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              From carbon footprint tracking to ESG reporting, our platform provides the tools 
              and insights needed to build a sustainable future. We help organizations measure, 
              manage, and improve their environmental impact while maintaining operational excellence.
            </p>
            
            <div className="space-y-4 mb-8">
              {keyFeatures.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-green-400 mr-4 mt-1 flex-shrink-0" />
                  <span className="text-gray-200 leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>

            <Button className="bg-gradient-to-r from-green-600 to-emerald-600 hover:shadow-lg text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2">
              <span>Explore Our Impact</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-3xl blur opacity-30"></div>
            <img
              src="https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt="Sustainable business practices and green technology"
              className="relative w-full h-80 object-cover rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SustainabilitySection; 