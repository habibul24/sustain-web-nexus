
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Switch } from '../../components/ui/switch';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../../components/ui/select';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../components/ui/accordion';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';

const VEHICLE_TYPES = [
  'Motorcycle - Unleaded petrol',
  'Passenger Car - Unleaded petrol',
  'Passenger Car - Diesel oil',
  'Private Van - Unleaded petrol',
  'Private Van - Diesel oil',
  'Private Van - Liquefied Petroleum Gas',
  'Public light bus - Unleaded petrol',
  'Public light bus - Diesel oil',
  'Public light bus - Liquefied Petroleum Gas',
  'Light Goods Vehicle - Unleaded petrol',
  'Light Goods Vehicle - Diesel oil',
  'Heavy goods vehicle - Diesel oil',
  'Medium goods vehicle - Diesel oil',
  'Ships - Gas Oil',
  'Aviation - Jet Kerosene',
  'Others - Unleaded petrol',
  'Others - Diesel oil',
  'Others - Liquefied Petroleum Gas',
  'Others - Kerosene',
];

const UNITS = ['Kg', 'Litres', 'Units'];

interface MobileCombustionData {
  id?: string;
  vehicle_no: string;
  vehicle_fuel_type: string;
  fuel_per_vehicle: string;
  last_year_emission_figures: string;
  unit_of_measurement: string;
}

const MobileCombustion = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hasTransport, setHasTransport] = useState(true);
  const [records, setRecords] = useState<MobileCombustionData[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [modalData, setModalData] = useState<MobileCombustionData>({
    vehicle_no: '',
    vehicle_fuel_type: '',
    fuel_per_vehicle: '',
    last_year_emission_figures: '',
    unit_of_measurement: '',
  });

  useEffect(() => {
    if (user) {
      loadExistingData();
    }
  }, [user]);

  const loadExistingData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mobile_combustion')
        .select('*')
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error loading mobile combustion data:', error);
        return;
      }

      if (data && data.length > 0) {
        const formattedRecords = data.map(record => ({
          id: record.id,
          vehicle_no: record.vehicle_no || '',
          vehicle_fuel_type: record.vehicle_fuel_type,
          fuel_per_vehicle: record.fuel_per_vehicle?.toString() || '',
          last_year_emission_figures: record.last_year_emission_figures?.toString() || '',
          unit_of_measurement: record.unit_of_measurement,
        }));
        setRecords(formattedRecords);
      }
    } catch (error) {
      console.error('Error loading mobile combustion data:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (index?: number) => {
    if (index !== undefined) {
      setEditingIndex(index);
      setModalData({ ...records[index] });
    } else {
      setEditingIndex(null);
      setModalData({
        vehicle_no: '',
        vehicle_fuel_type: '',
        fuel_per_vehicle: '',
        last_year_emission_figures: '',
        unit_of_measurement: '',
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingIndex(null);
  };

  const handleModalChange = (field: keyof MobileCombustionData, value: string) => {
    setModalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!modalData.vehicle_fuel_type || !modalData.fuel_per_vehicle || !modalData.unit_of_measurement) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!user) {
      toast.error('Please log in to save data');
      return;
    }

    try {
      setSaving(true);

      const saveData = {
        user_id: user.id,
        vehicle_no: modalData.vehicle_no || null,
        vehicle_fuel_type: modalData.vehicle_fuel_type,
        fuel_per_vehicle: parseFloat(modalData.fuel_per_vehicle),
        last_year_emission_figures: modalData.last_year_emission_figures ? parseFloat(modalData.last_year_emission_figures) : null,
        unit_of_measurement: modalData.unit_of_measurement,
      };

      if (editingIndex !== null && records[editingIndex].id) {
        // Update existing record
        const { error } = await supabase
          .from('mobile_combustion')
          .update(saveData)
          .eq('id', records[editingIndex].id);

        if (error) throw error;

        // Update local state
        const updatedRecords = [...records];
        updatedRecords[editingIndex] = { ...modalData, id: records[editingIndex].id };
        setRecords(updatedRecords);
      } else {
        // Insert new record
        const { data, error } = await supabase
          .from('mobile_combustion')
          .insert(saveData)
          .select()
          .single();

        if (error) throw error;

        // Add to local state
        const newRecord = {
          id: data.id,
          vehicle_no: data.vehicle_no || '',
          vehicle_fuel_type: data.vehicle_fuel_type,
          fuel_per_vehicle: data.fuel_per_vehicle?.toString() || '',
          last_year_emission_figures: data.last_year_emission_figures?.toString() || '',
          unit_of_measurement: data.unit_of_measurement,
        };

        if (editingIndex !== null) {
          const updatedRecords = [...records];
          updatedRecords[editingIndex] = newRecord;
          setRecords(updatedRecords);
        } else {
          setRecords(prev => [...prev, newRecord]);
        }
      }

      toast.success('Record saved successfully');
      setModalOpen(false);
      setEditingIndex(null);
    } catch (error) {
      console.error('Error saving mobile combustion record:', error);
      toast.error('Failed to save record');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (index: number) => {
    const record = records[index];
    if (!record.id) return;

    try {
      const { error } = await supabase
        .from('mobile_combustion')
        .delete()
        .eq('id', record.id);

      if (error) throw error;

      setRecords(prev => prev.filter((_, i) => i !== index));
      toast.success('Record deleted successfully');
    } catch (error) {
      console.error('Error deleting record:', error);
      toast.error('Failed to delete record');
    }
  };

  const handleNext = () => {
    navigate('/my-esg/environmental/scope-1/refrigerant-emissions');
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading data...</div>
        </div>
      </div>
    );
  }

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
          <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={() => openModal()}>Create record</Button>
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
              <th className="py-2 px-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">No Mobile Releases</td>
              </tr>
            ) : (
              records.map((rec, idx) => {
                const [vehicleType, fuelType] = rec.vehicle_fuel_type.split(' - ');
                return (
                  <tr key={idx} className="border-b">
                    <td className="py-2 px-3">
                      <Input value={rec.vehicle_no} readOnly className="w-28" />
                    </td>
                    <td className="py-2 px-3">{vehicleType}</td>
                    <td className="py-2 px-3">{fuelType}</td>
                    <td className="py-2 px-3">
                      <Input value={rec.fuel_per_vehicle} readOnly className="w-28" />
                    </td>
                    <td className="py-2 px-3">
                      <Input value={rec.last_year_emission_figures} readOnly className="w-28" />
                    </td>
                    <td className="py-2 px-3">{rec.unit_of_measurement}</td>
                    <td className="py-2 px-3">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openModal(idx)}
                          className="text-blue-600 font-semibold cursor-pointer hover:underline"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(idx)}
                          className="text-red-600 font-semibold cursor-pointer hover:underline"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-6">
        <Button className="bg-green-500 hover:bg-green-600 text-white px-8" onClick={handleNext}>
          Next
        </Button>
      </div>
      
      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-2xl" onClick={closeModal}>&times;</button>
            <h2 className="text-lg font-semibold mb-4">
              {editingIndex !== null ? 'Edit record' : 'Create record'}
            </h2>
            <form onSubmit={handleModalSubmit}>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Vehicle No (optional)</label>
                <Input
                  value={modalData.vehicle_no}
                  onChange={e => handleModalChange('vehicle_no', e.target.value)}
                  placeholder="Enter vehicle number"
                />
              </div>
              
              <div className="mb-4">
                <label className="block mb-2 font-medium">Vehicle fuel type *</label>
                <Select
                  value={modalData.vehicle_fuel_type}
                  onValueChange={v => handleModalChange('vehicle_fuel_type', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vehicle fuel type" />
                  </SelectTrigger>
                  <SelectContent>
                    {VEHICLE_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium">Fuel Per Vehicle Till Date *</label>
                <Input
                  type="number"
                  min="0"
                  step="0.0001"
                  value={modalData.fuel_per_vehicle}
                  onChange={e => handleModalChange('fuel_per_vehicle', e.target.value)}
                  placeholder="Enter fuel quantity"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2 font-medium">Last Year Emission Figures</label>
                <Input
                  type="number"
                  min="0"
                  step="0.0001"
                  value={modalData.last_year_emission_figures}
                  onChange={e => handleModalChange('last_year_emission_figures', e.target.value)}
                  placeholder="Enter last year emissions"
                />
              </div>

              <div className="mb-6">
                <label className="block mb-2 font-medium">Unit Of Measurement *</label>
                <Select
                  value={modalData.unit_of_measurement}
                  onValueChange={v => handleModalChange('unit_of_measurement', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map(unit => (
                      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  type="submit" 
                  className="bg-green-500 hover:bg-green-600 text-white"
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Submit'}
                </Button>
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
