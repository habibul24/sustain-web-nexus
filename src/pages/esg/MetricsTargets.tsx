import React, { useState } from 'react';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';

const yesNo = ['Yes', 'No'];
const emissionStandards = [
  'ABI Energia Lipee Guida',
  'Act on the Rational Use of Energy',
  'American Petroleum Institute Compendium of Greenhouse Gas Emissions Methodologies for the Oil and Natural Gas Industry, 2009',
  'Australia - National Greenhouse and Energy Reporting Act',
  'Bilan Carbone',
  'Brazil GHG Protocol Programme',
  'Canadian Association of Petroleum Producers, Calculating Greenhouse Gas Emissions, 2003',
  'China Corporate Energy Conservation and GHG Management Programme',
  'Defra Environmental Reporting Guidelines: Including streamlined energy and carbon reporting guidance, 2019',
  'ENCORD: Construction CO2e Measurement Protocol',
  'Energy Information Administration 1605(b)',
  'Environment Canada, Sulphur hexafluoride (SF6) Emission Estimation and Reporting Protocol for Electric Utilities Environment Canada, Aluminium Production, Guidance Manual for Estimating Greenhouse Gas Emissions Environment Canada, Base Metals Smelting/Refining, Guidance Manual for Estimating Greenhouse Gas Emissions Environment Canada, Cement Production, Guidance Manual for Estimating Greenhouse Gas Emissions Environment Canada, Primary Iron and Steel Production, Guidance Manual for Estimating Greenhouse Gas Emissions Environment Canada, Lime Production, Guidance Manual for Estimating Greenhouse Gas Emissions Environment Canada, Primary Magnesium Production and Casting, Guidance Manual for Estimating Greenhouse Gas Emissions Environment Canada, Metal Mining, Guidance Manual for Estimating Greenhouse Gas Emissions',
  'EPRA (European Public Real Estate Association) guidelines, 2011',
  'EPRA (European Public Real Estate Association) Sustainability Best Practice Recommendations Guidelines, 2017',
  'European Union Emission Trading System (EU ETS): The Monitoring and Reporting Regulation (MMR) - General guidance for installations European Union Emissions Trading System (EU ETS): The Monitoring and Reporting Regulation (MMR) - General guidance for aircraft operators French methodology for greenhouse gas emissions assessments by companies V4 (ADEME 2016)',
  'Hong Kong Environmental Protection Department, guidelines to Account for and Report on Greenhouse Gas Emissions and Removals for Buildings, 2010 ICLEI Local Government GHG Protocol',
  'IEA CO2 Emissions from Fuel Combustion',
  'India GHG Inventory Programme',
  'International Wine Industry Greenhouse Gas Protocol and Accounting Tool',
  'IPCC Guidelines for National Greenhouse Gas Inventories, 2006',
  "PIECA's Petroleum Industry Guidelines for reporting GHG emissions, 2003",
  "IPIECA's Petroleum Industry Guidelines for reporting GHG emissions, 2nd edition, 2011",
  'ISO 14064-1',
  'Japan Ministry of the Environment, Law Concerning the Promotion of the Measures to Cope with Global Warming, Superseded by Revision of the Act on Promotion of Global Warming Countermeasures (2005 Amendment)',
  'Korea GHG and Energy Target Management System Operating Guidelines',
  'National Development and Reform Commission (NDRC) Guidance for Accounting and Reporting of GHG Emissions for Corporates (Trial) New Zealand - Guidance for Voluntary, Corporate Greenhouse Gas Reporting Philippine Greenhouse Gas Accounting and Reporting Programme (PUIGARe)',
  'Progruza GEI Mexico',
  'Recommendations for reporting significant indirect emissions under Article 173-IV (ADEME 2018)',
  'Regional Greenhouse Gas Initiative (RGGI) Model Rule',
  'Smart Freight Centre: GLEC Framework for Logistics Emissions Methodologies',
  'Taiwan - GHG Reduction Act',
  'Thailand Greenhouse Gas Management Organization: The National Guideline Carbon Footprint for organization The Climate Registry: Electric Power Sector (EPS) Protocol',
  'The Climate Registry: General Reporting Protocol',
  'The Climate Registry: Local Government Operations (LGO) Protocol',
  'The Climate Registry: Oil & Gas Protocol',
  'The Cool Farm Tool',
  'The GHG Indicator: UNEP Guidelines for Calculating Greenhouse Gas Emissions for Businesses and Non-Commercial Organizations',
  'The Greenhouse Gas Protocol: A Corporate Accounting and Reporting Standard (Revised Edition)',
  'The Greenhouse Gas Protocol Agricultural Guidance: Interpreting the Corporate Accounting and Reporting Standard for the Agricultural Sector The Greenhouse Gas Protocol: Public Sector Standard',
  'The Greenhouse Gas Protocol: Scope 2 Guidance',
  'The Tokyo Cap and Trade Program',
  'Leith carborreduce programme',
  'Toith carbonzers programme',
  'US EPA Center for Corporate Climate Leadership: Direct Fugitive Emissions from Refrigeration, Air Conditioning, Fire Suppression, and Industrial Gases US EPA Ceuter for Corporate Climate Leadership: Indirect Emissions Erom Events and Conferences US EPA Center for Corporate Climate Leadership: Indirect Emissions Erom Purchased Electricity US EPA Center for Corporate Climate Leadership: Direct Emissions from Stationary Combustion Sources US EPA Ceuter for Corporate Climate Leadership: Direct Emissions from Mobile Combustion Sources US EPA Mandatory Greenhouse Gas Reporting Rule',
  'VfU (Verein fur Umweltmanagement) Indicators Standard',
  'WBCSD: The Cement CO2 and Energy Protocol',
  'World Steel Association CO2 emissions data collection guidelines',
  'We do not have emissions to report',
];
const reportingDiscrepancy = ['Yes', 'No'];
const emissionChange = [
  'Increased',
  'Decreased',
  'Remained the same overall',
  'This is our first year of reporting, so we cannot compare to last year',
  "We don't have any emission data",
];
const emissionTarget = ['Absolute target', 'Intensity target', 'No target'];
const primaryReason = [
  'We are planning to introduce a target in the next two years',
  'Important but not an immediate business priority. Judged to be unimportant, explanation provided',
  'Lack of internal resources',
  'Insufficient data on operations',
  'No instruction from management',
  'Other, please specify',
];
const initiativeActive = ['Yes', 'No'];
const comparisonToPrevious = [
  'Much lower',
  'Lower',
  'About the same',
  'Higher',
  'Much higher',
  'This is our first year of measurement',
];
const goalLevel = [
  'Company-wide',
  'Business',
  'Business activity',
  'Site/facility',
  'Brand/product',
  'Country level',
  'Basin level',
  'Other, please specify',
];
const goalMotivation = [
  'Cost savings',
  'Increased revenue',
  'Sale of new products / services',
  'Reduced environmental impact',
  'Recommended sector best practice',
  'Risk mitigation',
  'Commitment to the UN Sustainable Development Goals',
  'Increasing freshwater availability for users/natural environment within the basin',
  'Corporate social responsibility',
  'Brand value',
  'Water stewardship',
  'Climate change adaptation and mitigation strategies',
  'Other, please specify',
];
const wasteMetrics = [
  'metric tons of waste diverted from landfill',
  'metric tons of waste recycled',
  'metric tons of waste reused',
  'metric tons of waste generated',
  'Percentage of total waste generated that is recycled; Percentage of sites operating at zero-waste to landfill',
  'Other, please specify',
];
const metricUsedForTargetSet = [
  'KWh', 'MWh', 'GJ', 'Btu', 'Boe', 'Other, please specify' // Placeholder, user will provide more options later
];

const MetricsTargets = () => {
  const [form, setForm] = useState({
    orgGHG: '',
    standard: [],
    emissionScope1: '',
    emissionScope2Loc: '',
    emissionScope2Mkt: '',
    emissionComment: '',
    reportingDiscrepancy: '',
    emissionChange: '',
    emissionTarget: '',
    primaryReason: '',
    initiativeActive: '',
    comparisonToPrevious: '',
    goalLevel: [],
    goalMotivation: [],
    goalOther: '',
    goalMotivationOther: '',
    goalDesc: '',
    baselineDate: '',
    startDate: '',
    endDate: '',
    goalProgress: '',
    wasteMetric: '',
    wasteInitiative: '',
    wasteInitiativeDesc: '',
    metricUsedForTargetSet: '',
    captivePowerGen: '',
    targetDesc: '',
    yearSet: '',
    baseYear: '',
    baseEmissions: '',
    targetYear: '',
    reductionPercent: '',
    targetEmissions: '',
    reportingEmissions: '',
    percentAchieved: '',
    scienceBased: '',
    targetExplanation: '',
    intensityTargetDesc: '',
    intensityYearSet: '',
    intensityMetric: '',
    intensityOther: '',
    intensityBaseYear: '',
    intensityBaseFigure: '',
    intensityTargetYear: '',
    intensityReductionPercent: '',
    intensityScienceBased: '',
    intensityExplanation: '',
    noTargetReason: '',
    noTargetExplanation: '',
    reductionInitiatives: '',
    waterWithdrawals: '',
    waterWithdrawalsComparison: '',
    waterWithdrawalsExplain: '',
    waterDischarges: '',
    waterDischargesComparison: '',
    waterDischargesExplain: '',
    waterConsumption: '',
    waterConsumptionComparison: '',
    waterConsumptionExplain: '',
    waterGoal: [],
    waterGoalOther: '',
    waterGoalLevel: [],
    waterGoalLevelOther: '',
    waterGoalMotivation: [],
    waterGoalMotivationOther: '',
    waterGoalDesc: '',
    waterGoalBaselineDate: '',
    waterGoalStartDate: '',
    waterGoalEndDate: '',
    waterGoalProgress: '',
    wasteTarget: [],
    wasteTargetOther: '',
    wasteMetricUsed: '',
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
      <h2 className="text-lg font-semibold mb-6">Part 4 - Metrics and Targets (Reported Emissions, Targets & Performance)</h2>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.1.1) Do you calculate your organization's GHG emissions?*</label>
        <select className="w-full border rounded px-3 py-2" value={form.orgGHG} onChange={e => handleChange('orgGHG', e.target.value)} required>
          <option value="">Select an option</option>
          {yesNo.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.1.2) If yes, can you name the standard, protocol, or methodology you have used to collect activity data and calculate emissions?*</label>
        <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto border rounded p-2">
          {emissionStandards.map(opt => (
            <label key={opt} className="flex items-center gap-2">
              <input type="checkbox" checked={form.standard.includes(opt)} onChange={() => handleCheckbox('standard', opt)} />
              {opt}
            </label>
          ))}
        </div>
      </div>
      <h3 className="text-md font-semibold mb-2 mt-6">What were your organization's gross global Scope 1 and 2 emissions in metric tons CO2e?</h3>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.2.1) Gross global Scope 1 emissions (metric tons CO2e): (a maximum of 3 decimal places and no commas.)*</label>
        <Input value={form.emissionScope1} onChange={e => handleChange('emissionScope1', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.2.2) Gross global Scope 2 emissions, Location based (metric tons CO2e): (a maximum of 3 decimal places and no commas.)*</label>
        <Input value={form.emissionScope2Loc} onChange={e => handleChange('emissionScope2Loc', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.2.3) Gross global Scope 2 emissions, Market based (metric tons CO2e): (a maximum of 3 decimal places and no commas.)*</label>
        <Input value={form.emissionScope2Mkt} onChange={e => handleChange('emissionScope2Mkt', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.2.4) If you have any additional comment or information you would like to share about your emissions please do so:*</label>
        <textarea className="w-full border rounded px-3 py-2" value={form.emissionComment} onChange={e => handleChange('emissionComment', e.target.value)} required />
      </div>
      <h3 className="text-md font-semibold mb-2 mt-6">4.3) Reporting and Disclosure Discrepancies</h3>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.3.1) Are there any sources (e.g. facilities, specific GHGs, activities, geographies, etc.) of Scope 1 and Scope 2 emissions that are within your selected reporting boundary which are not included in your disclosure?*</label>
        <select className="w-full border rounded px-3 py-2" value={form.reportingDiscrepancy} onChange={e => handleChange('reportingDiscrepancy', e.target.value)} required>
          <option value="">Select an option</option>
          {reportingDiscrepancy.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <div className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-3 text-sm">
          <strong>4.3.2) If yes, please use this Google Sheet to provide information of additional sources of Scope 1 and Scope 2 emissions in a separate table.</strong>
        </div>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.3.4) How do your gross global emissions (Scope 1 and 2 combined) for the reporting year compare to those of the previous reporting year?*</label>
        <select className="w-full border rounded px-3 py-2" value={form.emissionChange} onChange={e => handleChange('emissionChange', e.target.value)} required>
          <option value="">Select an option</option>
          {emissionChange.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <div className="w-full bg-gray-100 border border-gray-300 rounded px-4 py-3 text-sm">
          <strong>4.3.5) Use this Google Sheet to identify the reasons for any change in your gross global emissions (Scope 1 and 2 combined), and for each of them specify how your emissions compare to the previous year.</strong>
        </div>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.3.6) Did you have an emission target that was active in the reporting year?*</label>
        <select className="w-full border rounded px-3 py-2" value={form.emissionTarget} onChange={e => handleChange('emissionTarget', e.target.value)} required>
          <option value="">Select an option</option>
          {emissionTarget.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.3.7) Any captive power generation? (generation of electricity exceeding 1 MW for the purpose of consumption by the generator)*</label>
        <Input value={form.captivePowerGen || ''} onChange={e => handleChange('captivePowerGen', e.target.value)} required />
      </div>
      <div className="mb-8" />
      <h3 className="text-md font-semibold mb-2 mt-6">4.4) If you chose Absolute Target:</h3>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.4.1) Target description:*</label>
        <Input value={form.targetDesc || ''} onChange={e => handleChange('targetDesc', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.4.2) Year target was set: (a number between 1990-2022)*</label>
        <Input type="number" min="1990" max="2022" value={form.yearSet || ''} onChange={e => handleChange('yearSet', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.4.3) Base year: (a number between 1990-2022)*</label>
        <Input type="number" min="1990" max="2022" value={form.baseYear || ''} onChange={e => handleChange('baseYear', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.4.4) Covered emissions in base year (metric tons CO2e):*</label>
        <Input value={form.baseEmissions || ''} onChange={e => handleChange('baseEmissions', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.4.5) Target year: (a number between 1990-2022)*</label>
        <Input type="number" min="1990" max="2022" value={form.targetYear || ''} onChange={e => handleChange('targetYear', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.4.6) Target reduction from base year (%):*</label>
        <Input value={form.reductionPercent || ''} onChange={e => handleChange('reductionPercent', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.4.7) Covered emissions in target year (metric tons CO2e):*</label>
        <Input value={form.targetEmissions || ''} onChange={e => handleChange('targetEmissions', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.4.8) Covered emissions in reporting year (metric tons CO2e):*</label>
        <Input value={form.reportingEmissions || ''} onChange={e => handleChange('reportingEmissions', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.4.9) Percentage (%) of target achieved:*</label>
        <Input value={form.percentAchieved || ''} onChange={e => handleChange('percentAchieved', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.4.10) Is this a science based target?*</label>
        <select className="w-full border rounded px-3 py-2" value={form.scienceBased || ''} onChange={e => handleChange('scienceBased', e.target.value)} required>
          <option value="">Select an option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.4.11) Please provide any additional explanation (including target coverage):*</label>
        <textarea className="w-full border rounded px-3 py-2" value={form.targetExplanation || ''} onChange={e => handleChange('targetExplanation', e.target.value)} required />
      </div>
      <div className="mb-8" />
      <h3 className="text-md font-semibold mb-2 mt-6">4.5) If you chose Intensity Target:</h3>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.5.1) Target description:*</label>
        <Input value={form.intensityTargetDesc || ''} onChange={e => handleChange('intensityTargetDesc', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.5.2) Year target was set: (a number between 1990-2022)*</label>
        <Input type="number" min="1990" max="2022" value={form.intensityYearSet || ''} onChange={e => handleChange('intensityYearSet', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.5.3) Intensity Metric:*</label>
        <select className="w-full border rounded px-3 py-2" value={form.intensityMetric || ''} onChange={e => handleChange('intensityMetric', e.target.value)} required>
          <option value="">Select an option</option>
          <option value="CO2e per unit of production">CO2e per unit of production</option>
          <option value="CO2e per revenue">CO2e per revenue</option>
          <option value="CO2e per employee">CO2e per employee</option>
          <option value="Other">Other</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.5.4) If you chose 'Other' in the question above, please specify here*</label>
        <Input value={form.intensityOther || ''} onChange={e => handleChange('intensityOther', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.5.5) Base year: (a number between 1990-2022)*</label>
        <Input type="number" min="1990" max="2022" value={form.intensityBaseYear || ''} onChange={e => handleChange('intensityBaseYear', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.5.6) Intensity figure in base year (metric tons CO2e per unit of activity):*</label>
        <Input value={form.intensityBaseFigure || ''} onChange={e => handleChange('intensityBaseFigure', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.5.7) Target year: (a number between 1990-2022)*</label>
        <Input type="number" min="1990" max="2022" value={form.intensityTargetYear || ''} onChange={e => handleChange('intensityTargetYear', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.5.8) Target reduction from base year (%):*</label>
        <Input value={form.intensityReductionPercent || ''} onChange={e => handleChange('intensityReductionPercent', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.5.9) Is this a science based target?*</label>
        <select className="w-full border rounded px-3 py-2" value={form.intensityScienceBased || ''} onChange={e => handleChange('intensityScienceBased', e.target.value)} required>
          <option value="">Select an option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.5.10) Please provide any additional explanation (including target coverage):*</label>
        <textarea className="w-full border rounded px-3 py-2" value={form.intensityExplanation || ''} onChange={e => handleChange('intensityExplanation', e.target.value)} required />
      </div>
      <div className="mb-8" />
      <h3 className="text-md font-semibold mb-2 mt-6">4.6) If you chose 'No Target':</h3>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.6.1) Primary reason:*</label>
        <select className="w-full border rounded px-3 py-2" value={form.noTargetReason || ''} onChange={e => handleChange('noTargetReason', e.target.value)} required>
          <option value="">Select an option</option>
          <option value="We are planning to introduce a target in the next two years">We are planning to introduce a target in the next two years</option>
          <option value="Important but not an immediate business priority. Judged to be unimportant, explanation provided">Important but not an immediate business priority Judged to be unimportant, explanation provided</option>
          <option value="Lack of internal resources">Lack of internal resources</option>
          <option value="Insufficient data on operations">Insufficient data on operations</option>
          <option value="No instruction from management">No instruction from management</option>
          <option value="Other, please specify">Other, please specify</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.6.2) Please explain (use this space to be as detailed as possible)*</label>
        <textarea className="w-full border rounded px-3 py-2" value={form.noTargetExplanation || ''} onChange={e => handleChange('noTargetExplanation', e.target.value)} required />
      </div>
      <div className="mb-8" />
      <h3 className="text-md font-semibold mb-2 mt-6">4.7) Emission Reduction Initiatives</h3>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.7.1) Did you have emissions reduction initiatives that were active within the reporting year? Note that this can include those in the planning and/or implementation phases.*</label>
        <select className="w-full border rounded px-3 py-2" value={form.reductionInitiatives || ''} onChange={e => handleChange('reductionInitiatives', e.target.value)} required>
          <option value="">Select an option</option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </div>
      <div className="mb-8" />
      <h3 className="text-md font-semibold mb-2 mt-6">4.8) Water Consumption</h3>
      {/* 4.8.1-4.8.3: Withdrawals */}
      <div className="mb-4">
        <label className="block font-medium mb-1">4.8.1) Volume of Total withdrawals (megaliters/year)*</label>
        <Input value={form.waterWithdrawals || ''} onChange={e => handleChange('waterWithdrawals', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.8.2) Comparison to previous reporting year?*</label>
        <select className="w-full border rounded px-3 py-2" value={form.waterWithdrawalsComparison || ''} onChange={e => handleChange('waterWithdrawalsComparison', e.target.value)} required>
          <option value="">Select an option</option>
          <option>Much lower</option>
          <option>Lower</option>
          <option>About the same</option>
          <option>Higher</option>
          <option>Much higher</option>
          <option>This is our first year of measurement</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.8.3) Please explain any changes/ include any additional details you would like to share.*</label>
        <textarea className="w-full border rounded px-3 py-2" value={form.waterWithdrawalsExplain || ''} onChange={e => handleChange('waterWithdrawalsExplain', e.target.value)} required />
      </div>
      {/* 4.8.4-4.8.6: Discharges */}
      <div className="mb-4">
        <label className="block font-medium mb-1">4.8.4) Volume of Total discharges (megaliters/year)*</label>
        <Input value={form.waterDischarges || ''} onChange={e => handleChange('waterDischarges', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.8.5) Comparison to previous reporting year?*</label>
        <select className="w-full border rounded px-3 py-2" value={form.waterDischargesComparison || ''} onChange={e => handleChange('waterDischargesComparison', e.target.value)} required>
          <option value="">Select an option</option>
          <option>Much lower</option>
          <option>Lower</option>
          <option>About the same</option>
          <option>Higher</option>
          <option>Much higher</option>
          <option>This is our first year of measurement</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.8.6) Please explain any changes, please include any additional details you would like to share.*</label>
        <textarea className="w-full border rounded px-3 py-2" value={form.waterDischargesExplain || ''} onChange={e => handleChange('waterDischargesExplain', e.target.value)} required />
      </div>
      {/* 4.8.7-4.8.9: Consumption */}
      <div className="mb-4">
        <label className="block font-medium mb-1">4.8.7) Volume of Total consumption (megaliters/year)*</label>
        <Input value={form.waterConsumption || ''} onChange={e => handleChange('waterConsumption', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.8.8) Comparison to previous reporting year?*</label>
        <select className="w-full border rounded px-3 py-2" value={form.waterConsumptionComparison || ''} onChange={e => handleChange('waterConsumptionComparison', e.target.value)} required>
          <option value="">Select an option</option>
          <option>Much lower</option>
          <option>Lower</option>
          <option>About the same</option>
          <option>Higher</option>
          <option>Much higher</option>
          <option>This is our first year of measurement</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.8.9) Please explain any changes, please include any additional details you would like to share.*</label>
        <textarea className="w-full border rounded px-3 py-2" value={form.waterConsumptionExplain || ''} onChange={e => handleChange('waterConsumptionExplain', e.target.value)} required />
      </div>
      {/* 4.8.10 Provide details of your water goals below */}
      <h4 className="text-md font-semibold mb-2 mt-6">4.8.10) Provide details of your water goals below:</h4>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.8.11) Goal*</label>
        <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto border rounded p-2">
          {[
            'Providing access to safely managed Water, Sanitation and Hygiene (WASH) in workplace Providing access to safely managed Water, Sanitation and Hygiene (WASH) in local communities',
            'Engaging with local community',
            'Engaging with customers to help them minimize product impacts',
            'Engagement with public policy makers to advance sustainable water management and policies',
            'Engagement with suppliers to help them improve water stewardship',
            'Engagement with suppliers to reduce the water-related impact of supplied products',
            'Promotion of sustainable agriculture practices',
            'Watershed remediation and habitat restoration, ecosystem preservation',
            'Promotion of water data transparency',
            'Reduce environmental impact of product in use phase',
            'Improve wastewater quality beyond compliance requirements',
            'Other, please specify below',
          ].map(opt => (
            <label key={opt} className="flex items-center gap-2">
              <input type="checkbox" checked={form.waterGoal && form.waterGoal.includes(opt)} onChange={() => handleCheckbox('waterGoal', opt)} />
              {opt}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.8.11) If other, please specify here:*</label>
        <Input value={form.waterGoalOther || ''} onChange={e => handleChange('waterGoalOther', e.target.value)} required />
      </div>
      {/* 4.8.12 Goal level */}
      <div className="mb-4">
        <label className="block font-medium mb-1">4.8.12) Goal level</label>
        <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto border rounded p-2">
          {[
            'Company-wide',
            'Business',
            'Business activity',
            'Site/facility',
            'Brand/product',
            'Country level',
            'Basin level',
            'Other, please specify',
          ].map(opt => (
            <label key={opt} className="flex items-center gap-2">
              <input type="checkbox" checked={form.waterGoalLevel && form.waterGoalLevel.includes(opt)} onChange={() => handleCheckbox('waterGoalLevel', opt)} />
              {opt}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.8.13) If other, please specify here:*</label>
        <Input value={form.waterGoalLevelOther || ''} onChange={e => handleChange('waterGoalLevelOther', e.target.value)} required />
      </div>
      {/* 4.8.14 Motivation for this goal */}
      <div className="mb-4">
        <label className="block font-medium mb-1">4.8.14) Motivation for this goal:*</label>
        <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto border rounded p-2">
          {[
            'Cost savings',
            'Increased revenue',
            'Sales of new products / services',
            'Reduced environmental impact',
            'Recommended sector best practice',
            'Risk mitigation',
            'Commitment to the UN Sustainable Development Goals',
            'Increasing freshwater availability for users/natural environment within the basin',
            'Corporate social responsibility',
            'Shared value',
            'Water stewardship',
            'Climate change adaptation and mitigation strategies',
            'Other, please specify',
          ].map(opt => (
            <label key={opt} className="flex items-center gap-2">
              <input type="checkbox" checked={form.waterGoalMotivation && form.waterGoalMotivation.includes(opt)} onChange={() => handleCheckbox('waterGoalMotivation', opt)} />
              {opt}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.8.15) If other, please specify here:*</label>
        <Input value={form.waterGoalMotivationOther || ''} onChange={e => handleChange('waterGoalMotivationOther', e.target.value)} required />
      </div>
      {/* 4.8.16-4.8.20: Description, dates, progress */}
      <div className="mb-4">
        <label className="block font-medium mb-1">4.8.16) Description of goal:*</label>
        <textarea className="w-full border rounded px-3 py-2" value={form.waterGoalDesc || ''} onChange={e => handleChange('waterGoalDesc', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.8.17) Baseline date:*</label>
        <Input type="date" value={form.waterGoalBaselineDate || ''} onChange={e => handleChange('waterGoalBaselineDate', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.8.18) Start date:*</label>
        <Input type="date" value={form.waterGoalStartDate || ''} onChange={e => handleChange('waterGoalStartDate', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.8.19) End date:*</label>
        <Input type="date" value={form.waterGoalEndDate || ''} onChange={e => handleChange('waterGoalEndDate', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.8.20) Please outline the current progress of this goal:*</label>
        <textarea className="w-full border rounded px-3 py-2" value={form.waterGoalProgress || ''} onChange={e => handleChange('waterGoalProgress', e.target.value)} required />
      </div>
      <div className="mb-8" />
      <h3 className="text-md font-semibold mb-2 mt-6">4.9) Waste Disposal and Management</h3>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.9.1) Target(s) on waste disposal or management:*</label>
        <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto border rounded p-2">
          {[
            'metric tons of waste diverted from landfill',
            'metric tons of waste recycled',
            'metric tons of waste reused',
            'metric tons of waste generated',
            'Percentage of total waste generated that is recycled Percentage of sites operating at zero-waste to landfill',
          ].map(opt => (
            <label key={opt} className="flex items-center gap-2">
              <input type="checkbox" checked={form.wasteTarget && form.wasteTarget.includes(opt)} onChange={() => handleCheckbox('wasteTarget', opt)} />
              {opt}
            </label>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.9.2) If other, please specify below:*</label>
        <Input value={form.wasteTargetOther || ''} onChange={e => handleChange('wasteTargetOther', e.target.value)} required />
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.9.3) Metric used for target set:*</label>
        <select className="w-full border rounded px-3 py-2" value={form.wasteMetricUsed || ''} onChange={e => handleChange('wasteMetricUsed', e.target.value)} required>
          <option value="">Select an option</option>
          <option>KWh</option>
          <option>MWh</option>
          <option>GJ</option>
          <option>Btu</option>
          <option>Boe</option>
          <option>Other, please specify</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.9.4) Initiative implemented to achieve the target:*</label>
        <select className="w-full border rounded px-3 py-2" value={form.wasteInitiative || ''} onChange={e => handleChange('wasteInitiative', e.target.value)} required>
          <option value="">Select an option</option>
          <option>Energy efficiency in production processes</option>
          <option>Waste heat recovery</option>
          <option>Wastewater treatment</option>
          <option>Waste reduction and material circularity</option>
          <option>Waste reduction</option>
          <option>Product or service design</option>
          <option>Product/component/material reuse</option>
          <option>Product/component/material recycling</option>
          <option>Remanufacturing</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block font-medium mb-1">4.9.5) Description of initiatives implemented:*</label>
        <textarea className="w-full border rounded px-3 py-2" value={form.wasteInitiativeDesc || ''} onChange={e => handleChange('wasteInitiativeDesc', e.target.value)} required />
      </div>
      <div className="flex justify-end">
        <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white px-8">Submit</Button>
      </div>
    </form>
  );
};

export default MetricsTargets; 