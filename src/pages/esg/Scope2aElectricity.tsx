
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { ExternalLink, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { supabase } from '../../integrations/supabase/client';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const SERVICE_PROVIDERS = [
  { name: 'Hong Kong Electric', factor: 0.66, source: 'https://www.hkelectric.com/documents/en/CorporateSocialResponsibility/CorporateSocialResponsibility_CDD/Documents/SR2023E.pdf' },
  { name: 'CLP Power Hong Kong Limited (CLP)', factor: 0.39, source: 'https://www.clp.com.cn/wp-content/uploads/2024/03/CLP_Sustainability_Report_2023_en-1.pdf' }
];

interface OfficeLocation {
  id: string;
  name: string;
  address: string;
}

const Scope2aElectricity = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [officeLocations, setOfficeLocations] = useState<OfficeLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  
  // New state for questionnaire
  const [serviceProvider, setServiceProvider] = useState<string>('');
  const [receivesBillsDirectly, setReceivesBillsDirectly] = useState<string>('');
  const [organizationArea, setOrganizationArea] = useState<string>('');
  const [totalBuildingArea, setTotalBuildingArea] = useState<string>('');
  
  const [data, setData] = useState(
    MONTHS.map((month) => ({
      month,
      companyElectricityQuantity: '',
      totalBuildingElectricity: '',
      lastYearEmission: '',
      emissionFactor: 0,
      sourceLink: ''
    }))
  );
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadOfficeLocations();
    }
  }, [user]);

  useEffect(() => {
    if (selectedLocation) {
      loadExistingData();
    }
  }, [selectedLocation]);

  useEffect(() => {
    if (serviceProvider) {
      const provider = SERVICE_PROVIDERS.find(p => p.name === serviceProvider);
      if (provider) {
        setData(prev => prev.map(row => ({
          ...row,
          emissionFactor: provider.factor,
          sourceLink: provider.source
        })));
      }
    }
  }, [serviceProvider]);

  const loadOfficeLocations = async () => {
    try {
      const { data: locations, error } = await supabase
        .from('office_locations')
        .select('*')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;

      if (locations && locations.length > 0) {
        setOfficeLocations(locations);
        setSelectedLocation(locations[0].id);
      } else {
        // If no office locations, create a default "Main Office" entry
        const { data: newLocation, error: createError } = await supabase
          .from('office_locations')
          .insert({
            user_id: user.id,
            name: 'Main Office',
            address: 'Default Location'
          })
          .select()
          .single();

        if (createError) throw createError;
        
        setOfficeLocations([newLocation]);
        setSelectedLocation(newLocation.id);
      }
    } catch (error) {
      console.error('Error loading office locations:', error);
      toast({
        title: "Error",
        description: "Failed to load office locations",
        variant: "destructive",
      });
    }
  };

  const loadExistingData = async () => {
    if (!selectedLocation) return;
    
    setLoading(true);
    try {
      const { data: existingData, error } = await supabase
        .from('scope2a_electricity')
        .select('*')
        .eq('user_id', user.id)
        .eq('office_location_id', selectedLocation);

      if (error) throw error;

      if (existingData && existingData.length > 0) {
        const updatedData = MONTHS.map((month) => {
          const existing = existingData.find(d => d.month === month);
          if (existing) {
            const provider = SERVICE_PROVIDERS.find(p => p.name === existing.source_of_energy);
            return {
              month,
              companyElectricityQuantity: existing.quantity_used?.toString() || '',
              totalBuildingElectricity: existing.total_building_electricity?.toString() || '',
              lastYearEmission: existing.last_year_emission_figures?.toString() || '',
              emissionFactor: provider?.factor || 0,
              sourceLink: provider?.source || ''
            };
          }
          return {
            month,
            companyElectricityQuantity: '',
            totalBuildingElectricity: '',
            lastYearEmission: '',
            emissionFactor: 0,
            sourceLink: ''
          };
        });
        setData(updatedData);
        
        // Load questionnaire answers if they exist
        if (existingData[0]) {
          setServiceProvider(existingData[0].source_of_energy || '');
          setReceivesBillsDirectly(existingData[0].receives_bills_directly || '');
          setOrganizationArea(existingData[0].organization_area?.toString() || '');
          setTotalBuildingArea(existingData[0].total_building_area?.toString() || '');
        }
      } else {
        // Reset all data if no existing data for this location
        setData(MONTHS.map((month) => ({
          month,
          companyElectricityQuantity: '',
          totalBuildingElectricity: '',
          lastYearEmission: '',
          emissionFactor: 0,
          sourceLink: ''
        })));
        setServiceProvider('');
        setReceivesBillsDirectly('');
        setOrganizationArea('');
        setTotalBuildingArea('');
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load existing data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (monthIndex, field, value) => {
    setData(prev => prev.map((row, index) => {
      if (index === monthIndex) {
        return { ...row, [field]: value };
      }
      return row;
    }));
  };

  const handleSave = async () => {
    if (!user || !selectedLocation) {
      toast({
        title: "Error",
        description: "You must be logged in and select an office location to save data",
        variant: "destructive",
      });
      return;
    }

    if (!serviceProvider || !receivesBillsDirectly) {
      toast({
        title: "Error",
        description: "Please answer all questionnaire questions before saving",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      // Delete existing data for this user and location
      await supabase
        .from('scope2a_electricity')
        .delete()
        .eq('user_id', user.id)
        .eq('office_location_id', selectedLocation);

      // Insert new data
      const dataToInsert = data
        .filter(row => row.companyElectricityQuantity || row.totalBuildingElectricity || row.lastYearEmission)
        .map(row => ({
          user_id: user.id,
          office_location_id: selectedLocation,
          month: row.month,
          source_of_energy: serviceProvider,
          unit_of_measurement: 'KWh',
          quantity_used: row.companyElectricityQuantity ? parseFloat(row.companyElectricityQuantity) : null,
          total_building_electricity: row.totalBuildingElectricity ? parseFloat(row.totalBuildingElectricity) : null,
          last_year_emission_figures: row.lastYearEmission ? parseFloat(row.lastYearEmission) : null,
          receives_bills_directly: receivesBillsDirectly,
          organization_area: organizationArea ? parseFloat(organizationArea) : null,
          total_building_area: totalBuildingArea ? parseFloat(totalBuildingArea) : null,
          is_applicable: true,
          data_source: 'manual'
        }));

      if (dataToInsert.length > 0) {
        const { error } = await supabase
          .from('scope2a_electricity')
          .insert(dataToInsert);

        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Data saved successfully",
      });
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: "Error",
        description: "Failed to save data",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const currentEmissionFactor = SERVICE_PROVIDERS.find(p => p.name === serviceProvider)?.factor || 0;
  const currentSourceLink = SERVICE_PROVIDERS.find(p => p.name === serviceProvider)?.source || '';

  if (loading) {
    return <div className="max-w-6xl mx-auto p-6">Loading...</div>;
  }

  const showTable = serviceProvider && receivesBillsDirectly;
  const showAreaInputs = receivesBillsDirectly === 'No';

  return (
    <TooltipProvider>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Scope 2a Electricity Carbon Emission Calculations</h1>
        
        <Accordion type="single" collapsible defaultValue="info" className="mb-6">
          <AccordionItem value="info">
            <AccordionTrigger className="text-base font-semibold">What are Scope 2a emissions?</AccordionTrigger>
            <AccordionContent>
              <div className="text-gray-700">
                Scope 2a emissions are GHG emissions from the generation of purchased electricity that is consumed in your Company's owned or controlled equipment. These emissions are considered indirect because they occur at the facility where the electricity is generated, but the energy produced is used by you.
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {officeLocations.length > 1 && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Office Location
            </label>
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select office location" />
              </SelectTrigger>
              <SelectContent>
                {officeLocations.map((location) => (
                  <SelectItem key={location.id} value={location.id}>
                    {location.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Questionnaire Section */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Electricity Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What is your electricity service provider?
              </label>
              <Select value={serviceProvider} onValueChange={setServiceProvider}>
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue placeholder="Select service provider" />
                </SelectTrigger>
                <SelectContent>
                  {SERVICE_PROVIDERS.map((provider) => (
                    <SelectItem key={provider.name} value={provider.name}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Do you receive electricity bills directly?
              </label>
              <Select value={receivesBillsDirectly} onValueChange={setReceivesBillsDirectly}>
                <SelectTrigger className="w-full max-w-md">
                  <SelectValue placeholder="Select Yes or No" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Yes">Yes</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {showAreaInputs && (
              <div className="space-y-4 mt-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-800">Provide the following information:</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    1. Area of Organization Space
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={organizationArea}
                    onChange={(e) => setOrganizationArea(e.target.value)}
                    className="w-full max-w-md"
                    placeholder="Enter area in square meters"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    2. Total Building Area
                  </label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={totalBuildingArea}
                    onChange={(e) => setTotalBuildingArea(e.target.value)}
                    className="w-full max-w-md"
                    placeholder="Enter total building area"
                  />
                  <div className="flex items-center mt-2">
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-blue-500" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Request the monthly total electricity figures of the building from the facility manager.</p>
                      </TooltipContent>
                    </Tooltip>
                    <span className="ml-2 text-sm text-gray-600">Request the monthly total electricity figures of the building from the facility manager.</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {showTable && (
          <div className="bg-white rounded-xl shadow p-4 overflow-x-auto mb-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  {receivesBillsDirectly === 'No' && <TableHead>Total Building Electricity</TableHead>}
                  <TableHead>Company Electricity Quantity</TableHead>
                  <TableHead>GHG Emission Factor</TableHead>
                  <TableHead>Last Year Emission Figure</TableHead>
                  <TableHead>Unit Of Measurement</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={row.month}>
                    <TableCell className="font-medium">{row.month}</TableCell>
                    {receivesBillsDirectly === 'No' && (
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={row.totalBuildingElectricity}
                          onChange={(e) => handleInputChange(index, 'totalBuildingElectricity', e.target.value)}
                          className="w-32"
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={row.companyElectricityQuantity}
                        onChange={(e) => handleInputChange(index, 'companyElectricityQuantity', e.target.value)}
                        className="w-32"
                      />
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{currentEmissionFactor}</span>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={row.lastYearEmission}
                        onChange={(e) => handleInputChange(index, 'lastYearEmission', e.target.value)}
                        className="w-32"
                      />
                    </TableCell>
                    <TableCell>KWh</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {currentSourceLink && (
              <div className="mt-4 flex items-center">
                <button
                  onClick={() => window.open(currentSourceLink, '_blank')}
                  className="flex items-center gap-2 text-green-600 hover:text-green-800 text-sm"
                >
                  <Info className="h-4 w-4" />
                  Click here for source of emission factor
                  <ExternalLink className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center">
          <Button 
            onClick={handleSave} 
            disabled={saving || !showTable}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8"
          >
            {saving ? 'Saving...' : 'Save Data'}
          </Button>
          
          <Button 
            className="bg-green-500 hover:bg-green-600 text-white px-8" 
            onClick={() => navigate('/my-esg/environmental/scope-2/other-energy')}
          >
            Next
          </Button>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Scope2aElectricity;
