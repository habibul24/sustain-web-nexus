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
  
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [currentLocation, setCurrentLocation] = useState<OfficeLocation | null>(null);
  const [scope2Data, setScope2Data] = useState<Scope2Data[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form data
  const [electricityProvider, setElectricityProvider] = useState<string>('');
  const [receivesBillsDirectly, setReceivesBillsDirectly] = useState<string>('');
  const [providePriorYear, setProvidePriorYear] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [invoiceQuantity, setInvoiceQuantity] = useState<string>('');
  const [invoiceQuantityPriorYear, setInvoiceQuantityPriorYear] = useState<string>('');
  const [organizationArea, setOrganizationArea] = useState<string>('');
  const [totalBuildingArea, setTotalBuildingArea] = useState<string>('');
  const [totalBuildingElectricity, setTotalBuildingElectricity] = useState<string>('');
  const [priorYearEmissionValue, setPriorYearEmissionValue] = useState<string>('');

  // Remove stepper and back button, show all questions in a single form for the selected location
  // Add state for table rows (months)
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  // Table state for invoice quantities and prior year emission
  const [tableRows, setTableRows] = useState(() => months.map(month => ({
    month,
    quantity: '',
    lastYear: ''
  })));

  // Track if provider was changed and deletion is pending
  const [pendingProviderChange, setPendingProviderChange] = useState(false);
  const [previousProvider, setPreviousProvider] = useState<string>('');

  // When scope2Data loads, populate tableRows
  useEffect(() => {
    if (receivesBillsDirectly === 'yes' && scope2Data.length > 0) {
      setTableRows(months.map(month => {
        const entry = scope2Data.find(e => e.month === month);
        return {
          month,
          quantity: entry ? (entry.quantity_used?.toString() || '') : '',
          lastYear: entry ? (entry.quantity_used_prior_year?.toString() || '') : ''
        };
      }));
    }
  }, [scope2Data, receivesBillsDirectly]);

  // When provider changes, set pending flag if there is existing data for this location
  useEffect(() => {
    if (!loading && electricityProvider && previousProvider && electricityProvider !== previousProvider) {
      const hasData = scope2Data.some(e => e.source_of_energy === previousProvider);
      if (hasData) {
        setPendingProviderChange(true);
      }
    }
    setPreviousProvider(electricityProvider);
    // eslint-disable-next-line
  }, [electricityProvider]);

  // Only show and save values for the currently selected provider
  useEffect(() => {
    if (receivesBillsDirectly === 'yes' && scope2Data.length > 0) {
      setTableRows(months.map(month => {
        const entry = scope2Data.find(e => e.month === month && e.source_of_energy === electricityProvider);
        return {
          month,
          quantity: entry ? (entry.quantity_used?.toString() || '') : '',
          lastYear: entry ? (entry.quantity_used_prior_year?.toString() || '') : ''
        };
      }));
    }
  }, [scope2Data, receivesBillsDirectly, electricityProvider]);

  // Handle table input change
  const handleTableChange = (idx: number, field: 'quantity' | 'lastYear', value: string) => {
    setTableRows(rows => rows.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  };

  // Save all table rows for this location
  const handleSaveTable = async () => {
    try {
      if (pendingProviderChange) {
        if (!window.confirm('Changing the provider will delete all previous monthly values for this location. Continue?')) {
          setPendingProviderChange(false);
          return;
        }
        // Delete all previous records for this location
        await supabase.from('scope2a_electricity')
          .delete()
          .eq('user_id', user.id)
          .eq('office_location_id', locationId);
        setPendingProviderChange(false);
      }
      for (const row of tableRows) {
        // Find if record exists for this month/location/provider
        const existing = scope2Data.find(e => e.month === row.month && e.source_of_energy === electricityProvider);
        if (existing) {
          // Update
          await supabase.from('scope2a_electricity').update({
            source_of_energy: electricityProvider,
            quantity_used: row.quantity ? parseFloat(row.quantity) : null,
            quantity_used_prior_year: providePriorYear === 'yes' ? (row.lastYear ? parseFloat(row.lastYear) : null) : null,
            receives_bills_directly: receivesBillsDirectly ? receivesBillsDirectly.toLowerCase() : null,
            provide_prior_year: providePriorYear === 'yes'
          }).eq('id', existing.id);
        } else if (row.quantity) {
          // Insert
          await supabase.from('scope2a_electricity').insert({
            user_id: user.id,
            office_location_id: locationId,
            source_of_energy: electricityProvider,
            unit_of_measurement: 'kWh',
            month: row.month,
            quantity_used: row.quantity ? parseFloat(row.quantity) : null,
            quantity_used_prior_year: providePriorYear === 'yes' ? (row.lastYear ? parseFloat(row.lastYear) : null) : null,
            receives_bills_directly: receivesBillsDirectly ? receivesBillsDirectly.toLowerCase() : null,
            provide_prior_year: providePriorYear === 'yes'
          });
        }
      }
      toast({ title: 'Success!', description: 'Table data saved.' });
      fetchData();
    } catch (error) {
      toast({ title: 'Error!', description: 'Failed to save table data.', variant: 'destructive' });
    }
  };

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
    setMonth('');
    setInvoiceQuantity('');
    setInvoiceQuantityPriorYear('');
    setOrganizationArea('');
    setTotalBuildingArea('');
    setTotalBuildingElectricity('');
    setPriorYearEmissionValue('');
    setTableRows(months.map(month => ({ month, quantity: '', lastYear: '' })));
    setScope2Data([]);
    setCurrentStep(1);
  }, [locationId]);

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
      // After fetching scope2Data in fetchData, set electricityProvider and receivesBillsDirectly from the most recent record for this location/provider
      if (formattedData.length > 0) {
        // If electricityProvider is set, use the most recent record for that provider, else use the most recent record for the location
        let latestRecord = electricityProvider
          ? formattedData.find(e => e.source_of_energy === electricityProvider)
          : formattedData[0];
        if (!latestRecord) latestRecord = formattedData[0];
        setElectricityProvider(latestRecord.source_of_energy || '');
        setReceivesBillsDirectly((latestRecord.receives_bills_directly || '').toLowerCase());
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

  const handleNextStep = () => {
    if (currentStep === 1 && !electricityProvider) {
      toast({
        title: "Please select electricity provider",
        description: "Please select your electricity provider.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === 2 && !receivesBillsDirectly) {
      toast({
        title: "Please answer the question",
        description: "Please indicate if you receive electricity bills directly.",
        variant: "destructive",
      });
      return;
    }

    if (currentStep === 3 && !providePriorYear) {
      toast({
        title: "Please answer the question",
        description: "Please indicate if you want to provide prior year data.",
        variant: "destructive",
      });
      return;
    }

    setCurrentStep(prev => prev + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSaveEntry = async () => {
    try {
      const calculatedQuantity = receivesBillsDirectly === 'yes' 
        ? parseFloat(invoiceQuantity) || 0
        : (parseFloat(organizationArea) || 0) / (parseFloat(totalBuildingArea) || 1) * (parseFloat(totalBuildingElectricity) || 0);

      const { error } = await supabase
        .from('scope2a_electricity')
        .insert({
          user_id: user.id,
          office_location_id: locationId,
          source_of_energy: electricityProvider,
          unit_of_measurement: 'kWh',
          quantity_used: calculatedQuantity,
          quantity_used_prior_year: providePriorYear === 'yes' ? parseFloat(invoiceQuantityPriorYear) || null : null,
          month,
          receives_bills_directly: receivesBillsDirectly ? receivesBillsDirectly.toLowerCase() : null,
          organization_area: receivesBillsDirectly === 'no' ? parseFloat(organizationArea) || null : null,
          total_building_area: receivesBillsDirectly === 'no' ? parseFloat(totalBuildingArea) || null : null,
          total_building_electricity: receivesBillsDirectly === 'no' ? parseFloat(totalBuildingElectricity) || null : null,
          provide_prior_year: providePriorYear === 'yes'
        });

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Entry saved successfully.",
      });

      // Reset form and go back to step 1
      resetForm();
      setCurrentStep(1);
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: "Error!",
        description: "Failed to save entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setElectricityProvider('');
    setReceivesBillsDirectly('');
    setProvidePriorYear('');
    setMonth('');
    setInvoiceQuantity('');
    setInvoiceQuantityPriorYear('');
    setOrganizationArea('');
    setTotalBuildingArea('');
    setTotalBuildingElectricity('');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Electricity Service Provider</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label>What is your electricity service provider for {currentLocation?.name}?</Label>
                <RadioGroup value={electricityProvider} onValueChange={setElectricityProvider}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Hong Kong Electric" id="hke" />
                    <Label htmlFor="hke" className="cursor-pointer">
                      Hong Kong Electric
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="CLP Power Hong Kong Limited (CLP)" id="clp" />
                    <Label htmlFor="clp" className="cursor-pointer">
                      CLP Power Hong Kong Limited (CLP)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Electricity Bills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label>Do you receive electricity bills directly for {currentLocation?.name}?</Label>
                <RadioGroup value={receivesBillsDirectly} onValueChange={setReceivesBillsDirectly}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="bills-yes" />
                    <Label htmlFor="bills-yes" className="cursor-pointer">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="bills-no" />
                    <Label htmlFor="bills-no" className="cursor-pointer">
                      No
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Prior Year Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label>Do you want to provide prior year's Carbon Emission equivalent?</Label>
                <RadioGroup value={providePriorYear} onValueChange={setProvidePriorYear}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="prior-yes" />
                    <Label htmlFor="prior-yes" className="cursor-pointer">
                      Yes
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="prior-no" />
                    <Label htmlFor="prior-no" className="cursor-pointer">
                      No
                    </Label>
                  </div>
                </RadioGroup>
                {providePriorYear === 'yes' && (
                  <div>
                    <Label htmlFor="prior-year-emission-value">Enter prior year emission value (kg CO2):</Label>
                    <Input
                      id="prior-year-emission-value"
                      type="number"
                      value={priorYearEmissionValue}
                      onChange={e => setPriorYearEmissionValue(e.target.value)}
                      placeholder="Enter prior year emission value"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        if (receivesBillsDirectly === 'yes') {
          return (
            <Card>
              <CardHeader>
                <CardTitle>Step 4: Direct Billing Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="month">Month</Label>
                    <Input
                      id="month"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      placeholder="e.g., January 2025"
                    />
                  </div>
                  <div>
                    <Label htmlFor="invoice-quantity">Invoice Quantity (kWh)</Label>
                    <Input
                      id="invoice-quantity"
                      type="number"
                      value={invoiceQuantity}
                      onChange={(e) => setInvoiceQuantity(e.target.value)}
                      placeholder="Enter electricity consumption in kWh"
                    />
                  </div>
                  {providePriorYear === 'yes' && (
                    <div>
                      <Label htmlFor="invoice-quantity-prior">Invoice Quantity: Prior Year (kWh)</Label>
                      <Input
                        id="invoice-quantity-prior"
                        type="number"
                        value={invoiceQuantityPriorYear}
                        onChange={(e) => setInvoiceQuantityPriorYear(e.target.value)}
                        placeholder="Enter prior year consumption in kWh"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        } else {
          return (
            <Card>
              <CardHeader>
                <CardTitle>Step 4: Building Area Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="month">Month</Label>
                    <Input
                      id="month"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      placeholder="e.g., January 2025"
                    />
                  </div>
                  <div>
                    <Label htmlFor="org-area">Area of Organization Space (sq ft)</Label>
                    <Input
                      id="org-area"
                      type="number"
                      value={organizationArea}
                      onChange={(e) => setOrganizationArea(e.target.value)}
                      placeholder="Enter your organization's floor area"
                    />
                  </div>
                  <div>
                    <Label htmlFor="total-building-area">Total Building Area (sq ft)</Label>
                    <Input
                      id="total-building-area"
                      type="number"
                      value={totalBuildingArea}
                      onChange={(e) => setTotalBuildingArea(e.target.value)}
                      placeholder="Enter total building floor area"
                    />
                    <p className="text-sm text-gray-600 mt-1">
                      💡 Request the monthly total electricity figures of the building from the facility manager.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="total-building-electricity">Total Building Electricity (kWh)</Label>
                    <Input
                      id="total-building-electricity"
                      type="number"
                      value={totalBuildingElectricity}
                      onChange={(e) => setTotalBuildingElectricity(e.target.value)}
                      placeholder="Enter total building electricity consumption"
                    />
                  </div>
                  {providePriorYear === 'yes' && (
                    <div>
                      <Label htmlFor="total-building-electricity-prior">Total Building Electricity: Prior Year (kWh)</Label>
                      <Input
                        id="total-building-electricity-prior"
                        type="number"
                        value={invoiceQuantityPriorYear}
                        onChange={(e) => setInvoiceQuantityPriorYear(e.target.value)}
                        placeholder="Enter prior year total building electricity"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        }

      default:
        return null;
    }
  };

  const [allLocations, setAllLocations] = useState<OfficeLocation[]>([]);

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
            {receivesBillsDirectly === 'yes' && (
              <>
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
                  {providePriorYear === 'yes' && (
                    <div>
                      <Label htmlFor="prior-year-emission-value">Enter prior year emission value (kg CO2):</Label>
                      <Input
                        id="prior-year-emission-value"
                        type="number"
                        value={priorYearEmissionValue}
                        onChange={e => setPriorYearEmissionValue(e.target.value)}
                        placeholder="Enter prior year emission value"
                      />
                    </div>
                  )}
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-3 font-semibold">Month</th>
                        <th className="py-2 px-3 font-semibold">Invoice Quantity</th>
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
                              onChange={e => handleTableChange(idx, 'quantity', e.target.value)}
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
                    <Button onClick={handleSaveTable} className="bg-green-500 hover:bg-green-600 text-white ml-auto">Save Table</Button>
                  </div>
                </div>
              </>
            )}
            {receivesBillsDirectly === 'no' && (
              <>
                <div className="space-y-4">
                  <Label>Area of Organization Space (sq ft)</Label>
                  <Input
                    id="org-area"
                    type="number"
                    value={organizationArea}
                    onChange={(e) => setOrganizationArea(e.target.value)}
                    placeholder="Enter your organization's floor area"
                  />
                </div>
                <div className="space-y-4">
                  <Label>Total Building Area (sq ft)</Label>
                  <Input
                    id="total-building-area"
                    type="number"
                    value={totalBuildingArea}
                    onChange={(e) => setTotalBuildingArea(e.target.value)}
                    placeholder="Enter total building floor area"
                  />
                </div>
                <div className="space-y-4">
                  <Label>Total Building Electricity (kWh)</Label>
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
              onClick={() => nextLocation && navigate(`/my-esg/environmental/scope-2/electricity/${nextLocation.id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!nextLocation}
            >
              Next
            </Button>
          );
        })()}
      </div>
    </div>
  );
};

export default Scope2aElectricityLocation;
