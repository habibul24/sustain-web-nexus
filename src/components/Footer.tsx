import React from 'react';
import { Link } from 'react-router-dom';
import { Linkedin, Twitter, Youtube, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white text-[#183a1d]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          <div className="flex flex-col items-start">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-[#183a1d] rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-xl font-bold text-[#183a1d]">GreenData</span>
            </div>
            <p className="text-[#29443e] mb-4 max-w-md">
              Empowering businesses with cutting-edge sustainability and ESG tools 
              to drive positive environmental impact and regulatory compliance.
            </p>
          </div>

          <div className="flex flex-col items-start md:items-center">
            <h3 className="text-lg font-semibold mb-4 text-[#183a1d]">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="text-[#29443e] hover:text-green-700 transition-colors">Terms of Use</Link></li>
              <li><Link to="/privacy" className="text-[#29443e] hover:text-green-700 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cookies" className="text-[#29443e] hover:text-green-700 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>

          <div className="flex flex-col items-start md:items-end">
            <h3 className="text-lg font-semibold mb-4 text-[#183a1d]">Connect With Us</h3>
            <div className="flex space-x-4 mb-2">
              <a href="https://www.linkedin.com/company/greendataforce/?viewAsMember=true" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-[#29443e] hover:text-green-700 transition-colors"><Linkedin className="w-6 h-6" /></a>
              <a href="https://x.com/greendataglobal" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-[#29443e] hover:text-green-700 transition-colors"><Twitter className="w-6 h-6" /></a>
              <a href="https://www.youtube.com/channel/UC7J4lMoO_hOXv3JFnUZddnw" target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="text-[#29443e] hover:text-green-700 transition-colors"><Youtube className="w-6 h-6" /></a>
              <a href="https://www.facebook.com/profile.php?id=61575756094111" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-[#29443e] hover:text-green-700 transition-colors"><Facebook className="w-6 h-6" /></a>
              <a href="https://www.instagram.com/esg_greendata.global?igsh=MTFhZWZkYWYzOGhiZw%3D%3D&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[#29443e] hover:text-green-700 transition-colors"><Instagram className="w-6 h-6" /></a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center">
          <p className="text-[#29443e]">
            © 2024 GreenData. All rights reserved. Building a sustainable future together.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
