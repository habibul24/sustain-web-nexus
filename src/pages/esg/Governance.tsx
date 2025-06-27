
import React, { useState, useEffect } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';

const legalStructures = [
  'Sole proprietorship',
  'Partnership',
  'Corporation',
  'LLC',
  'Other',
];
const yesNo = ['Yes', 'No'];
const industries = [
  'Apparel',
  'Biotech, Healthcare & Pharma',
  'Food, Beverage & Agriculture',
  'Fossil Fuels',
  'Hospitality',
  'Infrastructure',
  'Information Bodies',
  'Manufacturing',
  'Metals',
  'Power Generation',
  'Retail',
  'Services',
  'Transportation Services',
];
const reportingBoundaries = [
  'Financial Control',
  'Operational Control',
  'Equity Share',
];

const Governance = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    companyName: '',
    description: '',
    legalStructure: '',
    reportingPeriod: '',
    employees: '',
    revenue: '',
    multipleLocations: '',
    countries: '',
    industries: [],
    investmentShares: '',
    investmentAccounting: '',
    reportingBoundary: '',
    logo: null,
  });
  const [logoName, setLogoName] = useState('');
  const [responseId, setResponseId] = useState(null);

  useEffect(() => {
    if (user) {
      fetchExistingResponse();
    }
  }, [user]);

  const fetchExistingResponse = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('governance_responses')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setResponseId(data.id);
        setForm({
          companyName: data.company_name || '',
          description: data.description || '',
          legalStructure: data.legal_structure || '',
          reportingPeriod: data.reporting_period || '',
          employees: data.employees?.toString() || '',
          revenue: data.revenue?.toString() || '',
          multipleLocations: data.multiple_locations || '',
          countries: data.countries || '',
          industries: data.industries || [],
          investmentShares: data.investment_shares || '',
          investmentAccounting: data.investment_accounting || '',
          reportingBoundary: data.reporting_boundary || '',
          logo: null,
        });
        setLogoName(data.logo_url ? 'Previously uploaded logo' : '');
      }
    } catch (error) {
      console.error('Error fetching governance response:', error);
      toast.error('Failed to load existing data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCheckbox = (value) => {
    setForm((prev) => ({
      ...prev,
      industries: prev.industries.includes(value)
        ? prev.industries.filter((i) => i !== value)
        : [...prev.industries, value],
    }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, logo: file }));
    setLogoName(file ? file.name : '');
  };

  const uploadLogo = async (file) => {
    if (!file) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `governance-logos/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('governance')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('governance')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to save your response');
      return;
    }

    try {
      setSaving(true);

      let logoUrl = null;
      if (form.logo) {
        logoUrl = await uploadLogo(form.logo);
      }

      const formData = {
        user_id: user.id,
        company_name: form.companyName,
        description: form.description,
        legal_structure: form.legalStructure,
        reporting_period: form.reportingPeriod || null,
        employees: form.employees ? parseInt(form.employees, 10) : null,
        revenue: form.revenue ? parseFloat(form.revenue) : null,
        multiple_locations: form.multipleLocations,
        countries: form.countries,
        industries: form.industries,
        investment_shares: form.investmentShares,
        investment_accounting: form.investmentAccounting,
        reporting_boundary: form.reportingBoundary,
        logo_url: logoUrl,
      };

      let result;
      if (responseId) {
        // Update existing response
        result = await supabase
          .from('governance_responses')
          .update(formData)
          .eq('id', responseId)
          .select()
          .single();
      } else {
        // Create new response
        result = await supabase
          .from('governance_responses')
          .insert(formData)
          .select()
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      setResponseId(result.data.id);
      toast.success('Governance responses saved successfully!');
    } catch (error) {
      console.error('Error saving governance response:', error);
      toast.error('Failed to save governance responses');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading governance form...</div>
        </div>
      </div>
    );
  }

  return (
    <form className="max-w-3xl mx-auto p-6" onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold mb-6">Part 1 - General Company Details</h2>
      <div className="mb-4">
        <label className="block font-medium mb-1">1.1) Registered Company Name*</label>
        <Input value={form.companyName} onChange={e => handleChange('companyName', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">1.2) Give a general description and introduction to your organization*</label>
        <textarea className="w-full border rounded px-3 py-2" value={form.description} onChange={e => handleChange('description', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">1.3) What is your company's legal structure (e.g., sole proprietorship, partnership, corporation)?*</label>
        <select className="w-full border rounded px-3 py-2" value={form.legalStructure} onChange={e => handleChange('legalStructure', e.target.value)} required>
          <option value="">Select an option</option>
          {legalStructures.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">1.4) State the end date of the twelve-month period for which you are reporting data*</label>
        <Input type="date" value={form.reportingPeriod} onChange={e => handleChange('reportingPeriod', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">1.5) Report the total number of employees in your organization, based on staff headcount*</label>
        <Input type="number" min="0" value={form.employees} onChange={e => handleChange('employees', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">1.6) What is your company's annual revenue for the stated reporting period in USD? (Maximum 2 Decimal Places)*</label>
        <Input type="number" min="0" step="0.01" value={form.revenue} onChange={e => handleChange('revenue', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">1.7) Does your company work in multiple locations (countries)?*</label>
        <select className="w-full border rounded px-3 py-2" value={form.multipleLocations} onChange={e => handleChange('multipleLocations', e.target.value)} required>
          <option value="">Select an option</option>
          {yesNo.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">1.8) State the countries/areas in which you operate.*</label>
        <Input value={form.countries} onChange={e => handleChange('countries', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">1.9) Select the industry/industries that your organization belongs to*</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {industries.map(opt => (
            <label key={opt} className="flex items-center gap-2">
              <input type="checkbox" checked={form.industries.includes(opt)} onChange={() => handleCheckbox(opt)} />
              {opt}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">1.10) Does your company have any investment shares/ownership or control of other companies?*</label>
        <select className="w-full border rounded px-3 py-2" value={form.investmentShares} onChange={e => handleChange('investmentShares', e.target.value)} required>
          <option value="">Select an option</option>
          {yesNo.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">1.11) If yes, how does your company account for this investment in your financial reporting?*</label>
        <select className="w-full border rounded px-3 py-2" value={form.investmentAccounting} onChange={e => handleChange('investmentAccounting', e.target.value)} required>
          <option value="">Select an option</option>
          {['Equity Method', 'Cost Method', 'Consolidation', 'Other'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">1.12) Select the option that describes the reporting boundary for which climate-related impacts on your business are being reported.*</label>
        <div className="grid grid-cols-1 gap-2">
          {reportingBoundaries.map(opt => (
            <label key={opt} className="flex items-center gap-2">
              <input type="radio" name="reportingBoundary" checked={form.reportingBoundary === opt} onChange={() => handleChange('reportingBoundary', opt)} />
              {opt}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-6">
        <label className="block font-medium mb-1">1.13) Company Logo (JPEG or PNG)*</label>
        <div className="flex items-center gap-2">
          <input type="file" accept="image/png, image/jpeg" onChange={handleFile} />
          {logoName && <span className="text-sm text-gray-600">{logoName}</span>}
        </div>
      </div>
      <div className="flex justify-end">
        <Button 
          type="submit" 
          className="bg-green-500 hover:bg-green-600 text-white px-8"
          disabled={saving}
        >
          {saving ? 'Saving...' : responseId ? 'Update' : 'Submit'}
        </Button>
      </div>
    </form>
  );
};

export default Governance; 
