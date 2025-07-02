
import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useToast } from '../../hooks/use-toast';
import { supabase } from '../../integrations/supabase/client';
import { useAuthContext } from '../../contexts/AuthContext';

interface StationaryCombustionData {
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

const Scope1StationaryCombustionForm: React.FC<Props> = ({ isApplicable, onApplicabilityChange }) => {
  const { user } = useAuthContext();
  const { toast } = useToast();
  
  const [data, setData] = useState<StationaryCombustionData[]>([]);
  const [loading, setLoading] = useState(false);

  const energySources = [
    'Diesel oil',
    'Kerosene', 
    'Liquefied Petroleum Gas',
    'Charcoal',
    'Towngas'
  ];

  useEffect(() => {
    if (isApplicable && user) {
      fetchData();
    }
  }, [isApplicable, user]);

  const fetchData = async () => {
    try {
      const { data: existingData, error } = await supabase
        .from('stationary_combustion')
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
        // Initialize with empty data for each energy source
        setData(energySources.map(source => ({
          source_of_energy: source,
          quantity_used: null,
          last_year_emission_figures: null,
          is_applicable: true
        })));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (index: number, field: keyof StationaryCombustionData, value: any) => {
    setData(prev => prev.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = async () => {
    if (!isApplicable) {
      // Save that it's not applicable
      try {
        await supabase
          .from('stationary_combustion')
          .delete()
          .eq('user_id', user.id);

        await supabase
          .from('stationary_combustion')
          .insert({
            user_id: user.id,
            source_of_energy: 'N/A',
            quantity_used: 0,
            unit_of_measurement: 'L',
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
        .from('stationary_combustion')
        .delete()
        .eq('user_id', user.id);

      // Insert new records
      const recordsToInsert = data
        .filter(item => item.quantity_used && item.quantity_used > 0)
        .map(item => ({
          user_id: user.id,
          source_of_energy: item.source_of_energy,
          quantity_used: item.quantity_used,
          last_year_emission_figures: item.last_year_emission_figures,
          unit_of_measurement: 'L',
          is_applicable: true
        }));

      if (recordsToInsert.length > 0) {
        const { error } = await supabase
          .from('stationary_combustion')
          .insert(recordsToInsert);

        if (error) throw error;
      }

      toast({ title: 'Success!', description: 'Stationary combustion data saved successfully.' });
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
        <CardTitle>Scope 1a: Stationary Combustion</CardTitle>
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
              <RadioGroupItem value="yes" id="applicable-yes" />
              <Label htmlFor="applicable-yes" className="cursor-pointer">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="applicable-no" />
              <Label htmlFor="applicable-no" className="cursor-pointer">No</Label>
            </div>
          </RadioGroup>
        </div>

        {isApplicable && (
          <>
            <div className="text-sm text-gray-600 bg-blue-50 p-4 rounded-lg">
              <p><strong>Instructions:</strong></p>
              <p>Please provide the quantity of fuel consumed for each applicable energy source. The system will automatically calculate emissions using standard emission factors.</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-3 font-semibold">Energy Source</th>
                    <th className="py-2 px-3 font-semibold">Quantity Used (L)</th>
                    <th className="py-2 px-3 font-semibold">Last Year Figures (L)</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item, index) => (
                    <tr key={item.source_of_energy} className="border-b">
                      <td className="py-2 px-3 font-medium">{item.source_of_energy}</td>
                      <td className="py-2 px-3">
                        <Input
                          type="number"
                          value={item.quantity_used || ''}
                          onChange={(e) => handleInputChange(index, 'quantity_used', parseFloat(e.target.value) || null)}
                          placeholder="Enter quantity"
                          step="0.01"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <Input
                          type="number"
                          value={item.last_year_emission_figures || ''}
                          onChange={(e) => handleInputChange(index, 'last_year_emission_figures', parseFloat(e.target.value) || null)}
                          placeholder="Enter last year figures"
                          step="0.01"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

export default Scope1StationaryCombustionForm;
