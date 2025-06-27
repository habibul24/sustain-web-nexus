import React, { useState } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

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
  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder: do nothing
  };

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
        <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-8">Submit</Button>
      </div>
    </form>
  );
};

export default RiskAssessment; 