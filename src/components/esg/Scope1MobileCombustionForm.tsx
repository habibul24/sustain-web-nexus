
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '../../hooks/use-toast';
import { supabase } from '../../integrations/supabase/client';
import { useAuthContext } from '../../contexts/AuthContext';

interface MobileCombustionData {
  id?: string;
  vehicle_fuel_type: string;
  vehicle_no: string | null;
  fuel_per_vehicle: number | null;
  last_year_emission_figures: number | null;
  is_applicable: boolean;
}

interface Props {
  isApplicable: boolean;
  onApplicabilityChange: (applicable: boolean) => void;
}

const Scope1MobileCombustionForm: React.FC<Props> = ({ isApplicable, onApplicabilityChange }) => {
  const { user } = useAuthContext();
  const { toast } = useToast();
  
  const [data, setData] = useState<MobileCombustionData[]>([]);
  const [loading, setLoading] = useState(false);

  const vehicleTypes = [
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
    'Others - Kerosene'
  ];

  useEffect(() => {
    if (isApplicable && user) {
      fetchData();
    }
  }, [isApplicable, user]);

  const fetchData = async () => {
    try {
      const { data: existingData, error } = await supabase
        .from('mobile_combustion')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      if (existingData && existingData.length > 0) {
        setData(existingData.map(item => ({
          id: item.id,
          vehicle_fuel_type: item.vehicle_fuel_type,
          vehicle_no: item.vehicle_no,
          fuel_per_vehicle: item.fuel_per_vehicle,
          last_year_emission_figures: item.last_year_emission_figures,
          is_applicable: item.is_applicable
        })));
      } else {
        // Initialize with one empty row
        setData([{
          vehicle_fuel_type: vehicleTypes[0],
          vehicle_no: null,
          fuel_per_vehicle: null,
          last_year_emission_figures: null,
          is_applicable: true
        }]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (index: number, field: keyof MobileCombustionData, value: any) => {
    setData(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const addRow = () => {
    setData(prev => [...prev, {
      vehicle_fuel_type: vehicleTypes[0],
      vehicle_no: null,
      fuel_per_vehicle: null,
      last_year_emission_figures: null,
      is_applicable: true
    }]);
  };

  const removeRow = (index: number) => {
    if (data.length > 1) {
      setData(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleSave = async () => {
    if (!isApplicable) {
      // Save that it's not applicable
      try {
        await supabase
          .from('mobile_combustion')
          .delete()
          .eq('user_id', user.id);

        await supabase
          .from('mobile_combustion')
          .insert({
            user_id: user.id,
            vehicle_fuel_type: 'N/A',
            is_applicable: false,
            unit_of_measurement: 'L'
          });

        toast({ title: 'Success!', description: 'Data saved successfully.' });
      } catch (error) {
        console.error('Error saving data:', error);
        toast({ title: 'Error!', description: 'Failed to save data.', variant: 'destructive' });
      }
      return;
    }

    setLoading(true);
    try {
      // Delete existing records
      await supabase
        .from('mobile_combustion')
        .delete()
        .eq('user_id', user.id);

      // Insert new records
      const recordsToInsert = data
        .filter(item => item.fuel_per_vehicle && item.fuel_per_vehicle > 0)
        .map(item => ({
          user_id: user.id,
          vehicle_fuel_type: item.vehicle_fuel_type,
          vehicle_no: item.vehicle_no,
          fuel_per_vehicle: item.fuel_per_vehicle,
          last_year_emission_figures: item.last_year_emission_figures,
          unit_of_measurement: 'L',
          is_applicable: true
        }));

      if (recordsToInsert.length > 0) {
        const { error } = await supabase
          .from('mobile_combustion')
          .insert(recordsToInsert);

        if (error) throw error;
      }

      toast({ title: 'Success!', description: 'Mobile combustion data saved successfully.' });
    } catch (error) {
      console.error('Error saving data:', error);
      toast({ title: 'Error!', description: 'Failed to save data.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scope 1b: Mobile Combustion</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label>Is this emission source applicable to your organization?</Label>
          <RadioGroup 
            value={isApplicable ? 'yes' : 'no'} 
            onValueChange={(value) => onApplicabilityChange(value === 'yes')}
            className="flex flex-row gap-6 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="mobile-applicable-yes" />
              <Label htmlFor="mobile-applicable-yes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="mobile-applicable-no" />
              <Label htmlFor="mobile-applicable-no" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
        </div>

        {isApplicable && (
          <>
            <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
              <p><strong>Instructions:</strong></p>
              <p>Please provide details for each vehicle or mobile equipment used by your organization. Include fuel consumption data for accurate emissions calculation.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-3 font-semibold">Vehicle/Equipment Type</th>
                    <th className="py-2 px-3 font-semibold">Vehicle No.</th>
                    <th className="py-2 px-3 font-semibold">Fuel Used (L)</th>
                    <th className="py-2 px-3 font-semibold">Last Year Figures (L)</th>
                    <th className="py-2 px-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-3">
                        <select
                          value={item.vehicle_fuel_type}
                          onChange={(e) => handleInputChange(index, 'vehicle_fuel_type', e.target.value)}
                          className="w-full p-2 border rounded"
                        >
                          {vehicleTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-3">
                        <Input
                          type="text"
                          value={item.vehicle_no || ''}
                          onChange={(e) => handleInputChange(index, 'vehicle_no', e.target.value)}
                          placeholder="Vehicle number"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <Input
                          type="number"
                          value={item.fuel_per_vehicle || ''}
                          onChange={(e) => handleInputChange(index, 'fuel_per_vehicle', parseFloat(e.target.value) || null)}
                          placeholder="Fuel quantity"
                          step="0.01"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <Input
                          type="number"
                          value={item.last_year_emission_figures || ''}
                          onChange={(e) => handleInputChange(index, 'last_year_emission_figures', parseFloat(e.target.value) || null)}
                          placeholder="Last year figures"
                          step="0.01"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => removeRow(index)}
                          disabled={data.length === 1}
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Button onClick={addRow} variant="outline">
              Add Vehicle/Equipment
            </Button>
          </>
        )}

        <div className="flex justify-end">
          <Button 
            onClick={handleSave} 
            disabled={loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? 'Saving...' : 'Save Data'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default Scope1MobileCombustionForm;
