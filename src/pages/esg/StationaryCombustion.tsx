
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

const ENERGY_SOURCES = [
  { name: 'Diesel oil', unit: '' },
  { name: 'Kerosene', unit: '' },
  { name: 'Liquefied Petroleum Gas', unit: 'Kg' },
  { name: 'Charcoal', unit: '' },
  { name: 'Towngas', unit: 'Units' },
];

const UNITS = ['Kg', 'Litres', 'Units'];

interface StationaryCombustionData {
  id?: string;
  source_of_energy: string;
  quantity_used: string;
  last_year_emission_figures: string;
  unit_of_measurement: string;
  is_applicable: boolean;
}

const StationaryCombustion = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hasMachinery, setHasMachinery] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [rows, setRows] = useState<StationaryCombustionData[]>(
    ENERGY_SOURCES.map((src) => ({
      source_of_energy: src.name,
      quantity_used: '',
      last_year_emission_figures: '',
      unit_of_measurement: '',
      is_applicable: false,
    }))
  );

  useEffect(() => {
    if (user) {
      loadExistingData();
    }
  }, [user]);

  const loadExistingData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('stationary_combustion')
        .select('*')
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error loading data:', error);
        return;
      }

      if (data && data.length > 0) {
        const updatedRows = ENERGY_SOURCES.map((src) => {
          const existingData = data.find(d => d.source_of_energy === src.name);
          return existingData ? {
            id: existingData.id,
            source_of_energy: src.name,
            quantity_used: existingData.quantity_used?.toString() || '',
            last_year_emission_figures: existingData.last_year_emission_figures?.toString() || '',
            unit_of_measurement: existingData.unit_of_measurement || '',
            is_applicable: existingData.is_applicable || false,
          } : {
            source_of_energy: src.name,
            quantity_used: '',
            last_year_emission_figures: '',
            unit_of_measurement: '',
            is_applicable: false,
          };
        });
        setRows(updatedRows);
      }
    } catch (error) {
      console.error('Error loading stationary combustion data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowChange = (idx: number, field: keyof StationaryCombustionData, value: string | boolean) => {
    setRows((prev) => prev.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  };

  const saveData = async () => {
    if (!user) {
      toast.error('Please log in to save data');
      return;
    }

    try {
      setSaving(true);
      
      // Filter rows that have data
      const dataToSave = rows.filter(row => 
        row.quantity_used || row.last_year_emission_figures || row.unit_of_measurement
      );

      if (dataToSave.length === 0) {
        toast.error('Please enter some data before saving');
        return;
      }

      // Validate required fields
      const invalidRows = dataToSave.filter(row => 
        !row.quantity_used || !row.unit_of_measurement
      );

      if (invalidRows.length > 0) {
        toast.error('Please fill in quantity and unit for all applicable sources');
        return;
      }

      for (const row of dataToSave) {
        const saveData = {
          user_id: user.id,
          source_of_energy: row.source_of_energy,
          quantity_used: parseFloat(row.quantity_used),
          last_year_emission_figures: row.last_year_emission_figures ? parseFloat(row.last_year_emission_figures) : null,
          unit_of_measurement: row.unit_of_measurement,
          is_applicable: true,
        };

        if (row.id) {
          // Update existing record
          const { error } = await supabase
            .from('stationary_combustion')
            .update(saveData)
            .eq('id', row.id);

          if (error) throw error;
        } else {
          // Insert new record
          const { error } = await supabase
            .from('stationary_combustion')
            .insert(saveData);

          if (error) throw error;
        }
      }

      toast.success('Data saved successfully');
      await loadExistingData(); // Reload to get updated data with IDs
    } catch (error) {
      console.error('Error saving data:', error);
      toast.error('Failed to save data');
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    await saveData();
    navigate('/my-esg/environmental/scope-1/process-emissions');
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
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.0001"
                    value={rows[idx].quantity_used} 
                    onChange={e => handleRowChange(idx, 'quantity_used', e.target.value)} 
                    className="w-28" 
                  />
                </td>
                <td className="py-2 px-3">
                  <Input 
                    type="number" 
                    min="0" 
                    step="0.0001"
                    value={rows[idx].last_year_emission_figures} 
                    onChange={e => handleRowChange(idx, 'last_year_emission_figures', e.target.value)} 
                    className="w-28" 
                  />
                </td>
                <td className="py-2 px-3">
                  <Select 
                    value={rows[idx].unit_of_measurement} 
                    onValueChange={v => handleRowChange(idx, 'unit_of_measurement', v)}
                  >
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
      <div className="flex justify-between mt-6">
        <Button 
          variant="outline"
          onClick={saveData}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Data'}
        </Button>
        <Button 
          className="bg-green-500 hover:bg-green-600 text-white px-8" 
          onClick={handleNext}
          disabled={saving}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default StationaryCombustion;
