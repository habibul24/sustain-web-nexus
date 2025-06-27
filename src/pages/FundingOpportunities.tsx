import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';

const sampleFunding = [
  {
    name: 'Green Tech Fund',
    category: 'Green/Sustainable',
    organizingBody: 'Environmental Protection Department',
    status: 'Open',
    deadline: '2024-12-31',
    amount: 2000000,
    eligibility: 'Hong Kong-registered companies and organizations',
    expectedUse: 'Green technology R&D and deployment',
    link: 'https://www.gtf.gov.hk/',
    other: '',
  },
  {
    name: 'Technology Voucher Programme',
    category: 'Technology',
    organizingBody: 'Innovation and Technology Commission',
    status: 'Open',
    deadline: 'N/A',
    amount: 600000,
    eligibility: 'Local enterprises and organizations',
    expectedUse: 'Technology services and solutions',
    link: 'https://www.itf.gov.hk/',
    other: '',
  },
  {
    name: 'Sustainable Agriculture Grant',
    category: 'Agriculture',
    organizingBody: 'Agriculture, Fisheries and Conservation Department',
    status: 'Closed',
    deadline: '2024-06-30',
    amount: 300000,
    eligibility: 'Registered farmers and cooperatives',
    expectedUse: 'Sustainable farming practices',
    link: '',
    other: '',
  },
  {
    name: 'SME Export Marketing Fund',
    category: 'Business',
    organizingBody: 'Trade and Industry Department',
    status: 'Open',
    deadline: '2025-03-31',
    amount: 800000,
    eligibility: 'Hong Kong SMEs',
    expectedUse: 'Export promotion and marketing',
    link: 'https://www.smefund.tid.gov.hk/',
    other: '',
  },
  {
    name: 'Innovation and Technology Fund',
    category: 'Technology',
    organizingBody: 'Innovation and Technology Commission',
    status: 'Open',
    deadline: 'N/A',
    amount: 10000000,
    eligibility: 'Local companies, universities, and R&D centers',
    expectedUse: 'Innovation and technology projects',
    link: 'https://www.itf.gov.hk/',
    other: '',
  },
  {
    name: 'Recycling Fund',
    category: 'Green/Sustainable',
    organizingBody: 'Environmental Protection Department',
    status: 'Closed',
    deadline: '2024-05-15',
    amount: 500000,
    eligibility: 'Hong Kong recycling enterprises',
    expectedUse: 'Recycling operations and upgrades',
    link: '',
    other: '',
  },
  {
    name: 'Agri-Food Fund',
    category: 'Agriculture',
    organizingBody: 'Agriculture, Fisheries and Conservation Department',
    status: 'Open',
    deadline: '2024-11-30',
    amount: 400000,
    eligibility: 'Registered agri-food businesses',
    expectedUse: 'Agri-food innovation and sustainability',
    link: 'https://www.afcd.gov.hk/',
    other: '',
  },
  {
    name: 'Business Support Grant',
    category: 'Business',
    organizingBody: 'Trade and Industry Department',
    status: 'Closed',
    deadline: '2024-07-15',
    amount: 1000000,
    eligibility: 'Hong Kong-registered businesses',
    expectedUse: 'Business development and support',
    link: '',
    other: '',
  },
  {
    name: 'Clean Energy Grant',
    category: 'Green/Sustainable',
    organizingBody: 'Environmental Protection Department',
    status: 'Open',
    deadline: '2024-10-31',
    amount: 1500000,
    eligibility: 'Companies in clean energy sector',
    expectedUse: 'Clean energy projects',
    link: 'https://www.epd.gov.hk/',
    other: '',
  },
  {
    name: 'Tech Start Fund',
    category: 'Technology',
    organizingBody: 'Innovation and Technology Commission',
    status: 'Open',
    deadline: '2024-09-30',
    amount: 1200000,
    eligibility: 'Startups and tech entrepreneurs',
    expectedUse: 'Startup technology development',
    link: '',
    other: '',
  },
  {
    name: 'Urban Farming Grant',
    category: 'Agriculture',
    organizingBody: 'Agriculture, Fisheries and Conservation Department',
    status: 'Closed',
    deadline: '2024-04-30',
    amount: 250000,
    eligibility: 'Urban farmers and community gardens',
    expectedUse: 'Urban agriculture projects',
    link: '',
    other: '',
  },
  {
    name: 'Sustainable Business Award',
    category: 'Business',
    organizingBody: 'Trade and Industry Department',
    status: 'Open',
    deadline: '2024-12-15',
    amount: 900000,
    eligibility: 'Sustainable businesses in Hong Kong',
    expectedUse: 'Business sustainability initiatives',
    link: 'https://www.sba.tid.gov.hk/',
    other: '',
  },
];

const categories = [
  'All Categories',
  ...Array.from(new Set(sampleFunding.map((f) => f.category))),
];

function formatAmount(amount) {
  return 'HKD ' + amount.toLocaleString();
}

function formatDate(date) {
  if (!date || date === 'N/A') return 'N/A';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'N/A';
  return d.toLocaleDateString();
}

const ITEMS_PER_PAGE = 12;

export default function FundingOpportunities() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [status, setStatus] = useState('All');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [page, setPage] = useState(1);

  const filtered = sampleFunding.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === 'All Categories' || f.category === category;
    const matchesStatus = status === 'All' || f.status === status;
    const matchesMin = !minAmount || f.amount >= Number(minAmount);
    const matchesMax = !maxAmount || f.amount <= Number(maxAmount);
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
            <div key={f.name} className="flex border-2 border-gray-200 rounded-xl bg-white p-6 gap-6 items-center">
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-3xl font-bold text-gray-400">
                {f.name[0]}
              </div>
              {/* Info */}
              <div className="flex-1">
                <div className="text-xl font-semibold mb-1">{f.name}</div>
                <div className="text-gray-500 mb-2 text-sm">{f.eligibility}</div>
                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div><span className="font-medium">Category:</span> {f.category}</div>
                  <div><span className="font-medium">Status:</span> {f.status}</div>
                  <div><span className="font-medium">Amount:</span> {formatAmount(f.amount)}</div>
                  <div><span className="font-medium">Deadline:</span> {formatDate(f.deadline)}</div>
                </div>
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