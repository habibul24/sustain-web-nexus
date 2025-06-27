import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Switch } from '../../components/ui/switch';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../../components/ui/select';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../components/ui/accordion';

const CHEMICAL_SOURCES = [
  { name: 'Ammonia (NH3)' },
  { name: 'Methanol' },
  { name: 'Chlorine (Cl2)' },
  { name: 'Hydrochloric Acid (HCl)' },
  { name: 'Nitrogen (N2)' },
  { name: 'Ethylene (C2H4)' },
  { name: 'Sulfuric Acid (H2SO4)' },
  { name: 'Sodium Hydroxide (NaOH)' },
  { name: 'Propylene (C3H6)' },
  { name: 'Phosphoric Acid (H3PO4)' },
];

const UNITS = ['Kg', 'Litres', 'Units'];

const ProcessEmissions = () => {
  const navigate = useNavigate();
  const [usesChemicals, setUsesChemicals] = useState(true);
  const [rows, setRows] = useState(
    CHEMICAL_SOURCES.map((src) => ({
      applicable: false,
      quantity: '',
      lastYear: '',
      unit: '',
    }))
  );

  const handleRowChange = (idx, field, value) => {
    setRows((prev) => prev.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Activities related to physical or chemical processing within the Company premises (process emissions)</h1>
      <p className="text-lg text-gray-700 mb-4">Do you use chemicals in your company owned/controlled factory?</p>
      <div className="flex items-center gap-3 mb-6">
        <Switch checked={usesChemicals} onCheckedChange={setUsesChemicals} />
        <span className="text-lg font-medium">{usesChemicals ? 'Yes' : 'No'}</span>
      </div>
      <Accordion type="single" collapsible defaultValue="instructions" className="mb-6">
        <AccordionItem value="instructions">
          <AccordionTrigger className="text-base font-semibold">Instructions</AccordionTrigger>
          <AccordionContent>
            <div className="text-gray-700">Please fill in the details for each chemical source that applies to your business.</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-3 font-semibold">Source Of Energy</th>
              <th className="py-2 px-3 font-semibold">Quantity Used Till Date</th>
              <th className="py-2 px-3 font-semibold">Last Year Emission Figures</th>
              <th className="py-2 px-3 font-semibold">Unit Of Measurement</th>
              <th className="py-2 px-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {CHEMICAL_SOURCES.map((src, idx) => (
              <tr key={src.name} className="border-b">
                <td className="py-2 px-3">{src.name}</td>
                <td className="py-2 px-3">
                  <Input type="number" min="0" value={rows[idx].quantity} onChange={e => handleRowChange(idx, 'quantity', e.target.value)} className="w-28" />
                </td>
                <td className="py-2 px-3">
                  <Input type="number" min="0" value={rows[idx].lastYear} onChange={e => handleRowChange(idx, 'lastYear', e.target.value)} className="w-28" />
                </td>
                <td className="py-2 px-3">
                  <Select value={rows[idx].unit} onValueChange={v => handleRowChange(idx, 'unit', v)}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {UNITS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </td>
                <td className="py-2 px-3 text-green-600 font-semibold cursor-pointer">Connect</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-6">
        <Button className="bg-green-500 hover:bg-green-600 text-white px-8" onClick={() => navigate('/my-esg/environmental/scope-1/mobile-combustion')}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default ProcessEmissions; 