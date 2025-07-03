import React, { useState } from 'react';

const industryOptions = [
  'Apparel',
  'BioTech, healthcare & pharma',
  'Food, Beverage & Agriculture',
  'Fossil Fuels',
  'Hospitality',
  'Infrastructure',
  'International Bodies',
  'Manufacturing',
  'Materials',
  'Power Generation',
  'Retail',
  'Services',
  'Transportation Services',
  'Other',
];
const legalStructureOptions = [
  'Sole Proprietorship',
  'Partnership',
  'Publicly Listed Corporation',
  'Nonprofit organization',
  'Private Limited Company',
  'Other',
];
const officeOptions = [
  'Above 20',
  '11 - 20',
  '6- 10',
  '2 - 5',
  '1',
];
const productOptions = [
  'Physical products',
  'Services',
  'Digital products',
  'Others',
];
const softwareOptions = [
  'Finance',
  'Procurement',
  'Warehouse',
  'Logistics',
];
const documentOptions = [
  'Incorporation Documents',
  'Sustainability Policy',
  'Statement of commitment to sustainability',
  'Environmental Management Policy & system',
  'Previous Sustainability report',
  'Employee Code of Conduct/ Staff Handbook',
  'Suppliers code of conduct & terms of agreement',
  'Product safety & Quality Assurance Policy',
  'HSE policy',
  'Data Privacy & Cybersecurity Policy',
  'Anti-bribery policy',
  'Option 12',
  'None of the above',
];

const ConsultationForm = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    companyName: '',
    description: '',
    industries: [],
    legalStructure: '',
    firstTimeReporting: '',
    periodEndDate: '',
    employeeCount: '',
    officeCount: '',
    products: [],
    software: [],
    documents: [],
    customerESG: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      setForm((prev) => ({
        ...prev,
        [name]: prev[name].includes(value)
          ? prev[name].filter((v) => v !== value)
          : [...prev[name], value],
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1">
        <section className="py-16">
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">Client Onboarding Questionnaire</h1>
            <div className="text-center mb-8 p-6 bg-green-50 rounded-lg border border-green-200">
              <h2 className="text-xl font-semibold text-[#183a1d] mb-2">Welcome to GreenData! 🌱</h2>
              <p className="text-[#29443e]">Thank you for your interest in our sustainability and ESG services. This questionnaire helps us understand your organization better and provide you with the most relevant solutions. Please take a moment to fill out the following information.</p>
            </div>
            <form className="space-y-8">
              {/* 0. Full Name */}
              <div>
                <label className="block font-medium mb-2">Full Name<span className="text-red-500">*</span></label>
                <input type="text" name="fullName" value={form.fullName} onChange={handleChange} required className="w-full border rounded px-4 py-2" />
              </div>
              {/* 1. Email */}
              <div>
                <label className="block font-medium mb-2">Email<span className="text-red-500">*</span></label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border rounded px-4 py-2" />
              </div>
              {/* 2. Registered Company Name */}
              <div>
                <label className="block font-medium mb-2">Registered Company Name (Full legal name)<span className="text-red-500">*</span></label>
                <input type="text" name="companyName" value={form.companyName} onChange={handleChange} required className="w-full border rounded px-4 py-2" />
              </div>
              {/* 3. Description */}
              <div>
                <label className="block font-medium mb-2">Give a general description and introduction to your organization (what products/services do you sell)<span className="text-red-500">*</span></label>
                <textarea name="description" value={form.description} onChange={handleChange} required className="w-full border rounded px-4 py-2" rows={3} />
              </div>
              {/* 4. Industries */}
              <div>
                <label className="block font-medium mb-2">Select the industry/industries that your organization belongs to.<span className="text-red-500">*</span></label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {industryOptions.map((opt) => (
                    <label key={opt} className="flex items-center gap-2">
                      <input type="checkbox" name="industries" value={opt} checked={form.industries.includes(opt)} onChange={handleChange} />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              {/* 5. Legal Structure */}
              <div>
                <label className="block font-medium mb-2">What is your company's legal structure?<span className="text-red-500">*</span></label>
                <select name="legalStructure" value={form.legalStructure} onChange={handleChange} required className="w-full border rounded px-4 py-2">
                  <option value="">Select...</option>
                  {legalStructureOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              {/* 6. First time reporting */}
              <div>
                <label className="block font-medium mb-2">Is this your first time reporting?<span className="text-red-500">*</span></label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="firstTimeReporting" value="Yes" checked={form.firstTimeReporting === 'Yes'} onChange={handleChange} /> Yes
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="firstTimeReporting" value="No" checked={form.firstTimeReporting === 'No'} onChange={handleChange} /> No
                  </label>
                </div>
              </div>
              {/* 7. End date of period */}
              <div>
                <label className="block font-medium mb-2">State the end date of the twelve-month period for which you are reporting data.<span className="text-red-500">*</span></label>
                <input type="date" name="periodEndDate" value={form.periodEndDate} onChange={handleChange} required className="w-full border rounded px-4 py-2" />
              </div>
              {/* 8. Employee count */}
              <div>
                <label className="block font-medium mb-2">What is the total number of employees in your organization, based on staff headcount.<span className="text-red-500">*</span></label>
                <input type="number" name="employeeCount" value={form.employeeCount} onChange={handleChange} required className="w-full border rounded px-4 py-2" min={1} />
              </div>
              {/* 9. Office count */}
              <div>
                <label className="block font-medium mb-2">How many offices or locations does your company have?<span className="text-red-500">*</span></label>
                <select name="officeCount" value={form.officeCount} onChange={handleChange} required className="w-full border rounded px-4 py-2">
                  <option value="">Select...</option>
                  {officeOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>
              {/* 10. Products */}
              <div>
                <label className="block font-medium mb-2">Select all the products of the company<span className="text-red-500">*</span></label>
                <div className="flex flex-wrap gap-4">
                  {productOptions.map((opt) => (
                    <label key={opt} className="flex items-center gap-2">
                      <input type="checkbox" name="products" value={opt} checked={form.products.includes(opt)} onChange={handleChange} />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              {/* 11. Software usage */}
              <div>
                <label className="block font-medium mb-2">Does your company use software in all their operations in finance, warehouse, procurement, logistics, select all that apply</label>
                <div className="flex flex-wrap gap-4">
                  {softwareOptions.map((opt) => (
                    <label key={opt} className="flex items-center gap-2">
                      <input type="checkbox" name="software" value={opt} checked={form.software.includes(opt)} onChange={handleChange} />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              {/* 12. Documents */}
              <div>
                <label className="block font-medium mb-2">Select all the documents you have (in documented form)</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {documentOptions.map((opt) => (
                    <label key={opt} className="flex items-center gap-2">
                      <input type="checkbox" name="documents" value={opt} checked={form.documents.includes(opt)} onChange={handleChange} />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>
              {/* 13. Customer ESG */}
              <div>
                <label className="block font-medium mb-2">Has your customer asked you to sign or complete an ESG document<span className="text-red-500">*</span></label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2">
                    <input type="radio" name="customerESG" value="Yes" checked={form.customerESG === 'Yes'} onChange={handleChange} /> Yes
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="customerESG" value="No" checked={form.customerESG === 'No'} onChange={handleChange} /> No
                  </label>
                </div>
              </div>
              {/* Submit button (no logic yet) */}
              <div className="pt-4">
                <button type="button" className="btn-orange-gradient px-8 py-3 rounded font-semibold text-white shadow">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default ConsultationForm; 