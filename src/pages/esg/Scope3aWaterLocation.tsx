import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useToast } from '../../components/ui/use-toast';
import { supabase } from '../../integrations/supabase/client';
import { useAuthContext } from '../../contexts/AuthContext';

interface OfficeLocation {
  id: string;
  name: string;
  address: string;
}

interface Scope3aWaterData {
  id: string;
  month: string | null;
  quantity_used: number | null;
  quantity_used_prior_year: number | null;
  unit_of_measurement: string;
  emission_factor: number | null;
  emissions_kg_co2: number | null;
  source_of_emission: string | null;
  office_location_id: string | null;
  office_location_name: string;
}

const Scope3aWaterLocation = () => {
  const { locationId } = useParams();
  const { user } = useAuthContext();
  const { toast } = useToast();
  
  const [currentLocation, setCurrentLocation] = useState<OfficeLocation | null>(null);
  const [scope3aWaterData, setScope3aWaterData] = useState<Scope3aWaterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [receivesBillsDirectly, setReceivesBillsDirectly] = useState('');
  const [providePriorYear, setProvidePriorYear] = useState('');
  const [organizationArea, setOrganizationArea] = useState('');
  const [totalBuildingArea, setTotalBuildingArea] = useState('');

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const [tableRows, setTableRows] = useState(() => months.map(month => ({
    month,
    quantity: '',
    lastYear: ''
  })));

  useEffect(() => {
    if (scope3aWaterData.length > 0) {
      setTableRows(months.map(month => {
        const entry = scope3aWaterData.find(e => e.month === month);
        return {
          month,
          quantity: entry ? (entry.quantity_used?.toString() || '') : '',
          lastYear: entry ? (entry.quantity_used_prior_year?.toString() || '') : ''
        };
      }));
    }
  }, [scope3aWaterData]);

  const handleTableChange = (idx: number, field: 'quantity' | 'lastYear', value: string) => {
    setTableRows(rows => rows.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  };

  const handleSaveTable = async () => {
    try {
      for (const row of tableRows) {
        const existing = scope3aWaterData.find(e => e.month === row.month);
        if (existing) {
          await (supabase.from as any)('scope3a_water').update({
            quantity_used: row.quantity ? parseFloat(row.quantity) : null,
            quantity_used_prior_year: providePriorYear === 'yes' ? (row.lastYear ? parseFloat(row.lastYear) : null) : null,
            receives_bills_directly: receivesBillsDirectly,
            provide_prior_year: providePriorYear === 'yes',
            organization_area: receivesBillsDirectly === 'no' ? parseFloat(organizationArea) || null : null,
            total_building_area: receivesBillsDirectly === 'no' ? parseFloat(totalBuildingArea) || null : null
          }).eq('id', existing.id);
        } else if (row.quantity) {
          await (supabase.from as any)('scope3a_water').insert({
            user_id: user.id,
            office_location_id: locationId,
            month: row.month,
            quantity_used: row.quantity ? parseFloat(row.quantity) : null,
            quantity_used_prior_year: providePriorYear === 'yes' ? (row.lastYear ? parseFloat(row.lastYear) : null) : null,
            unit_of_measurement: 'm³',
            receives_bills_directly: receivesBillsDirectly,
            provide_prior_year: providePriorYear === 'yes',
            organization_area: receivesBillsDirectly === 'no' ? parseFloat(organizationArea) || null : null,
            total_building_area: receivesBillsDirectly === 'no' ? parseFloat(totalBuildingArea) || null : null
          });
        }
      }
      toast({ title: 'Success!', description: 'Water consumption data saved.' });
      fetchData();
    } catch (error) {
      console.error('Error saving water data:', error);
      toast({ title: 'Error!', description: 'Failed to save water consumption data.', variant: 'destructive' });
    }
  };

  const handleSaveArea = async () => {
    // Optionally, save area data to a separate table or as notes
    toast({ title: 'Saved!', description: 'Area data saved (not persisted in this demo).' });
  };

  useEffect(() => {
    if (user && locationId) {
      fetchData();
    }
  }, [user, locationId]);

  const fetchData = async () => {
    try {
      const { data: location, error: locError } = await supabase
        .from('office_locations')
        .select('id, name, address')
        .eq('id', locationId)
        .eq('user_id', user.id)
        .single();
      if (locError) throw locError;
      setCurrentLocation(location);
      const { data: waterData, error: waterError } = await (supabase.from as any)('scope3a_water')
        .select('*')
        .eq('user_id', user.id)
        .eq('office_location_id', locationId);
      if (waterError) throw waterError;
      setScope3aWaterData((waterData || []) as any);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({ title: 'Error!', description: 'Failed to fetch data.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="max-w-6xl mx-auto p-6"><div className="text-center">Loading...</div></div>;
  }
  if (!currentLocation) {
    return <div className="max-w-6xl mx-auto p-6"><div className="text-center">Location not found</div></div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">
        Scope 3a Water - {currentLocation.name}
      </h1>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Water Consumption Data Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="mb-4">
              <Label>Do you receive water bills directly?</Label>
              <RadioGroup value={receivesBillsDirectly} onValueChange={setReceivesBillsDirectly} className="flex flex-row gap-6 mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="bills-yes" />
                  <Label htmlFor="bills-yes" className="cursor-pointer">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="bills-no" />
                  <Label htmlFor="bills-no" className="cursor-pointer">No</Label>
                </div>
              </RadioGroup>
            </div>
            {receivesBillsDirectly === 'yes' && (
              <>
                <div className="mb-4">
                  <Label>Do you want to provide prior year details?</Label>
                  <RadioGroup value={providePriorYear} onValueChange={setProvidePriorYear} className="flex flex-row gap-6 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="prior-yes" />
                      <Label htmlFor="prior-yes" className="cursor-pointer">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="prior-no" />
                      <Label htmlFor="prior-no" className="cursor-pointer">No</Label>
                    </div>
                  </RadioGroup>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-3 font-semibold">Month</th>
                        <th className="py-2 px-3 font-semibold">Invoice Quantity</th>
                        <th className="py-2 px-3 font-semibold">Unit</th>
                        {providePriorYear === 'yes' && (
                          <th className="py-2 px-3 font-semibold">Last Year Emission Figure</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {tableRows.map((row, idx) => (
                        <tr key={row.month} className="border-b">
                          <td className="py-2 px-3 font-semibold">{row.month}</td>
                          <td className="py-2 px-3">
                            <Input
                              type="number"
                              value={row.quantity}
                              onChange={e => handleTableChange(idx, 'quantity', e.target.value)}
                              placeholder="Enter quantity"
                              step="0.01"
                            />
                          </td>
                          <td className="py-2 px-3">m³</td>
                          {providePriorYear === 'yes' && (
                            <td className="py-2 px-3">
                              <Input
                                type="number"
                                value={row.lastYear}
                                onChange={e => handleTableChange(idx, 'lastYear', e.target.value)}
                                placeholder="Last year emission"
                                step="0.01"
                              />
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4 flex items-center gap-2">
                    <Button 
                      variant="link" 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => {
                        window.open('https://www.epa.gov/climateleadership/ghg-emission-factors-hub', '_blank');
                      }}
                    >
                      💡 Click here for source of emission factor
                    </Button>
                    <Button onClick={handleSaveTable} className="bg-green-500 hover:bg-green-600 text-white ml-auto">
                      Save Table
                    </Button>
                  </div>
                </div>
              </>
            )}
            {receivesBillsDirectly === 'no' && (
              <>
                <div className="mb-4">
                  <Label>Area of Organization Space (sq ft)</Label>
                  <Input
                    id="org-area"
                    type="number"
                    value={organizationArea}
                    onChange={e => setOrganizationArea(e.target.value)}
                    placeholder="Enter your organization's floor area"
                  />
                </div>
                <div className="mb-4">
                  <Label>Total Building Area (sq ft)</Label>
                  <Input
                    id="total-building-area"
                    type="number"
                    value={totalBuildingArea}
                    onChange={e => setTotalBuildingArea(e.target.value)}
                    placeholder="Enter total building floor area"
                  />
                </div>
                <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                  <span>💡</span> Request the monthly total water figures of the building from the facility manager.
                </div>
                <Button onClick={handleSaveArea} className="bg-green-500 hover:bg-green-600 text-white mt-4">
                  Save Table
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Scope3aWaterLocation; 