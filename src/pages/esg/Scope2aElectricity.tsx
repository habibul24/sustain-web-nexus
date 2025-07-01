
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const Scope2aElectricity = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { toast } = useToast();
  
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [officeLocations, setOfficeLocations] = useState<OfficeLocation[]>([]);
  const [scope2Data, setScope2Data] = useState<Scope2Data[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form data
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [receivesBillsDirectly, setReceivesBillsDirectly] = useState<string>('');
  const [electricityProvider, setElectricityProvider] = useState<string>('');
  const [organizationArea, setOrganizationArea] = useState<string>('');
  const [totalBuildingArea, setTotalBuildingArea] = useState<string>('');
  const [totalBuildingElectricity, setTotalBuildingElectricity] = useState<string>('');
  const [month, setMonth] = useState<string>('');
  const [invoiceQuantity, setInvoiceQuantity] = useState<string>('');
  const [providePriorYear, setProvidePriorYear] = useState<string>('');
  const [invoiceQuantityPriorYear, setInvoiceQuantityPriorYear] = useState<string>('');

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch office locations
      const { data: locations, error: locError } = await supabase
        .from('office_locations')
        .select('id, name, address')
        .eq('user_id', user.id);

      if (locError) throw locError;
      setOfficeLocations(locations || []);

      // Fetch existing scope 2 data
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
        .eq('user_id', user.id);

      if (scope2Error) throw scope2Error;

      const formattedData = scope2?.map(item => ({
        ...item,
        office_location_name: (item as any).office_locations?.name || 'Unknown Location'
      })) || [];

      setScope2Data(formattedData);
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
    if (currentStep === 1 && !selectedLocation) {
      toast({
        title: "Please select a location",
        description: "You must select an office location to continue.",
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

    if (currentStep === 3 && !electricityProvider) {
      toast({
        title: "Please select electricity provider",
        description: "Please select your electricity provider.",
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
          office_location_id: selectedLocation,
          source_of_energy: electricityProvider,
          unit_of_measurement: 'kWh', // Adding the required unit_of_measurement field
          quantity_used: calculatedQuantity,
          quantity_used_prior_year: providePriorYear === 'yes' ? parseFloat(invoiceQuantityPriorYear) || null : null,
          month,
          receives_bills_directly: receivesBillsDirectly,
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
    setSelectedLocation('');
    setReceivesBillsDirectly('');
    setElectricityProvider('');
    setOrganizationArea('');
    setTotalBuildingArea('');
    setTotalBuildingElectricity('');
    setMonth('');
    setInvoiceQuantity('');
    setProvidePriorYear('');
    setInvoiceQuantityPriorYear('');
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Select Office Location</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label>Which office location would you like to add electricity data for?</Label>
                <RadioGroup value={selectedLocation} onValueChange={setSelectedLocation}>
                  {officeLocations.map((location) => (
                    <div key={location.id} className="flex items-center space-x-2">
                      <RadioGroupItem value={location.id} id={location.id} />
                      <Label htmlFor={location.id} className="cursor-pointer">
                        {location.name} - {location.address}
                      </Label>
                    </div>
                  ))}
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
                <Label>Does your organization receive electricity bills directly for this location?</Label>
                <RadioGroup value={receivesBillsDirectly} onValueChange={setReceivesBillsDirectly}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="bills-yes" />
                    <Label htmlFor="bills-yes" className="cursor-pointer">
                      Yes, we receive electricity bills directly
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="bills-no" />
                    <Label htmlFor="bills-no" className="cursor-pointer">
                      No, electricity is included in rent or managed by building
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
              <CardTitle>Step 3: Electricity Provider</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label>Select your electricity provider:</Label>
                <RadioGroup value={electricityProvider} onValueChange={setElectricityProvider}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Hong Kong Electric" id="hke" />
                    <Label htmlFor="hke" className="cursor-pointer">
                      Hong Kong Electric (HKE)
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
                  <div className="space-y-2">
                    <Label>Do you want to provide prior year data for comparison?</Label>
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
                    <div>
                      <Label htmlFor="invoice-quantity-prior">Invoice Quantity Prior Year (kWh)</Label>
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
                    <Label htmlFor="org-area">Your Organization's Area (sq ft)</Label>
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
                  <div className="space-y-2">
                    <Label>Do you want to provide prior year data for comparison?</Label>
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
                    <div>
                      <Label htmlFor="invoice-quantity-prior">Total Building Electricity Prior Year (kWh)</Label>
                      <Input
                        id="invoice-quantity-prior"
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

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Scope 2a Electricity</h1>
      
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                step <= currentStep
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
        <div className="text-center mt-2 text-sm text-gray-600">
          Step {currentStep} of 4
        </div>
      </div>

      {/* Step content */}
      <div className="mb-8">
        {renderStepContent()}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mb-8">
        <Button
          variant="outline"
          onClick={handlePreviousStep}
          disabled={currentStep === 1}
        >
          Previous
        </Button>
        
        {currentStep < 4 ? (
          <Button onClick={handleNextStep} className="bg-green-500 hover:bg-green-600">
            Next
          </Button>
        ) : (
          <Button onClick={handleSaveEntry} className="bg-green-500 hover:bg-green-600">
            Save Entry
          </Button>
        )}
      </div>

      {/* Existing entries */}
      {scope2Data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Existing Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-3 font-semibold">Location</th>
                    <th className="py-2 px-3 font-semibold">Provider</th>
                    <th className="py-2 px-3 font-semibold">Month</th>
                    <th className="py-2 px-3 font-semibold">Quantity (kWh)</th>
                    <th className="py-2 px-3 font-semibold">CO₂e Emissions (kg)</th>
                  </tr>
                </thead>
                <tbody>
                  {scope2Data.map((entry) => (
                    <tr key={entry.id} className="border-b">
                      <td className="py-2 px-3">{entry.office_location_name}</td>
                      <td className="py-2 px-3">{entry.source_of_energy}</td>
                      <td className="py-2 px-3">{entry.month || 'N/A'}</td>
                      <td className="py-2 px-3">{entry.quantity_used?.toFixed(2) || '0'}</td>
                      <td className="py-2 px-3">{entry.emissions_kg_co2?.toFixed(2) || '0'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end mt-8">
        <Button 
          className="bg-green-500 hover:bg-green-600 text-white" 
          variant="default" 
          onClick={() => navigate('/my-esg/environmental/scope-2b')}
        >
          Next &rarr;
        </Button>
      </div>
    </div>
  );
};

export default Scope2aElectricity;
