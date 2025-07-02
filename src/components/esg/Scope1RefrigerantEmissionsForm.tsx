
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '../../hooks/use-toast';
import { supabase } from '../../integrations/supabase/client';
import { useAuthContext } from '../../contexts/AuthContext';

interface RefrigerantEmissionsData {
  id?: string;
  refrigerant_type: string;
  quantity_used: number | null;
  last_year_emission_figures: number | null;
  is_applicable: boolean;
}

interface Props {
  isApplicable: boolean;
  onApplicabilityChange: (applicable: boolean) => void;
}

const Scope1RefrigerantEmissionsForm: React.FC<Props> = ({ isApplicable, onApplicabilityChange }) => {
  const { user } = useAuthContext();
  const { toast } = useToast();
  
  const [data, setData] = useState<RefrigerantEmissionsData[]>([]);
  const [loading, setLoading] = useState(false);

  const refrigerantTypes = [
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
    'HFC-43-10mee'
  ];

  useEffect(() => {
    if (isApplicable && user) {
      fetchData();
    }
  }, [isApplicable, user]);

  const fetchData = async () => {
    try {
      const { data: existingData, error } = await supabase
        .from('refrigerant_emissions')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      if (existingData && existingData.length > 0) {
        setData(existingData.map(item => ({
          id: item.id,
          refrigerant_type: item.refrigerant_type,
          quantity_used: item.quantity_used,
          last_year_emission_figures: item.last_year_emission_figures,
          is_applicable: item.is_applicable
        })));
      } else {
        // Initialize with one empty row
        setData([{
          refrigerant_type: refrigerantTypes[0],
          quantity_used: null,
          last_year_emission_figures: null,
          is_applicable: true
        }]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (index: number, field: keyof RefrigerantEmissionsData, value: any) => {
    setData(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const addRow = () => {
    setData(prev => [...prev, {
      refrigerant_type: refrigerantTypes[0],
      quantity_used: null,
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
          .from('refrigerant_emissions')
          .delete()
          .eq('user_id', user.id);

        await supabase
          .from('refrigerant_emissions')
          .insert({
            user_id: user.id,
            refrigerant_type: 'N/A',
            quantity_used: 0,
            unit_of_measurement: 'kg',
            is_applicable: false
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
        .from('refrigerant_emissions')
        .delete()
        .eq('user_id', user.id);

      // Insert new records - emission factors will be set automatically by the database trigger
      const recordsToInsert = data
        .filter(item => item.quantity_used && item.quantity_used > 0)
        .map(item => ({
          user_id: user.id,
          refrigerant_type: item.refrigerant_type,
          quantity_used: item.quantity_used,
          last_year_emission_figures: item.last_year_emission_figures,
          unit_of_measurement: 'kg',
          is_applicable: true
        }));

      if (recordsToInsert.length > 0) {
        const { error } = await supabase
          .from('refrigerant_emissions')
          .insert(recordsToInsert);

        if (error) throw error;
      }

      toast({ title: 'Success!', description: 'Refrigerant emissions data saved successfully.' });
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
        <CardTitle>Scope 1d: Refrigerant Emissions</CardTitle>
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
              <RadioGroupItem value="yes" id="refrigerant-applicable-yes" />
              <Label htmlFor="refrigerant-applicable-yes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="refrigerant-applicable-no" />
              <Label htmlFor="refrigerant-applicable-no" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
        </div>

        {isApplicable && (
          <>
            <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
              <p><strong>Instructions:</strong></p>
              <p>Refrigerant emissions occur from air conditioning, refrigeration systems, and heat pumps. Include any refrigerant leaks, maintenance releases, or equipment disposal. Emission factors will be automatically applied based on the refrigerant type selected.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-3 font-semibold">Refrigerant Type</th>
                    <th className="py-2 px-3 font-semibold">Quantity Used/Lost (kg)</th>
                    <th className="py-2 px-3 font-semibold">Last Year Figures (kg)</th>
                    <th className="py-2 px-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-3">
                        <select
                          value={item.refrigerant_type}
                          onChange={(e) => handleInputChange(index, 'refrigerant_type', e.target.value)}
                          className="w-full p-2 border rounded"
                        >
                          {refrigerantTypes.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-2 px-3">
                        <Input
                          type="number"
                          value={item.quantity_used || ''}
                          onChange={(e) => handleInputChange(index, 'quantity_used', parseFloat(e.target.value) || null)}
                          placeholder="Quantity"
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
              Add Refrigerant
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

export default Scope1RefrigerantEmissionsForm;
