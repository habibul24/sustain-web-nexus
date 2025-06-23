
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-primary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-primary font-bold text-sm">S</span>
              </div>
              <span className="text-xl font-bold">SustainTech</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Empowering businesses with cutting-edge sustainability and ESG tools 
              to drive positive environmental impact and regulatory compliance.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-gray-300 hover:text-white transition-colors">Services</Link></li>
              <li><Link to="/solutions" className="text-gray-300 hover:text-white transition-colors">Solutions</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li><span className="text-gray-300">ESG Reporting</span></li>
              <li><span className="text-gray-300">Carbon Tracking</span></li>
              <li><span className="text-gray-300">Compliance Management</span></li>
              <li><span className="text-gray-300">Sustainability Analytics</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-600 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 SustainTech. All rights reserved. Building a sustainable future together.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
