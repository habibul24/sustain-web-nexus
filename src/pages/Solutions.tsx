
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
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
            Industry Solutions
          </h1>
          <p className="text-xl text-gray-100 max-w-3xl mx-auto animate-fade-in">
            Tailored sustainability solutions for every industry, addressing unique 
            challenges and regulatory requirements.
          </p>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {industries.map((industry, index) => (
              <Card key={index} className="animate-fade-in border-2 hover:border-secondary transition-colors" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardHeader>
                  <CardTitle className="text-2xl text-primary">{industry.title}</CardTitle>
                  <CardDescription className="text-lg">{industry.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-primary mb-2">Key Challenges:</h4>
                      <ul className="space-y-1">
                        {industry.challenges.map((challenge, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-accent-orange rounded-full mr-3"></div>
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-2">Our Solutions:</h4>
                      <ul className="space-y-1">
                        {industry.solutions.map((solution, idx) => (
                          <li key={idx} className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-secondary rounded-full mr-3"></div>
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold text-primary mb-4">Success Stories</h2>
            <p className="text-xl text-gray-600">
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
              <Card key={index} className="text-center animate-fade-in bg-gradient-to-br from-cream to-white" style={{ animationDelay: `${index * 0.2}s` }}>
                <CardHeader>
                  <CardTitle className="text-xl text-primary">{story.company}</CardTitle>
                  <CardDescription>{story.industry}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-secondary mb-2">{story.result}</div>
                  <div className="text-gray-600">in {story.timeframe}</div>
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
