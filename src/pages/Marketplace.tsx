
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { MarketplaceCompany } from '@/types/marketplace';
import { useToast } from '@/hooks/use-toast';

export default function Marketplace() {
  const [companies, setCompanies] = useState<MarketplaceCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('All');
  const [location, setLocation] = useState('All');
  const [service, setService] = useState('All');
  const [contactModal, setContactModal] = useState<{ open: boolean; type: string; company: MarketplaceCompany | null }>({ 
    open: false, 
    type: '', 
    company: null 
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('marketplace_companies')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      console.error('Error fetching companies:', error);
      toast({
        title: "Error",
        description: "Failed to load companies. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate filter options from the data
  const industries = [
    'All',
    ...Array.from(new Set(companies.map((c) => c.industry))).sort(),
  ];
  const locations = [
    'All',
    ...Array.from(new Set(companies.map((c) => c.location))).sort(),
  ];
  const services = [
    'All',
    ...Array.from(new Set(companies.map((c) => c.sustainability_service))).sort(),
  ];

  const filtered = companies.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
                         c.introduction?.toLowerCase().includes(search.toLowerCase());
    const matchesIndustry = industry === 'All' || c.industry === industry;
    const matchesLocation = location === 'All' || c.location === location;
    const matchesService = service === 'All' || c.sustainability_service === service;
    return matchesSearch && matchesIndustry && matchesLocation && matchesService;
  });

  const resetFilters = () => {
    setSearch('');
    setIndustry('All');
    setLocation('All');
    setService('All');
  };

  const handleContactClick = (type: string, company: MarketplaceCompany) => {
    if (type === 'phone' && !company.phone_contact) return;
    if (type === 'email' && !company.contact_email) return;
    setContactModal({ open: true, type, company });
  };

  if (loading) {
    return (
      <div className="bg-muted/50 min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">Marketplace</h1>
          <div className="flex justify-center items-center py-20">
            <div className="text-lg">Loading companies...</div>
          </div>
        </div>
      </div>
    );
  }

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
        
        {/* Results count */}
        <div className="text-center mb-4 text-gray-600">
          Showing {filtered.length} of {companies.length} companies
        </div>

        {/* Company Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((company) => (
            <div key={company.id} className="flex border rounded-xl bg-white p-6 gap-6 items-center">
              {/* Logo/Icon */}
              <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center text-3xl font-bold text-gray-400">
                {company.name[0]}
              </div>
              {/* Info */}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  {company.website_link ? (
                    <a 
                      href={company.website_link.startsWith('http') ? company.website_link : `https://${company.website_link}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xl font-semibold hover:underline"
                    >
                      {company.name}
                    </a>
                  ) : (
                    <span className="text-xl font-semibold">{company.name}</span>
                  )}
                </div>
                <div className="text-gray-500 mb-2 text-sm line-clamp-2">{company.introduction}</div>
                <div className="grid grid-cols-1 gap-1 mb-3 text-sm">
                  <div><span className="font-medium">Industry:</span> {company.industry}</div>
                  <div><span className="font-medium">Service:</span> {company.sustainability_service}</div>
                  <div><span className="font-medium">Location:</span> {company.location}</div>
                </div>
                <div className="flex gap-2">
                  {company.phone_contact && (
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-300"
                      onClick={() => handleContactClick('phone', company)}
                    >
                      Call
                    </Button>
                  )}
                  {company.contact_email && (
                    <Button
                      variant="outline"
                      className="flex-1 border-gray-300"
                      onClick={() => handleContactClick('email', company)}
                    >
                      Email
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && !loading && (
          <div className="text-center py-20">
            <div className="text-lg text-gray-500">No companies found matching your criteria</div>
          </div>
        )}

        {/* Contact Modal */}
        <Dialog open={contactModal.open} onOpenChange={(open) => !open && setContactModal({ open: false, type: '', company: null })}>
          <DialogContent className="max-w-xs rounded-xl">
            <DialogHeader>
              <DialogTitle>
                {contactModal.company && `Contact ${contactModal.company.name}`}
              </DialogTitle>
            </DialogHeader>
            {contactModal.type === 'phone' && contactModal.company && (
              <div className="py-4 text-center">
                {contactModal.company.phone_contact?.startsWith('http') ? (
                  <a 
                    href={contactModal.company.phone_contact} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-lg font-semibold text-primary hover:underline"
                  >
                    Visit Contact Page
                  </a>
                ) : (
                  <a 
                    href={`tel:${contactModal.company.phone_contact}`} 
                    className="text-lg font-semibold text-primary hover:underline"
                  >
                    {contactModal.company.phone_contact}
                  </a>
                )}
              </div>
            )}
            {contactModal.type === 'email' && contactModal.company && (
              <div className="py-4 text-center">
                <a 
                  href={`mailto:${contactModal.company.contact_email}`} 
                  className="text-lg font-semibold text-primary hover:underline"
                >
                  {contactModal.company.contact_email}
                </a>
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
