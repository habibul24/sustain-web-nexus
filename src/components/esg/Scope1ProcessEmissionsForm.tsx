
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '../../hooks/use-toast';
import { supabase } from '../../integrations/supabase/client';
import { useAuthContext } from '../../contexts/AuthContext';

interface ProcessEmissionsData {
  id?: string;
  source_of_energy: string;
  quantity_used: number | null;
  last_year_emission_figures: number | null;
  is_applicable: boolean;
}

interface Props {
  isApplicable: boolean;
  onApplicabilityChange: (applicable: boolean) => void;
}

const Scope1ProcessEmissionsForm: React.FC<Props> = ({ isApplicable, onApplicabilityChange }) => {
  const { user } = useAuthContext();
  const { toast } = useToast();
  
  const [data, setData] = useState<ProcessEmissionsData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isApplicable && user) {
      fetchData();
    }
  }, [isApplicable, user]);

  const fetchData = async () => {
    try {
      const { data: existingData, error } = await supabase
        .from('process_emissions')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      if (existingData && existingData.length > 0) {
        setData(existingData.map(item => ({
          id: item.id,
          source_of_energy: item.source_of_energy,
          quantity_used: item.quantity_used,
          last_year_emission_figures: item.last_year_emission_figures,
          is_applicable: item.is_applicable
        })));
      } else {
        // Initialize with one empty row
        setData([{
          source_of_energy: '',
          quantity_used: null,
          last_year_emission_figures: null,
          is_applicable: true
        }]);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (index: number, field: keyof ProcessEmissionsData, value: any) => {
    setData(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const addRow = () => {
    setData(prev => [...prev, {
      source_of_energy: '',
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
          .from('process_emissions')
          .delete()
          .eq('user_id', user.id);

        await supabase
          .from('process_emissions')
          .insert({
            user_id: user.id,
            source_of_energy: 'N/A',
            is_applicable: false,
            unit_of_measurement: 'kg'
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
        .from('process_emissions')
        .delete()
        .eq('user_id', user.id);

      // Insert new records
      const recordsToInsert = data
        .filter(item => item.source_of_energy && item.quantity_used && item.quantity_used > 0)
        .map(item => ({
          user_id: user.id,
          source_of_energy: item.source_of_energy,
          quantity_used: item.quantity_used,
          last_year_emission_figures: item.last_year_emission_figures,
          unit_of_measurement: 'kg',
          is_applicable: true
        }));

      if (recordsToInsert.length > 0) {
        const { error } = await supabase
          .from('process_emissions')
          .insert(recordsToInsert);

        if (error) throw error;
      }

      toast({ title: 'Success!', description: 'Process emissions data saved successfully.' });
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
        <CardTitle>Scope 1c: Process Emissions</CardTitle>
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
              <RadioGroupItem value="yes" id="process-applicable-yes" />
              <Label htmlFor="process-applicable-yes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="process-applicable-no" />
              <Label htmlFor="process-applicable-no" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
        </div>

        {isApplicable && (
          <>
            <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
              <p><strong>Instructions:</strong></p>
              <p>Process emissions occur from industrial processes that chemically or physically transform materials. Examples include cement production, steel making, or chemical processes that release CO₂, CH₄, or N₂O.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-3 font-semibold">Process/Source</th>
                    <th className="py-2 px-3 font-semibold">Quantity (kg)</th>
                    <th className="py-2 px-3 font-semibold">Last Year Figures (kg)</th>
                    <th className="py-2 px-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-2 px-3">
                        <Input
                          type="text"
                          value={item.source_of_energy || ''}
                          onChange={(e) => handleInputChange(index, 'source_of_energy', e.target.value)}
                          placeholder="Process or emission source"
                        />
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
              Add Process
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

export default Scope1ProcessEmissionsForm;
