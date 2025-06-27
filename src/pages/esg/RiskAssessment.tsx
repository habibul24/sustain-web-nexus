import React, { useState, useEffect } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';

const yesNo = ['Yes', 'No'];
const reviewFrequency = ['Quarterly', 'Bi-annually', 'Annually'];
const valueChain = ['Direct Operations', 'Upstream', 'Downstream'];
const financialImpact = [
  'Increased direct costs',
  'Increased indirect (operating) costs',
  'Increased capital expenditures',
  'Increased credit risk',
  'Increased insurance claims liability',
  'Decreased revenues due to reduced demand for products and services',
  'Decreased revenues due to reduced production capacity',
  'Decreased access to capital',
  'Decreased asset value or asset useful life leading to write-offs, asset impairment or early retirement of existing assets',
];
const riskTypes = [
  '(Current regulation) Carbon pricing mechanisms',
  '(Current regulation) Enhanced emissions-reporting obligations',
  '(Current regulation) Mandates on and regulation of existing products and services (Current regulation) Other, please specify',
  '(Emerging regulation) Carbon pricing mechanisms (Emerging regulation) Enhanced emissions-reporting obligations',
  '(Emerging regulation) Mandates on and regulation of existing products and services (Emerging regulation) Other, please specify (Legal) Exposure to litigation (Legal) Other, please specify',
  '(Technology) Substitution of existing products and services with lower emissions options',
  '(Technology) Unsuccessful investment in new technologies',
  '(Technology) Transitioning to lower emissions technology (Technology) Other, please specify (Market) Changing customer behavior (Market) Uncertainty in market signals',
  '(Market) Increased cost of raw materials',
  '(Market) Other, please specify (Reputation) Shifts in consumer preferences',
  '(Reputation) Stigmatization of sector',
  '(Reputation) Increased stakeholder concern or negative stakeholder feedback (Reputation) Other, please specify',
  '(Acute physical) Increased severity and frequency of extreme weather events such as cyclones and floods (Acute physical) Increased likelihood and severity of wildfires (Acute physical) Other, please specify',
  '(Chronic physical) Changes in precipitation patterns and extreme variability in weather patterns (Chronic physical) Rising mean temperatures',
  '(Chronic physical) Rising sea levels (Chronic physical) Other, please specify',
];

const RiskAssessment = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [responseId, setResponseId] = useState(null);
  const [form, setForm] = useState({
    shortTerm: '',
    mediumTerm: '',
    longTerm: '',
    hasProcess: '',
    processDesc: '',
    reviewFrequency: '',
    lastAssessment: '',
    risk1: '',
    valueChain: '',
    riskType: [],
    financialImpact: '',
    riskMaterialize: '',
    riskImpact: '',
    timeHorizon: '',
    likelihood: '',
    magnitude: '',
  });

  useEffect(() => {
    if (user) {
      fetchExistingResponse();
    }
  }, [user]);

  const fetchExistingResponse = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('risk_assessment_responses')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setResponseId(data.id);
        setForm({
          shortTerm: data.short_term || '',
          mediumTerm: data.medium_term || '',
          longTerm: data.long_term || '',
          hasProcess: data.has_process || '',
          processDesc: data.process_desc || '',
          reviewFrequency: data.review_frequency || '',
          lastAssessment: data.last_assessment || '',
          risk1: data.risk1 || '',
          valueChain: data.value_chain || '',
          riskType: data.risk_type || [],
          financialImpact: data.financial_impact || '',
          riskMaterialize: data.risk_materialize || '',
          riskImpact: data.risk_impact || '',
          timeHorizon: data.time_horizon || '',
          likelihood: data.likelihood || '',
          magnitude: data.magnitude || '',
        });
      }
    } catch (error) {
      console.error('Error fetching risk assessment response:', error);
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
      riskType: prev.riskType.includes(value)
        ? prev.riskType.filter((i) => i !== value)
        : [...prev.riskType, value],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to save your response');
      return;
    }

    try {
      setSaving(true);

      const formData = {
        user_id: user.id,
        short_term: form.shortTerm,
        medium_term: form.mediumTerm,
        long_term: form.longTerm,
        has_process: form.hasProcess,
        process_desc: form.processDesc,
        review_frequency: form.reviewFrequency,
        last_assessment: form.lastAssessment || null,
        risk1: form.risk1,
        value_chain: form.valueChain,
        risk_type: form.riskType,
        financial_impact: form.financialImpact,
        risk_materialize: form.riskMaterialize,
        risk_impact: form.riskImpact,
        time_horizon: form.timeHorizon,
        likelihood: form.likelihood,
        magnitude: form.magnitude,
      };

      let result;
      if (responseId) {
        result = await supabase
          .from('risk_assessment_responses')
          .update(formData)
          .eq('id', responseId)
          .select()
          .single();
      } else {
        result = await supabase
          .from('risk_assessment_responses')
          .insert(formData)
          .select()
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      setResponseId(result.data.id);
      toast.success('Risk assessment responses saved successfully!');
    } catch (error) {
      console.error('Error saving risk assessment response:', error);
      toast.error('Failed to save risk assessment responses');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading risk assessment form...</div>
        </div>
      </div>
    );
  }

  return (
    <form className="max-w-3xl mx-auto p-6" onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold mb-6">How does your organization define short-, medium- and long-term time horizons?</h2>
      <div className="mb-4">
        <label className="block font-medium mb-1">3.1.1) Define Short-term time horizons for your company. (No. of months/years)*</label>
        <Input value={form.shortTerm} onChange={e => handleChange('shortTerm', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">3.1.2) Define Medium-term time horizons for your company. (No. of months/years)*</label>
        <Input value={form.mediumTerm} onChange={e => handleChange('mediumTerm', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">3.1.3) Define Long-term time horizons for your company. (No. of months/years)*</label>
        <Input value={form.longTerm} onChange={e => handleChange('longTerm', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">3.1.4) Does your organization have a process for identifying, assessing and managing climate-related risks?*</label>
        <select className="w-full border rounded px-3 py-2" value={form.hasProcess} onChange={e => handleChange('hasProcess', e.target.value)} required>
          <option value="">Select an option</option>
          {yesNo.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">3.1.5) If yes, describe your process(es) for identifying, assessing and managing climate-related risks.*</label>
        <textarea className="w-full border rounded px-3 py-2" value={form.processDesc} onChange={e => handleChange('processDesc', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">3.1.6) How often do you review your climate risk assessment? (Choose upper-bound)*</label>
        <select className="w-full border rounded px-3 py-2" value={form.reviewFrequency} onChange={e => handleChange('reviewFrequency', e.target.value)} required>
          <option value="">Select an option</option>
          {reviewFrequency.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">3.1.8) When was the last time you assessed your climate risks?*</label>
        <Input type="date" value={form.lastAssessment} onChange={e => handleChange('lastAssessment', e.target.value)} required />
      </div>
      <h2 className="text-lg font-semibold mb-6 mt-8">3.2) Provide details of risks identified with the potential to have a substantive financial or strategic impact on your business.</h2>
      <div className="mb-4">
        <label className="block font-medium mb-1">3.2.1) Risk #1 (There should be an option to add as many risks as they would like within this section)*</label>
        <Input value={form.risk1} onChange={e => handleChange('risk1', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">3.2.2) Where in the value chain does the risk driver occur*</label>
        <select className="w-full border rounded px-3 py-2" value={form.valueChain} onChange={e => handleChange('valueChain', e.target.value)} required>
          <option value="">Select an option</option>
          {valueChain.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">3.2.3) (Risk Type) Primary climate-related risk driver*</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {riskTypes.map(opt => (
            <label key={opt} className="flex items-center gap-2">
              <input type="checkbox" checked={form.riskType.includes(opt)} onChange={() => handleCheckbox(opt)} />
              {opt}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">3.2.4) Primary potential financial impact*</label>
        <select className="w-full border rounded px-3 py-2" value={form.financialImpact} onChange={e => handleChange('financialImpact', e.target.value)} required>
          <option value="">Select an option</option>
          {financialImpact.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">3.2.5) When do you expect the risk impacts to materialise? (quantitative or qualitative timeline)*</label>
        <Input value={form.riskMaterialize} onChange={e => handleChange('riskMaterialize', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">3.2.6) Company-specific risk impact(s) description*</label>
        <textarea className="w-full border rounded px-3 py-2" value={form.riskImpact} onChange={e => handleChange('riskImpact', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">3.2.8) Time horizon (months/years)*</label>
        <Input value={form.timeHorizon} onChange={e => handleChange('timeHorizon', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">3.2.9) Likelihood: (scale of 1-10)*</label>
        <Input value={form.likelihood} onChange={e => handleChange('likelihood', e.target.value)} required />
      </div>
      <div className="mb-6">
        <label className="block font-medium mb-1">3.2.10) Magnitude of impact: (units)*</label>
        <Input value={form.magnitude} onChange={e => handleChange('magnitude', e.target.value)} required />
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

export default RiskAssessment;
