import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Switch } from '../../components/ui/switch';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Select } from '../../components/ui/select';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../components/ui/accordion';

const VEHICLE_TYPES = [
  'Motorcycle - Unleaded petrol',
  'Passenger Car - Unleaded petrol',
  'Passenger Car - Diesel Oil',
  'Private Van - Unleaded petrol',
  'Private Van - Diesel Oil',
  'Private Van - Liquefied Petroleum Gas',
  'Public light bus - Diesel Oil',
  'Light Goods Vehicle - Unleaded petrol',
  'Heavy goods vehicle - Diesel oil',
  'Ships - Gas Oil',
  'Aviation - Jet Kerosene',
  'Others - Diesel Oil',
];

const defaultRecord = {
  vehicleNo: '',
  vehicleType: '',
  fuelType: '',
  fuelPerVehicle: '',
  lastYear: '',
  unit: 'litres',
};

const MobileCombustion = () => {
  const navigate = useNavigate();
  const [hasTransport, setHasTransport] = useState(true);
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
    if (!modalData.vehicleType) return;
    setRecords((prev) => [
      ...prev,
      {
        ...modalData,
        vehicleType: modalData.vehicleType.split(' - ')[0],
        fuelType: modalData.vehicleType.split(' - ')[1] || '',
      },
    ]);
    setModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Activities related to transportation using Company owned cars, airplanes, trucks, buses or other means of transportation (Mobile Combustion)</h1>
      <p className="text-lg text-gray-700 mb-4">Does your Company own any cars, trucks, buses or means of transportation?</p>
      <div className="flex items-center gap-3 mb-6">
        <Switch checked={hasTransport} onCheckedChange={setHasTransport} />
        <span className="text-lg font-medium">{hasTransport ? 'Yes' : 'No'}</span>
      </div>
      <Accordion type="single" collapsible className="mb-6">
        <AccordionItem value="instructions">
          <AccordionTrigger className="text-base font-semibold">Instructions</AccordionTrigger>
          <AccordionContent>
            <div className="text-gray-700">Please fill in the details for each vehicle that applies to your business.</div>
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
              <th className="py-2 px-3 font-semibold">Vehicle No</th>
              <th className="py-2 px-3 font-semibold">Vehicle Type</th>
              <th className="py-2 px-3 font-semibold">Fuel Type</th>
              <th className="py-2 px-3 font-semibold">Fuel Per Vehicle Till Date</th>
              <th className="py-2 px-3 font-semibold">Last Year Emission Figures</th>
              <th className="py-2 px-3 font-semibold">Unit Of Measurement</th>
              <th className="py-2 px-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">No Mobile Releases</td>
              </tr>
            ) : (
              records.map((rec, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-2 px-3">
                    <Input value={rec.vehicleNo} readOnly className="w-28" />
                  </td>
                  <td className="py-2 px-3">{rec.vehicleType}</td>
                  <td className="py-2 px-3">{rec.fuelType}</td>
                  <td className="py-2 px-3">
                    <Input value={rec.fuelPerVehicle} readOnly className="w-28" />
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
        <Button className="bg-green-500 hover:bg-green-600 text-white px-8" onClick={() => navigate('/my-esg/environmental/scope-1/refrigerant-emissions')}>
          Next
        </Button>
      </div>
      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-2xl" onClick={closeModal}>&times;</button>
            <h2 className="text-lg font-semibold mb-4">Create record</h2>
            <form onSubmit={handleModalSubmit}>
              <div className="mb-6">
                <label className="block mb-2 font-medium">Vehicle fuel type</label>
                <select
                  className="w-full border rounded px-3 py-2"
                  value={modalData.vehicleType}
                  onChange={e => handleModalChange('vehicleType', e.target.value)}
                  required
                >
                  <option value="">Select an option</option>
                  {VEHICLE_TYPES.map((v) => (
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

export default MobileCombustion; 