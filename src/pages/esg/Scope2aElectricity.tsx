
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Switch } from '../../components/ui/switch';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../components/ui/accordion';

const ELECTRICITY_SOURCES = [
  { name: 'Hong Kong Electric', unit: 'KWh' },
  { name: 'CLP Power Hong Kong Limited (CLP)', unit: 'KWh' },
  { name: 'Towngas', unit: 'units' },
];

const Scope2aElectricity = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState(
    ELECTRICITY_SOURCES.map((src) => ({
      applicable: false,
      quantity: '',
      lastYear: '',
    }))
  );

  const handleRowChange = (idx, field, value) => {
    setRows((prev) => prev.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">Scope 2a Electricity Carbon Emission Calculations</h1>
      <Accordion type="single" collapsible defaultValue="info" className="mb-6">
        <AccordionItem value="info">
          <AccordionTrigger className="text-base font-semibold">What are Scope 2a emissions?</AccordionTrigger>
          <AccordionContent>
            <div className="text-gray-700">
              Scope 2a emissions are GHG emissions from the generation of purchased electricity that is consumed in your Company's owned or controlled equipment. These emissions are considered indirect because they occur at the facility where the electricity is generated, but the energy produced is used by you.
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-3 font-semibold">Source Of Energy</th>
              <th className="py-2 px-3 font-semibold">Applicable To Business</th>
              <th className="py-2 px-3 font-semibold">Quantity Used Till Date</th>
              <th className="py-2 px-3 font-semibold">Last Year Emission Figures</th>
              <th className="py-2 px-3 font-semibold">Unit Of Measurement</th>
              <th className="py-2 px-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {ELECTRICITY_SOURCES.map((src, idx) => (
              <tr key={src.name} className="border-b">
                <td className="py-2 px-3">{src.name}</td>
                <td className="py-2 px-3">
                  <Switch checked={rows[idx].applicable} onCheckedChange={v => handleRowChange(idx, 'applicable', v)} />
                </td>
                <td className="py-2 px-3">
                  <Input type="number" min="0" value={rows[idx].quantity} onChange={e => handleRowChange(idx, 'quantity', e.target.value)} className="w-28" />
                </td>
                <td className="py-2 px-3">
                  <Input type="number" min="0" value={rows[idx].lastYear} onChange={e => handleRowChange(idx, 'lastYear', e.target.value)} className="w-28" />
                </td>
                <td className="py-2 px-3">{src.unit}</td>
                <td className="py-2 px-3 text-green-600 font-semibold cursor-pointer">Connect</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-6">
        <Button className="bg-green-500 hover:bg-green-600 text-white px-8" onClick={() => navigate('/my-esg/environmental/scope-2/other-energy')}>Next</Button>
      </div>
    </div>
  );
};

export default Scope2aElectricity;
