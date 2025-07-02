
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

interface Scope2Data {
  id: string;
  source_of_energy: string;
  quantity_used: number | null;
  quantity_used_prior_year: number | null;
  emission_factor: number | null;
  emission_factor_prior_year: number | null;
  emissions_kg_co2: number | null;
  office_location_id: string | null;
  office_location_name: string;
  month: string | null;
  receives_bills_directly: string | null;
  organization_area: number | null;
  total_building_area: number | null;
  total_building_electricity: number | null;
  provide_prior_year: boolean;
  invoice_file_url?: string | null;
}

const Scope2aElectricityLocation = () => {
  const navigate = useNavigate();
  const { locationId } = useParams();
  const { user } = useAuthContext();
  const { toast } = useToast();
  
  const [currentLocation, setCurrentLocation] = useState<OfficeLocation | null>(null);
  const [scope2Data, setScope2Data] = useState<Scope2Data[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form data
  const [electricityProvider, setElectricityProvider] = useState<string>('');
  const [receivesBillsDirectly, setReceivesBillsDirectly] = useState<string>('');
  const [providePriorYear, setProvidePriorYear] = useState<string>('');
  const [priorYearValue, setPriorYearValue] = useState<string>('');
  const [organizationArea, setOrganizationArea] = useState<string>('');
  const [totalBuildingArea, setTotalBuildingArea] = useState<string>('');
  const [totalBuildingElectricity, setTotalBuildingElectricity] = useState<string>('');
  const [emissionFactor, setEmissionFactor] = useState<number>(0);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const [tableRows, setTableRows] = useState(() => months.map(month => ({
    month,
    quantity: ''
  })));

  const [allLocations, setAllLocations] = useState<OfficeLocation[]>([]);

  // Add emission factor mapping
  const providerEmissionFactors: Record<string, number> = {
    'Hong Kong Electric': 0.6,
    'CLP Power Hong Kong Limited (CLP)': 0.38
  };

  // Auto-fill emission factor when provider changes
  useEffect(() => {
    setEmissionFactor(providerEmissionFactors[electricityProvider] || 0);
  }, [electricityProvider]);

  useEffect(() => {
    if (user && locationId) {
      fetchData();
    }
  }, [user, locationId]);

  useEffect(() => {
    // Reset all form state when locationId changes
    setElectricityProvider('');
    setReceivesBillsDirectly('');
    setProvidePriorYear('');
    setPriorYearValue('');
    setOrganizationArea('');
    setTotalBuildingArea('');
    setTotalBuildingElectricity('');
    setEmissionFactor(0);
    setTableRows(months.map(month => ({ month, quantity: '' })));
    setScope2Data([]);
  }, [locationId]);

  // When scope2Data loads, populate tableRows
  useEffect(() => {
    if (receivesBillsDirectly === 'yes' && scope2Data.length > 0) {
      setTableRows(months.map(month => {
        const entry = scope2Data.find(e => e.month === month && e.source_of_energy === electricityProvider);
        return {
          month,
          quantity: entry ? (entry.quantity_used?.toString() || '') : ''
        };
      }));
      
      // Set prior year value from any entry (since it's the same for all months)
      const firstEntry = scope2Data[0];
      if (firstEntry && firstEntry.quantity_used_prior_year) {
        setPriorYearValue(firstEntry.quantity_used_prior_year.toString());
      }
    }
  }, [scope2Data, receivesBillsDirectly, electricityProvider]);

  const fetchData = async () => {
    try {
      // Fetch the specific office location
      const { data: location, error: locError } = await supabase
        .from('office_locations')
        .select('id, name, address')
        .eq('id', locationId)
        .eq('user_id', user.id)
        .single();

      if (locError) throw locError;
      setCurrentLocation(location);

      // Fetch existing scope 2 data for this location
      const { data: scope2, error: scope2Error } = await supabase
        .from('scope2a_electricity')
        .select(`
          id,
          source_of_energy,
          quantity_used,
          quantity_used_prior_year,
          emission_factor,
          emission_factor_prior_year,
          emissions_kg_co2,
          month,
          receives_bills_directly,
          organization_area,
          total_building_area,
          total_building_electricity,
          provide_prior_year,
          invoice_file_url,
          office_location_id,
          office_locations!inner(name)
        `)
        .eq('user_id', user.id)
        .eq('office_location_id', locationId);

      if (scope2Error) throw scope2Error;

      const formattedData = scope2?.map(item => ({
        ...item,
        office_location_name: (item as any).office_locations?.name || 'Unknown Location'
      })) || [];

      setScope2Data(formattedData);

      // Set form fields from the most recent record for this location
      if (formattedData.length > 0) {
        const latestRecord = formattedData[formattedData.length - 1];
        setElectricityProvider(latestRecord.source_of_energy || '');
        setReceivesBillsDirectly((latestRecord.receives_bills_directly || '').toLowerCase());
        setProvidePriorYear(latestRecord.provide_prior_year ? 'yes' : 'no');
        setOrganizationArea(latestRecord.organization_area?.toString() || '');
        setTotalBuildingArea(latestRecord.total_building_area?.toString() || '');
        setTotalBuildingElectricity(latestRecord.total_building_electricity?.toString() || '');
        setEmissionFactor(latestRecord.emission_factor || 0);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error!",
        description: "Failed to fetch data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch all office locations for navigation
  useEffect(() => {
    const fetchLocations = async () => {
      if (!user) return;
      const { data, error } = await supabase
        .from('office_locations')
        .select('id, name, address')
        .eq('user_id', user.id)
        .order('name');
      if (!error && data) setAllLocations(data);
    };
    fetchLocations();
  }, [user]);

  // Handle table input change
  const handleTableChange = (idx: number, value: string) => {
    setTableRows(rows => rows.map((row, i) => i === idx ? { ...row, quantity: value } : row));
  };

  // Save all table rows for this location (for direct billing)
  const handleSaveTable = async () => {
    try {
      // Delete existing records for this location and provider
      await supabase.from('scope2a_electricity')
        .delete()
        .eq('user_id', user.id)
        .eq('office_location_id', locationId)
        .eq('source_of_energy', electricityProvider);

      // Insert new records
      const recordsToInsert = [];
      for (const row of tableRows) {
        if (row.quantity) {
          const quantityUsed = parseFloat(row.quantity);
          const quantityPriorYear = providePriorYear === 'yes' && priorYearValue ? parseFloat(priorYearValue) : null;
          const emissions = quantityUsed * emissionFactor;

          recordsToInsert.push({
            user_id: user.id,
            office_location_id: locationId,
            source_of_energy: electricityProvider,
            unit_of_measurement: 'kWh',
            month: row.month,
            quantity_used: quantityUsed,
            quantity_used_prior_year: quantityPriorYear,
            emission_factor: emissionFactor,
            emissions_kg_co2: emissions,
            receives_bills_directly: 'yes',
            provide_prior_year: providePriorYear === 'yes'
          });
        }
      }

      if (recordsToInsert.length > 0) {
        const { error } = await supabase.from('scope2a_electricity').insert(recordsToInsert);
        if (error) throw error;
      }

      toast({ title: 'Success!', description: 'Monthly data saved successfully.' });
      fetchData();
    } catch (error) {
      console.error('Error saving table data:', error);
      toast({ title: 'Error!', description: 'Failed to save data.', variant: 'destructive' });
    }
  };

  // Save building area data (for indirect billing)
  const handleSaveBuildingData = async () => {
    try {
      if (!organizationArea || !totalBuildingArea || !totalBuildingElectricity) {
        toast({ title: 'Error!', description: 'Please fill in all required fields.', variant: 'destructive' });
        return;
      }

      const orgArea = parseFloat(organizationArea);
      const buildingArea = parseFloat(totalBuildingArea);
      const buildingElectricity = parseFloat(totalBuildingElectricity);
      
      // Calculate quantity used based on area proportion
      const quantityUsed = (orgArea / buildingArea) * buildingElectricity;
      const emissions = quantityUsed * emissionFactor;

      // Delete existing records for this location and provider
      await supabase.from('scope2a_electricity')
        .delete()
        .eq('user_id', user.id)
        .eq('office_location_id', locationId)
        .eq('source_of_energy', electricityProvider);

      // Insert new record
      const { error } = await supabase.from('scope2a_electricity').insert({
        user_id: user.id,
        office_location_id: locationId,
        source_of_energy: electricityProvider,
        unit_of_measurement: 'kWh',
        organization_area: orgArea,
        total_building_area: buildingArea,
        total_building_electricity: buildingElectricity,
        quantity_used: quantityUsed,
        emission_factor: emissionFactor,
        emissions_kg_co2: emissions,
        receives_bills_directly: 'no',
        provide_prior_year: providePriorYear === 'yes'
      });

      if (error) throw error;

      toast({ title: 'Success!', description: 'Building data saved successfully.' });
      fetchData();
    } catch (error) {
      console.error('Error saving building data:', error);
      toast({ title: 'Error!', description: 'Failed to save data.', variant: 'destructive' });
    }
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!currentLocation) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">Location not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">
        Scope 2a Electricity - {currentLocation.name}
      </h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Electricity Data Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>What is your electricity service provider?</Label>
              <RadioGroup value={electricityProvider} onValueChange={setElectricityProvider}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Hong Kong Electric" id="hke" />
                  <Label htmlFor="hke" className="cursor-pointer">Hong Kong Electric</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="CLP Power Hong Kong Limited (CLP)" id="clp" />
                  <Label htmlFor="clp" className="cursor-pointer">CLP Power Hong Kong Limited (CLP)</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-4">
              <Label>Do you receive electricity bills directly?</Label>
              <RadioGroup value={receivesBillsDirectly} onValueChange={setReceivesBillsDirectly}>
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

            <div className="space-y-4">
              <Label>Do you want to provide prior year's Carbon Emission equivalent?</Label>
              <RadioGroup value={providePriorYear} onValueChange={setProvidePriorYear}>
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

            {providePriorYear === 'yes' && (
              <div className="space-y-4">
                <Label htmlFor="prior-year-value">Prior Year Total Electricity Consumption (kWh)</Label>
                <Input
                  id="prior-year-value"
                  type="number"
                  value={priorYearValue}
                  onChange={(e) => setPriorYearValue(e.target.value)}
                  placeholder="Enter total kWh for prior year"
                  step="0.01"
                />
              </div>
            )}

            {receivesBillsDirectly === 'yes' && (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-3 font-semibold">Month</th>
                        <th className="py-2 px-3 font-semibold">Invoice Quantity (kWh)</th>
                        <th className="py-2 px-3 font-semibold">Unit of Measurement</th>
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
                              onChange={e => handleTableChange(idx, e.target.value)}
                              placeholder="Enter quantity"
                            />
                          </td>
                          <td className="py-2 px-3">kWh</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="mt-4 flex items-center gap-2">
                    <Button 
                      variant="link" 
                      className="text-blue-600 hover:text-blue-800"
                      onClick={() => {
                        const sourceUrl = electricityProvider === 'Hong Kong Electric' 
                          ? 'https://www.hkelectric.com/documents/en/InvestorRelations/InvestorRelations_GLNCS/Documents/2025/ESR2024%20full%20version.pdf'
                          : 'https://sustainability.clpgroup.com/en/2024/esg-data-hub';
                        window.open(sourceUrl, '_blank');
                      }}
                    >
                      💡 Click here for source of emission factor
                    </Button>
                    <Button onClick={handleSaveTable} className="bg-green-500 hover:bg-green-600 text-white ml-auto">
                      Save Monthly Data
                    </Button>
                  </div>
                </div>
              </>
            )}

            {receivesBillsDirectly === 'no' && (
              <>
                <div className="space-y-4">
                  <Label htmlFor="org-area">Area of Organization Space (sq ft)</Label>
                  <Input
                    id="org-area"
                    type="number"
                    value={organizationArea}
                    onChange={(e) => setOrganizationArea(e.target.value)}
                    placeholder="Enter your organization's floor area"
                  />
                </div>
                <div className="space-y-4">
                  <Label htmlFor="total-building-area">Total Building Area (sq ft)</Label>
                  <Input
                    id="total-building-area"
                    type="number"
                    value={totalBuildingArea}
                    onChange={(e) => setTotalBuildingArea(e.target.value)}
                    placeholder="Enter total building floor area"
                  />
                </div>
                <div className="space-y-4">
                  <Label htmlFor="total-building-electricity">Total Building Electricity (kWh)</Label>
                  <Input
                    id="total-building-electricity"
                    type="number"
                    value={totalBuildingElectricity}
                    onChange={(e) => setTotalBuildingElectricity(e.target.value)}
                    placeholder="Enter total building electricity consumption"
                  />
                </div>
                <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
                  <span>💡</span> Request the monthly total electricity figures of the building from the facility manager.
                </div>
                <div className="space-y-4">
                  <Label htmlFor="emission-factor">GHG Emission Factor (kgCO2e/kWh)</Label>
                  <Input
                    id="emission-factor"
                    type="number"
                    value={emissionFactor}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>
                <Button 
                  onClick={handleSaveBuildingData}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Save Building Data
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end mt-8">
        {(() => {
          const currentIdx = allLocations.findIndex(loc => loc.id === locationId);
          const nextLocation = currentIdx !== -1 && currentIdx < allLocations.length - 1 ? allLocations[currentIdx + 1] : null;
          return (
            <Button
              onClick={() => {
                if (nextLocation) {
                  navigate(`/my-esg/environmental/scope-2/electricity/${nextLocation.id}`);
                } else {
                  navigate('/my-esg/environmental/scope-2-result');
                }
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {nextLocation ? 'Next Location' : 'View Results'}
            </Button>
          );
        })()}
      </div>
    </div>
  );
};

export default Scope2aElectricityLocation;
