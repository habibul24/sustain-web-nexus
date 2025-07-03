import React from 'react';
import SustainabilitySection from '@/components/SustainabilitySection';
import { FaChartLine, FaFileAlt, FaCheckCircle, FaCogs, FaChartPie, FaNetworkWired } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import { MdOutlineAssessment } from 'react-icons/md';

const features = [
  {
    icon: <FaNetworkWired className="text-3xl text-green-800" />,
    title: 'Automated Tracking',
    description: 'Effortlessly track carbon emissions, reducing manual input and streamlining sustainability efforts.'
  },
  {
    icon: <FaChartPie className="text-3xl text-green-800" />,
    title: 'Real-Time Reporting',
    description: 'Access instant carbon data, enabling informed decisions and quick reactions to changes.'
  },
  {
    icon: <FaCogs className="text-3xl text-green-800" />,
    title: 'Seamless Integration',
    description: 'Integrate GreenData with existing systems, enhancing workflow efficiency and data management.'
  },
  {
    icon: <FaFileAlt className="text-3xl text-green-800" />,
    title: 'Custom Reports',
    description: 'Generate tailored emission reports that meet specific requirements for sustainability practices.'
  },
  {
    icon: <FaCheckCircle className="text-3xl text-green-800" />,
    title: 'Compliance Assurance',
    description: 'Ensure compliance with environmental standards, simplifying regulatory adherence for your business.'
  },
  {
    icon: <FaChartLine className="text-3xl text-green-800" />,
    title: 'Insightful Analytics',
    description: 'Gain insights into your carbon footprint and enhance sustainability initiatives effectively.'
  },
];

const driveSustainabilityBullets = [
  'Simplify compliance and get audit-proof carbon emission data throughout your value chain.',
  'Seamlessly connect multiple data sources and automate your data collection processes.',
  'Watch data turn into information and make impactful decisions with just a few clicks!',
  'Drive real and actionable ESG compliant decisions based on real-time insights.',
  'Ensure that your investments yield positive returns with GreenData.'
];

const howItWorks = [
  {
    icon: <FiSettings className="text-5xl text-green-700 mb-4" />,
    title: 'Automate the process',
    description: 'Access instant carbon data, enabling informed decisions and quick reactions to changes.'
  },
  {
    icon: <FaChartLine className="text-5xl text-green-700 mb-4" />,
    title: 'Get real-time carbon data',
    description: 'Access instant carbon data, enabling informed decisions and quick reactions to changes.'
  },
  {
    icon: <MdOutlineAssessment className="text-5xl text-green-700 mb-4" />,
    title: 'Generate Reports',
    description: 'Access instant carbon data, enabling informed decisions and quick reactions to changes.'
  },
];

const GreenDataSoftware = () => {
  return (
    <div className="bg-white">
      <SustainabilitySection />
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gray-900">
            Transform Your Sustainability Efforts with Our Key Features
          </h2>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-12">
            {/* Left features */}
            <div className="flex-1 flex flex-col gap-10">
              {features.slice(0, 3).map((feature, idx) => (
                <div key={feature.title} className="flex items-start gap-4">
                  {feature.icon}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-gray-700 text-base">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Center image */}
            <div className="flex-shrink-0 flex justify-center">
              <img src="/1701189738351.jpg" alt="Sustainability" className="rounded-full w-72 h-72 object-cover shadow-xl border-8 border-white" />
            </div>
            {/* Right features */}
            <div className="flex-1 flex flex-col gap-10">
              {features.slice(3).map((feature, idx) => (
                <div key={feature.title} className="flex items-start gap-4">
                  {feature.icon}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{feature.title}</h3>
                    <p className="text-gray-700 text-base">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Drive Sustainability Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-12">
          {/* Left: Bullets */}
          <div className="flex-1">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Drive Sustainability with Smarter Carbon Data</h2>
            <ul className="list-disc pl-6 space-y-4 text-lg text-gray-800 mb-8">
              {driveSustainabilityBullets.map((text, idx) => (
                <li key={idx}>{text}</li>
              ))}
            </ul>
          </div>
          {/* Right: Carbon Footprint */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-3xl md:text-4xl font-bold text-green-700 mb-2 text-center">Total Carbon Footprint</div>
            <div className="text-5xl md:text-6xl font-extrabold text-green-600 mb-2 text-center" style={{ textShadow: '0 2px 8px #b6fcb6' }}>3325 kg CO₂e</div>
          </div>
        </div>
      </section>
      {/* How does it work section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-gray-900">How does it work?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {howItWorks.map((item, idx) => (
              <div key={item.title} className="flex flex-col items-center text-center">
                {item.icon}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-700 text-base max-w-xs">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default GreenDataSoftware; 