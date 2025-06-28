
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { FundingOpportunity } from '@/types/funding';

function formatAmount(amount: number | null, currency: string = 'HKD'): string {
  if (!amount) return 'N/A';
  // Convert from cents to main currency unit
  const mainAmount = amount / 100;
  return `${currency} ${mainAmount.toLocaleString()}`;
}

function formatDate(date: string | null): string {
  if (!date || date === 'N/A') return 'N/A';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString();
}

const ITEMS_PER_PAGE = 12;

export default function FundingOpportunities() {
  const [fundingData, setFundingData] = useState<FundingOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [status, setStatus] = useState('All');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [page, setPage] = useState(1);
  const { toast } = useToast();

  // Fetch funding opportunities from database
  useEffect(() => {
    const fetchFundingData = async () => {
      try {
        const { data, error } = await supabase
          .from('funding_opportunities')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setFundingData(data || []);
      } catch (error) {
        console.error('Error fetching funding data:', error);
        toast({
          title: "Error",
          description: "Failed to load funding opportunities. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFundingData();
  }, [toast]);

  // Extract unique categories from data
  const categories = [
    'All Categories',
    ...Array.from(new Set(fundingData.map((f) => f.category))),
  ];

  const filtered = fundingData.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All Categories' || f.category === category;
    const matchesStatus = status === 'All' || f.status === status;
    const amountInMainUnit = f.amount ? f.amount / 100 : 0;
    const matchesMin = !minAmount || amountInMainUnit >= Number(minAmount);
    const matchesMax = !maxAmount || amountInMainUnit <= Number(maxAmount);
    return matchesSearch && matchesCategory && matchesStatus && matchesMin && matchesMax;
  });

  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const resetFilters = () => {
    setSearch('');
    setCategory('All Categories');
    setStatus('All');
    setMinAmount('');
    setMaxAmount('');
    setPage(1);
  };

  if (loading) {
    return (
      <div className="bg-white min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-center mb-8">Funding Opportunities</h1>
          <div className="flex justify-center">
            <div className="text-lg">Loading funding opportunities...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Funding Opportunities</h1>
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row md:items-end gap-4 mb-8">
          <Input
            className="w-full md:w-1/3"
            placeholder="Search funding..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full md:w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Open">Open</SelectItem>
              <SelectItem value="Closed">Closed</SelectItem>
              <SelectItem value="N/A">N/A</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="number"
            className="w-full md:w-32"
            placeholder="Min Amount"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            min={0}
          />
          <Input
            type="number"
            className="w-full md:w-32"
            placeholder="Max Amount"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            min={0}
          />
          <Button variant="outline" className="w-full md:w-28" onClick={resetFilters}>Reset</Button>
        </div>
        {/* Funding Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {paginated.map((f) => (
            <div key={f.id} className="flex border-2 border-gray-200 rounded-xl bg-white p-6 gap-6 items-center">
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-400">
                {f.name[0]}
              </div>
              {/* Info */}
              <div className="flex-1">
                <div className="text-xl font-semibold mb-1">{f.name}</div>
                <div className="text-gray-500 mb-2 text-sm">{f.eligibility || 'No eligibility criteria specified'}</div>
                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div><span className="font-medium">Category:</span> {f.category}</div>
                  <div><span className="font-medium">Status:</span> {f.status}</div>
                  <div><span className="font-medium">Amount:</span> {formatAmount(f.amount, f.amount_currency)}</div>
                  <div><span className="font-medium">Deadline:</span> {formatDate(f.deadline)}</div>
                </div>
                {f.organizing_body && (
                  <div className="text-sm mb-2">
                    <span className="font-medium">Organizing Body:</span> {f.organizing_body}
                  </div>
                )}
                {f.link && (
                  <a
                    href={f.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full mt-2"
                  >
                    <Button variant="outline" className="w-full border-gray-300">View Details</Button>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {/* No results message */}
        {paginated.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">No funding opportunities found matching your criteria.</p>
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <Button
              variant="outline"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="mx-2">Page {page} of {totalPages}</span>
            <Button
              variant="outline"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
