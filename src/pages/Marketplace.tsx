import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

const sampleCompanies = [
  {
    name: 'A Plastic Ocean Foundation',
    industry: 'Education',
    sustainabilityService: 'Education',
    location: 'Hong Kong',
    businessNature: 'NGO',
    website: 'https://www.plasticoceans.org.hk/',
    introduction: 'Promoting education and solutions for plastic pollution in oceans.',
    contactEmail: 'info@plasticoceans.org.hk',
    phone: '+85212345678',
  },
  {
    name: 'Active Energy Management Ltd.',
    industry: 'Services',
    sustainabilityService: 'Energy Efficiency',
    location: 'Hong Kong',
    businessNature: 'Consulting',
    website: 'https://www.active-energy.com/',
    introduction: 'Energy efficiency consulting for sustainable business operations.',
    contactEmail: 'contact@active-energy.com',
    phone: '+85287654321',
  },
  {
    name: 'Ballard Power Systems',
    industry: 'Power Generation',
    sustainabilityService: 'Clean Energy',
    location: 'USA',
    businessNature: 'Technology Provider',
    website: 'https://www.ballard.com/',
    introduction: 'Fuel cell and clean energy solutions for a sustainable future.',
    contactEmail: 'info@ballard.com',
    phone: '',
  },
  {
    name: 'Carbon Wallet',
    industry: 'Services',
    sustainabilityService: 'Green Lifestyle',
    location: 'Hong Kong',
    businessNature: 'Platform',
    website: 'https://www.carbonwallet.com/',
    introduction: 'Green lifestyle reward platform for eco-friendly actions.',
    contactEmail: 'hello@carbonwallet.com',
    phone: '',
  },
  {
    name: 'Circular Economy (Hong Kong) Limited',
    industry: 'Education',
    sustainabilityService: 'Circular Economy',
    location: 'Hong Kong',
    businessNature: 'Education',
    website: 'https://www.circular-economy.hk/',
    introduction: 'Circular economy education and advocacy in Hong Kong.',
    contactEmail: 'info@circular-economy.hk',
    phone: '',
  },
  {
    name: 'EcoVadis',
    industry: 'Services',
    sustainabilityService: 'Sustainability Ratings',
    location: 'Europe',
    businessNature: 'Ratings Provider',
    website: 'https://www.ecovadis.com/',
    introduction: 'Business sustainability ratings for global supply chains.',
    contactEmail: 'contact@ecovadis.com',
    phone: '',
  },
  {
    name: 'Green Standards',
    industry: 'Infrastructure',
    sustainabilityService: 'Office Decommissioning',
    location: 'USA',
    businessNature: 'Services',
    website: 'https://greenstandardsltd.com/',
    introduction: 'Sustainable office decommissioning and asset reuse.',
    contactEmail: 'info@greenstandardsltd.com',
    phone: '+12065551234',
  },
];

const industries = [
  'All',
  ...Array.from(new Set(sampleCompanies.map((c) => c.industry))),
];
const locations = [
  'All',
  ...Array.from(new Set(sampleCompanies.map((c) => c.location))),
];
const services = [
  'All',
  ...Array.from(new Set(sampleCompanies.map((c) => c.sustainabilityService))),
];

export default function Marketplace() {
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('All');
  const [location, setLocation] = useState('All');
  const [service, setService] = useState('All');
  const [contactModal, setContactModal] = useState({ open: false, type: '', company: null });

  const filtered = sampleCompanies.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry = industry === 'All' || c.industry === industry;
    const matchesLocation = location === 'All' || c.location === location;
    const matchesService = service === 'All' || c.sustainabilityService === service;
    return matchesSearch && matchesIndustry && matchesLocation && matchesService;
  });

  const resetFilters = () => {
    setSearch('');
    setIndustry('All');
    setLocation('All');
    setService('All');
  };

  return (
    <div className="bg-muted/50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Marketplace</h1>
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-center">
          <Input
            className="w-full md:w-1/3"
            placeholder="Search company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={industry} onValueChange={setIndustry}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((i) => (
                <SelectItem key={i} value={i}>{i}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((l) => (
                <SelectItem key={l} value={l}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={service} onValueChange={setService}>
            <SelectTrigger className="w-full md:w-56">
              <SelectValue placeholder="Sustainability Service" />
            </SelectTrigger>
            <SelectContent>
              {services.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-full md:w-28" onClick={resetFilters}>Reset</Button>
        </div>
        {/* Company Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((company) => (
            <div key={company.name} className="flex border rounded-xl bg-white p-6 gap-6 items-center">
              {/* Logo/Icon */}
              <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-3xl font-bold text-gray-400">
                {company.name[0]}
              </div>
              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="text-xl font-semibold hover:underline">
                    {company.name}
                  </a>
                </div>
                <div className="text-gray-500 mb-2 text-sm">{company.introduction}</div>
                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div><span className="font-medium">Industry:</span> {company.industry}</div>
                  <div><span className="font-medium">Location:</span> {company.location}</div>
                </div>
                <div className="flex gap-2">
                  {company.phone && (
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-300"
                      onClick={() => setContactModal({ open: true, type: 'phone', company })}
                    >
                      Call
                    </Button>
                  )}
                  {company.contactEmail && (
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-300"
                      onClick={() => setContactModal({ open: true, type: 'email', company })}
                    >
                      Email
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Contact Modal */}
        <Dialog open={contactModal.open} onOpenChange={(open) => !open && setContactModal({ open: false, type: '', company: null })}>
          <DialogContent className="max-w-xs rounded-xl">
            <DialogHeader>
              <DialogTitle>
                {contactModal.type === 'phone' && contactModal.company && `Contact ${contactModal.company.name}`}
                {contactModal.type === 'email' && contactModal.company && `Contact ${contactModal.company.name}`}
              </DialogTitle>
            </DialogHeader>
            {contactModal.type === 'phone' && contactModal.company && (
              <div className="py-4 text-center">
                <a href={`tel:${contactModal.company.phone}`} className="text-lg font-semibold text-primary hover:underline">{contactModal.company.phone}</a>
              </div>
            )}
            {contactModal.type === 'email' && contactModal.company && (
              <div className="py-4 text-center">
                <a href={`mailto:${contactModal.company.contactEmail}`} className="text-lg font-semibold text-primary hover:underline">{contactModal.company.contactEmail}</a>
              </div>
            )}
            <DialogClose asChild>
              <Button variant="outline" className="w-full mt-2">Close</Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 