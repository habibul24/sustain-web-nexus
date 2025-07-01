
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useToast } from '../../hooks/use-toast';
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
  receives_bills_directly: string | null;
  provide_prior_year: boolean | null;
  organization_area: number | null;
  total_building_area: number | null;
}

const Scope3aWaterLocation = () => {
  const { locationId } = useParams();
  const { user } = useAuthContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [currentLocation, setCurrentLocation] = useState<OfficeLocation | null>(null);
  const [scope3aWaterData, setScope3aWaterData] = useState<Scope3aWaterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [receivesBillsDirectly, setReceivesBillsDirectly] = useState('');
  const [providePriorYear, setProvidePriorYear] = useState('');
  const [organizationArea, setOrganizationArea] = useState('');
  const [totalBuildingArea, setTotalBuildingArea] = useState('');
  const [allLocations, setAllLocations] = useState<OfficeLocation[]>([]);

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
    if (user && locationId) {
      fetchData();
      fetchAllLocations();
    }
  }, [user, locationId]);

  useEffect(() => {
    if (scope3aWaterData.length > 0) {
      const firstEntry = scope3aWaterData[0];
      
      // Set form state from saved data
      setReceivesBillsDirectly(firstEntry.receives_bills_directly || '');
      setProvidePriorYear(firstEntry.provide_prior_year ? 'yes' : 'no');
      setOrganizationArea(firstEntry.organization_area?.toString() || '');
      setTotalBuildingArea(firstEntry.total_building_area?.toString() || '');
      
      // Set table rows from saved data
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

  const fetchAllLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('office_locations')
        .select('id, name, address')
        .eq('user_id', user.id)
        .order('name');
      
      if (error) throw error;
      setAllLocations(data || []);
    } catch (error) {
      console.error('Error fetching all locations:', error);
    }
  };

  const handleTableChange = (idx: number, field: 'quantity' | 'lastYear', value: string) => {
    setTableRows(rows => rows.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Delete existing records for this location
      await supabase
        .from('scope3a_water')
        .delete()
        .eq('user_id', user.id)
        .eq('office_location_id', locationId);

      // Insert new records
      const recordsToInsert = [];
      
      if (receivesBillsDirectly === 'yes') {
        // Insert monthly data
        for (const row of tableRows) {
          if (row.quantity) {
            recordsToInsert.push({
              user_id: user.id,
              office_location_id: locationId,
              month: row.month,
              quantity_used: parseFloat(row.quantity),
              quantity_used_prior_year: providePriorYear === 'yes' && row.lastYear ? parseFloat(row.lastYear) : null,
              unit_of_measurement: 'm³',
              receives_bills_directly: receivesBillsDirectly,
              provide_prior_year: providePriorYear === 'yes',
              organization_area: null,
              total_building_area: null
            });
          }
        }
      } else {
        // Insert area-based calculation (single record)
        if (organizationArea && totalBuildingArea) {
          recordsToInsert.push({
            user_id: user.id,
            office_location_id: locationId,
            month: null,
            quantity_used: null,
            quantity_used_prior_year: null,
            unit_of_measurement: 'm³',
            receives_bills_directly: receivesBillsDirectly,
            provide_prior_year: false,
            organization_area: parseFloat(organizationArea),
            total_building_area: parseFloat(totalBuildingArea)
          });
        }
      }

      if (recordsToInsert.length > 0) {
        const { error } = await supabase
          .from('scope3a_water')
          .insert(recordsToInsert);
        
        if (error) throw error;
      }

      toast({ title: 'Success!', description: 'Water consumption data saved successfully.' });
      fetchData(); // Refresh data to show saved state
    } catch (error) {
      console.error('Error saving water data:', error);
      toast({ title: 'Error!', description: 'Failed to save water consumption data.', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    // Save current data first
    await handleSave();
    
    // Find current location index
    const currentIndex = allLocations.findIndex(loc => loc.id === locationId);
    
    if (currentIndex < allLocations.length - 1) {
      // Go to next location
      const nextLocation = allLocations[currentIndex + 1];
      navigate(`/my-esg/environmental/scope-3/waste/water/${nextLocation.id}`);
    } else {
      // All locations completed, go to results or next section
      navigate('/my-esg/environmental/scope-3/waste/results');
    }
  };

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
      
      const { data: waterData, error: waterError } = await supabase
        .from('scope3a_water')
        .select('*')
        .eq('user_id', user.id)
        .eq('office_location_id', locationId);
      if (waterError) throw waterError;
      setScope3aWaterData((waterData || []) as Scope3aWaterData[]);
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
              </>
            )}

            <div className="flex justify-between space-x-4 pt-6 border-t">
              <Button
                onClick={handleSave}
                disabled={saving}
                variant="outline"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {saving ? 'Saving...' : 'Save'}
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={saving}
                className="bg-green-600 hover:bg-green-700"
              >
                {allLocations.findIndex(loc => loc.id === locationId) < allLocations.length - 1 
                  ? 'Next Location' 
                  : 'Complete & View Results'
                }
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Scope3aWaterLocation;
