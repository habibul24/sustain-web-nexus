import React, { useState } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

const yesNo = ['Yes', 'No'];
const managementPositions = [
  'Board Chair',
  'Board Executive board',
  'Corporate executive team',
  'Chief Executive Officer (CEO)',
  'Chief Financial Officer (CFO)',
  'Chief Operating Officer (COO)',
  'Chief Procurement Officer (CPO)',
  'Chief Risk Officer (CRO)',
  'Chief Sustainability Officer (CSO)',
  'Chief Investment Officer (CIO) [Financial services only]',
  'Chief Underwriting Officer (CUO) [Financial services only]',
  'Chief Credit Officer (CCO) [Financial services only]',
  'Other C-Suite Officer',
  'President',
  'Executive officer',
  'Management group',
  'Business unit manager',
  'Energy manager',
  'Environmental, health, and safety manager',
  'Environment/Sustainability manager',
  'Facilities manager',
  'Process operations manager',
  'Procurement manager',
  'Public affairs manager',
  'Risk manager',
  'Portfolio/Fund manager [Financial services only]',
  'Investment analyst [Financial services only]',
  'Dedicated Responsible Investment staff [Financial services only]',
  'Investor Relations staff [Financial services only]',
  'Risk management staff [Financial services only]',
  'Buyer/purchasers',
  'All employees',
  'Other, please specify below',
];
const committeeOptions = ['Yes', 'No'];
const incentiveOptions = [
  'Yes',
  'Not currently but we plan to introduce them in the next two years',
  'No, and we do not plan to introduce them in the next two years',
];
const incentiveTypes = [
  'Activities incentivized',
  'Emission reduction project',
  'Emission reduction target',
  'Energy reduction project',
  'Energy reduction target',
  'Efficiency project',
  'Efficiency target',
  'Behaviour change related indicator',
  'Environmental criteria included in purchases',
  'Supply chain engagement',
  'Company performance against a climate-related sustainability index',
  'Portfolio/fund alignment to climate-related objectives [Financial services only]',
];

const Strategy = () => {
  const [form, setForm] = useState({
    responsibleMember: '',
    managementPosition: [],
    otherPosition: '',
    training: '',
    competency: '',
    communication: '',
    committee: '',
    committeeName: '',
    incentives: '',
    incentivePosition: '',
    otherIncentive: '',
    incentiveType: '',
    activities: [],
    additionalInfo: '',
    localIncentives: '',
    useIncentives: '',
    policies: '',
    integration: '',
    reassessment: '',
    boardTraining: '',
    trainingDetails: '',
    carbonTargets: '',
    monitorTargets: '',
    projectControl: '',
    comments: '',
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };
  const handleCheckbox = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((i) => i !== value)
        : [...prev[field], value],
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder: do nothing
  };

  return (
    <form className="max-w-3xl mx-auto p-6" onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold mb-6">2.1) Organizational Management Positions:</h2>
      <div className="mb-4">
        <label className="block font-medium mb-1">2.1.1) Is there any member(s) of your organization responsible for overseeing climate change matters?*</label>
        <select className="w-full border rounded px-3 py-2" value={form.responsibleMember} onChange={e => handleChange('responsibleMember', e.target.value)} required>
          <option value="">Select an option</option>
          {yesNo.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">2.1.2) If yes, which governance or management position is primarily responsible for climate-related governance?</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {managementPositions.map(opt => (
            <label key={opt} className="flex items-center gap-2">
              <input type="checkbox" checked={form.managementPosition.includes(opt)} onChange={() => handleCheckbox('managementPosition', opt)} />
              {opt}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">2.1.3) If other, please specify:</label>
        <Input value={form.otherPosition} onChange={e => handleChange('otherPosition', e.target.value)} />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">2.1.4) Please list any ESG related training or certification(s) this member(s) has completed? (e.g. CFO - GARP SCR) (if none, enter N/A)*</label>
        <textarea className="w-full border rounded px-3 py-2" value={form.training} onChange={e => handleChange('training', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">2.1.5) Do you believe the person/people addressed above are competent and skilful in assessing the climate-related risks and rewards that befall the company? (Please write a short explanation for each person entered)*</label>
        <textarea className="w-full border rounded px-3 py-2" value={form.competency} onChange={e => handleChange('competency', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">2.1.6) How are each of their roles and responsibilities communicated throughout the organization?*</label>
        <textarea className="w-full border rounded px-3 py-2" value={form.communication} onChange={e => handleChange('communication', e.target.value)} required />
      </div>
      <h2 className="text-lg font-semibold mb-6 mt-8">2.2) Organisational Management Committee</h2>
      <div className="mb-4">
        <label className="block font-medium mb-1">2.2.1) Is there a specific committee responsible for overseeing climate-related issues?*</label>
        <select className="w-full border rounded px-3 py-2" value={form.committee} onChange={e => handleChange('committee', e.target.value)} required>
          <option value="">Select an option</option>
          {committeeOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">2.2.2) If yes, please specify the committee name and its roles:</label>
        <Input value={form.committeeName} onChange={e => handleChange('committeeName', e.target.value)} />
      </div>
      <h2 className="text-lg font-semibold mb-6 mt-8">2.3) Governance and Incentives</h2>
      <div className="mb-4">
        <label className="block font-medium mb-1">2.3.1) Do you provide incentives for the management of climate-related issues, including the attainment of targets?*</label>
        <div className="flex flex-col gap-2">
          {incentiveOptions.map(opt => (
            <label key={opt} className="flex items-center gap-2">
              <input type="radio" name="incentives" checked={form.incentives === opt} onChange={() => handleChange('incentives', opt)} />
              {opt}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">2.3.2) Management position entitled to incentive*</label>
        <Input value={form.incentivePosition} onChange={e => handleChange('incentivePosition', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">2.3.3) For previous question, specify here</label>
        <Input value={form.otherIncentive} onChange={e => handleChange('otherIncentive', e.target.value)} />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">2.3.4) Type of incentive given*</label>
        <select className="w-full border rounded px-3 py-2" value={form.incentiveType} onChange={e => handleChange('incentiveType', e.target.value)} required>
          <option value="">Select an option</option>
          {incentiveTypes.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">2.3.5) Activities incentivized*</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {incentiveTypes.map(opt => (
            <label key={opt} className="flex items-center gap-2">
              <input type="checkbox" checked={form.activities.includes(opt)} onChange={() => handleCheckbox('activities', opt)} />
              {opt}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">2.3.6) Please state any additional information or comments you would like to share about company incentives?</label>
        <textarea className="w-full border rounded px-3 py-2" value={form.additionalInfo} onChange={e => handleChange('additionalInfo', e.target.value)} />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">2.3.7) Are you familiar with any local government or related incentives to manage your climate-related issues, risks or disclosures?*</label>
        <select className="w-full border rounded px-3 py-2" value={form.localIncentives} onChange={e => handleChange('localIncentives', e.target.value)} required>
          <option value="">Select an option</option>
          {yesNo.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">2.3.8) Do you take advantage of such incentives? Please provide further details on the incentives used by your firm.*</label>
        <textarea className="w-full border rounded px-3 py-2" value={form.useIncentives} onChange={e => handleChange('useIncentives', e.target.value)} required />
      </div>
      <h2 className="text-lg font-semibold mb-6 mt-8">2.4) Policies and Decision-making</h2>
      <div className="mb-4">
        <label className="block font-medium mb-1">2.4.1) Does your company have formal policies in place regarding climate change and sustainability? If yes, please describe them. (If none, enter N/A)*</label>
        <textarea className="w-full border rounded px-3 py-2" value={form.policies} onChange={e => handleChange('policies', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">2.4.2) Describe how climate-related considerations are integrated into your company's decision-making processes*</label>
        <textarea className="w-full border rounded px-3 py-2" value={form.integration} onChange={e => handleChange('integration', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">2.4.3) How often are climate risks and opportunities re-assessed and communicated to the entire management team? (Please elaborate in as much detail as possible)*</label>
        <textarea className="w-full border rounded px-3 py-2" value={form.reassessment} onChange={e => handleChange('reassessment', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">2.4.4) Does your organization provide training for board members and staff on climate-related governance and risks?*</label>
        <select className="w-full border rounded px-3 py-2" value={form.boardTraining} onChange={e => handleChange('boardTraining', e.target.value)} required>
          <option value="">Select an option</option>
          {yesNo.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">2.4.5) If yes, please outline what training modules are conducted and the length of training*</label>
        <textarea className="w-full border rounded px-3 py-2" value={form.trainingDetails} onChange={e => handleChange('trainingDetails', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">2.4.6) Has your company set any targets for their carbon/total emissions? Please specify. (If none, enter N/A) (we recommend a minimum of 5% annual reduction till 2030)*</label>
        <textarea className="w-full border rounded px-3 py-2" value={form.carbonTargets} onChange={e => handleChange('carbonTargets', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">2.4.7) If yes, how does your company monitor the set targets? (Please go into as much detail as possible)*</label>
        <textarea className="w-full border rounded px-3 py-2" value={form.monitorTargets} onChange={e => handleChange('monitorTargets', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">2.4.8) Is there a control process in place for project procurement and approval that checks if they are in line with the company's emission targets? Please explain. (If none, enter N/A)*</label>
        <textarea className="w-full border rounded px-3 py-2" value={form.projectControl} onChange={e => handleChange('projectControl', e.target.value)} required />
      </div>
      <div className="mb-6">
        <label className="block font-medium mb-1">2.4.9) If you have any details or comments about your organization's Governance and were not able to share it yet, please do so below.*</label>
        <textarea className="w-full border rounded px-3 py-2" value={form.comments} onChange={e => handleChange('comments', e.target.value)} required />
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-8">Submit</Button>
      </div>
    </form>
  );
};

export default Strategy; 