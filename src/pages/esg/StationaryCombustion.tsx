import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Switch } from '../../components/ui/switch';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Select } from '../../components/ui/select';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../components/ui/accordion';

const ENERGY_SOURCES = [
  { name: 'Diesel oil', unit: '' },
  { name: 'Kerosene', unit: '' },
  { name: 'Liquefied Petroleum Gas', unit: 'Kg' },
  { name: 'Charcoal', unit: '' },
  { name: 'Towngas', unit: 'Units' },
];

const UNITS = ['Kg', 'Litres', 'Units'];

const StationaryCombustion = () => {
  const navigate = useNavigate();
  const [hasMachinery, setHasMachinery] = useState(true);
  const [rows, setRows] = useState(
    ENERGY_SOURCES.map((src) => ({
      applicable: false,
      quantity: '',
      lastYear: '',
      unit: src.unit || '',
    }))
  );

  const handleRowChange = (idx, field, value) => {
    setRows((prev) => prev.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Scope 1: Direct GHG emissions from sources owned or controlled by company - Fuel and steam (stationary combustion)</h1>
      <p className="text-lg text-gray-700 mb-4">Does your company directly own or control any machinery or equipment that requires fossil fuels such as petrol, diesel, or gas to generate energy?</p>
      <div className="flex items-center gap-3 mb-6">
        <Switch checked={hasMachinery} onCheckedChange={setHasMachinery} />
        <span className="text-lg font-medium">{hasMachinery ? 'Yes' : 'No'}</span>
      </div>
      <Accordion type="single" collapsible defaultValue="instructions" className="mb-6">
        <AccordionItem value="instructions">
          <AccordionTrigger className="text-base font-semibold">Instructions</AccordionTrigger>
          <AccordionContent>
            <div className="text-gray-700">Please fill in the details for each energy source that applies to your business.</div>
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
            {ENERGY_SOURCES.map((src, idx) => (
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
                <td className="py-2 px-3">
                  <Select value={rows[idx].unit} onValueChange={v => handleRowChange(idx, 'unit', v)}>
                    <option value="">Select an option</option>
                    {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </Select>
                </td>
                <td className="py-2 px-3 text-green-600 font-semibold cursor-pointer">Connect</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-6">
        <Button className="bg-green-500 hover:bg-green-600 text-white px-8" onClick={() => navigate('/my-esg/environmental/scope-1/process-emissions')}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default StationaryCombustion; 