
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Solutions = () => {
  const industries = [
    {
      title: "Manufacturing",
      description: "Optimize production processes while reducing environmental impact",
      challenges: ["High energy consumption", "Waste management", "Supply chain complexity"],
      solutions: ["Energy monitoring systems", "Waste reduction programs", "Supplier sustainability tracking"]
    },
    {
      title: "Financial Services",
      description: "Meet regulatory requirements and sustainable finance standards",
      challenges: ["ESG reporting compliance", "Climate risk assessment", "Sustainable investment tracking"],
      solutions: ["Automated ESG reporting", "Climate scenario analysis", "Green portfolio management"]
    },
    {
      title: "Retail & Consumer Goods",
      description: "Build sustainable brands that resonate with conscious consumers",
      challenges: ["Product lifecycle assessment", "Packaging sustainability", "Consumer transparency"],
      solutions: ["Lifecycle tracking tools", "Sustainable packaging analysis", "Transparency dashboards"]
    },
    {
      title: "Technology",
      description: "Lead by example in corporate sustainability practices",
      challenges: ["Data center energy usage", "Electronic waste", "Remote work carbon footprint"],
      solutions: ["Green IT optimization", "E-waste management", "Remote work impact tracking"]
    },
    {
      title: "Healthcare",
      description: "Balance patient care with environmental responsibility",
      challenges: ["Medical waste management", "Energy-intensive operations", "Supply chain sustainability"],
      solutions: ["Medical waste optimization", "Energy efficiency programs", "Sustainable procurement"]
    },
    {
      title: "Real Estate",
      description: "Create sustainable buildings and communities",
      challenges: ["Building energy efficiency", "Green building certification", "Tenant engagement"],
      solutions: ["Smart building systems", "Certification management", "Tenant sustainability programs"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in tracking-tight">
            Industry Solutions
          </h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto animate-fade-in font-medium leading-relaxed">
            Tailored sustainability solutions for every industry, addressing unique 
            challenges and regulatory requirements.
          </p>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-24 bg-gradient-to-br from-green-50/50 to-cream/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {industries.map((industry, index) => (
              <Card key={index} className="animate-fade-in border-0 bg-white/95 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-[1.02] group" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl font-bold text-primary mb-3 tracking-tight group-hover:text-secondary transition-colors duration-300">{industry.title}</CardTitle>
                  <CardDescription className="text-lg font-medium text-gray-600 leading-relaxed">{industry.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-primary mb-4 text-lg">Key Challenges:</h4>
                      <ul className="space-y-2">
                        {industry.challenges.map((challenge, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600 font-medium">
                            <div className="w-2.5 h-2.5 bg-gradient-to-r from-accent-orange to-red-500 rounded-full mr-4 shadow-sm"></div>
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-primary mb-4 text-lg">Our Solutions:</h4>
                      <ul className="space-y-2">
                        {industry.solutions.map((solution, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600 font-medium">
                            <div className="w-2.5 h-2.5 bg-gradient-to-r from-secondary to-primary rounded-full mr-4 shadow-sm"></div>
                            {solution}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20 animate-fade-in">
            <h2 className="text-4xl font-bold text-primary mb-6 tracking-tight">Success Stories</h2>
            <p className="text-xl text-gray-600 font-medium">
              Real results from companies that have transformed their sustainability practices
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                company: "TechCorp Manufacturing",
                industry: "Manufacturing",
                result: "45% reduction in carbon emissions",
                timeframe: "18 months"
              },
              {
                company: "Global Finance Group",
                industry: "Financial Services",
                result: "100% ESG compliance achieved",
                timeframe: "12 months"
              },
              {
                company: "Retail Solutions Inc",
                industry: "Retail",
                result: "30% waste reduction across all stores",
                timeframe: "24 months"
              }
            ].map((story, index) => (
              <Card key={index} className="text-center animate-fade-in bg-gradient-to-br from-white/95 to-green-50/50 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardHeader className="pb-6">
                  <CardTitle className="text-xl font-bold text-primary tracking-tight">{story.company}</CardTitle>
                  <CardDescription className="font-medium text-gray-600">{story.industry}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-secondary mb-3 tracking-tight">{story.result}</div>
                  <div className="text-gray-600 font-medium">in {story.timeframe}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Solutions;
