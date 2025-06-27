import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Switch } from '../../components/ui/switch';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../components/ui/accordion';

const REFRIGERANT_TYPES = [
  'R-401A',
  'R-401B',
  'R-401C',
  'R-402A',
  'R-402B',
  'R-403B',
  'R-404A',
  'R-406A',
  'R-407A',
  'R-407B',
  'R-407C',
  'R-407D',
  'R-408A',
  'R-409A',
  'R-410A',
  'R-410B',
  'R-411A',
  'R-411B',
  'R-414A',
  'R-414B',
  'R-417A',
  'R-422A',
  'R-422D',
  'R-424A',
  'R-426A',
  'R-428A',
  'R-434A',
  'R-507A',
  'R-508A',
  'R-508B',
  'HFC-23',
  'HFC-32',
  'HFC-41',
  'HFC-125',
  'HFC-134',
  'HFC-134a',
  'HFC-143',
  'HFC-143a',
  'HFC-152',
  'HFC-152a',
  'HFC-161',
  'HFC-227ea',
  'HFC-236cb',
  'HFC-236ea',
  'HFC-236fa',
  'HFC-245ca',
  'HFC-245fa',
  'HFC-365mfc',
  'HFC-43-10mee',
];

const defaultRecord = {
  refrigerantType: '',
  quantity: '',
  lastYear: '',
  unit: 'kg',
};

const RefrigerantEmissions = () => {
  const navigate = useNavigate();
  const [hasRefrigerant, setHasRefrigerant] = useState(true);
  const [records, setRecords] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ ...defaultRecord });

  const openModal = () => {
    setModalData({ ...defaultRecord });
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const handleModalChange = (field, value) => {
    setModalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (!modalData.refrigerantType) return;
    setRecords((prev) => [
      ...prev,
      { ...modalData },
    ]);
    setModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Refrigerant Releases from Air-conditioning and Refrigeration Equipment</h1>
      <p className="text-lg text-gray-700 mb-4">Does your Company use any refrigerants in air-conditioning or refrigeration equipment?</p>
      <div className="flex items-center gap-3 mb-6">
        <Switch checked={hasRefrigerant} onCheckedChange={setHasRefrigerant} />
        <span className="text-lg font-medium">{hasRefrigerant ? 'Yes' : 'No'}</span>
      </div>
      <Accordion type="single" collapsible className="mb-6">
        <AccordionItem value="instructions">
          <AccordionTrigger className="text-base font-semibold">Instructions</AccordionTrigger>
          <AccordionContent>
            <div className="text-gray-700">Please fill in the details for each refrigerant that applies to your business.</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <div className="flex justify-end mb-2">
          <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={openModal}>Create record</Button>
        </div>
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-3 font-semibold">Refrigerant Type</th>
              <th className="py-2 px-3 font-semibold">Quantity Used Till Date</th>
              <th className="py-2 px-3 font-semibold">Last Year Emission Figures</th>
              <th className="py-2 px-3 font-semibold">Unit Of Measurement</th>
              <th className="py-2 px-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">No Refrigerant Releases</td>
              </tr>
            ) : (
              records.map((rec, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-2 px-3">{rec.refrigerantType}</td>
                  <td className="py-2 px-3">
                    <Input value={rec.quantity} readOnly className="w-28" />
                  </td>
                  <td className="py-2 px-3">
                    <Input value={rec.lastYear} readOnly className="w-28" />
                  </td>
                  <td className="py-2 px-3">{rec.unit}</td>
                  <td className="py-2 px-3 text-green-600 font-semibold cursor-pointer">Connect</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-6">
        <Button className="bg-green-500 hover:bg-green-600 text-white px-8" onClick={() => navigate('/my-esg/environmental/scope-1-result')}>Next</Button>
      </div>
      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-2xl" onClick={closeModal}>&times;</button>
            <h2 className="text-lg font-semibold mb-4">Create record</h2>
            <form onSubmit={handleModalSubmit}>
              <div className="mb-6">
                <label className="block mb-2 font-medium">Refrigerant type</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={modalData.refrigerantType}
                  onChange={e => handleModalChange('refrigerantType', e.target.value)}
                  required
                >
                  <option value="">Select an option</option>
                  {REFRIGERANT_TYPES.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">Submit</Button>
                <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefrigerantEmissions; 