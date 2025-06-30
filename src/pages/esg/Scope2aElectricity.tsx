import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { ExternalLink, Info, Upload, Trash2 } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { supabase } from '../../integrations/supabase/client';
import { useAuthContext } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const SERVICE_PROVIDERS = [
  { 
    name: 'Hong Kong Electric', 
    factor: 0.6, 
    source: 'https://www.hkelectric.com/documents/en/InvestorRelations/InvestorRelations_GLNCS/Documents/2025/ESR2024%20full%20version.pdf',
    factorPriorYear: 0.66,
    sourcePriorYear: 'https://www.hkelectric.com/documents/en/CorporateSocialResponsibility/CorporateSocialResponsibility_CDD/Documents/SR2023E.pdf'
  },
  { 
    name: 'CLP Power Hong Kong Limited (CLP)', 
    factor: 0.38, 
    source: 'https://sustainability.clpgroup.com/en/2024/esg-data-hub',
    factorPriorYear: 0.39,
    sourcePriorYear: 'https://www.clp.com.cn/wp-content/uploads/2024/03/CLP_Sustainability_Report_2023_en-1.pdf'
  }
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
  const [providePriorYear, setProvidePriorYear] = useState<string>('');
  const [organizationArea, setOrganizationArea] = useState<string>('');
  const [totalBuildingArea, setTotalBuildingArea] = useState<string>('');
  
  const [data, setData] = useState(
    MONTHS.map((month) => ({
      month,
      invoiceQuantity: '',
      invoiceQuantityPriorYear: '',
      totalBuildingElectricity: '',
      emissionFactor: 0,
      sourceLink: '',
      invoiceFile: null as File | null,
      invoiceFileUrl: ''
    }))
  );
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<{[key: string]: boolean}>({});

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
              invoiceQuantity: existing.quantity_used?.toString() || '',
              invoiceQuantityPriorYear: (existing as any).invoice_quantity_prior_year?.toString() || '',
              totalBuildingElectricity: (existing as any).total_building_electricity?.toString() || '',
              emissionFactor: provider?.factor || 0,
              sourceLink: provider?.source || '',
              invoiceFile: null,
              invoiceFileUrl: (existing as any).invoice_file_url || ''
            };
          }
          return {
            month,
            invoiceQuantity: '',
            invoiceQuantityPriorYear: '',
            totalBuildingElectricity: '',
            emissionFactor: 0,
            sourceLink: '',
            invoiceFile: null,
            invoiceFileUrl: ''
          };
        });
        setData(updatedData);
        
        // Load questionnaire answers if they exist
        if (existingData[0]) {
          setServiceProvider(existingData[0].source_of_energy || '');
          setReceivesBillsDirectly((existingData[0] as any).receives_bills_directly || '');
          setProvidePriorYear((existingData[0] as any).provide_prior_year ? 'Yes' : 'No');
          setOrganizationArea((existingData[0] as any).organization_area?.toString() || '');
          setTotalBuildingArea((existingData[0] as any).total_building_area?.toString() || '');
        }
      } else {
        // Reset all data if no existing data for this location
        setData(MONTHS.map((month) => ({
          month,
          invoiceQuantity: '',
          invoiceQuantityPriorYear: '',
          totalBuildingElectricity: '',
          emissionFactor: 0,
          sourceLink: '',
          invoiceFile: null,
          invoiceFileUrl: ''
        })));
        setServiceProvider('');
        setReceivesBillsDirectly('');
        setProvidePriorYear('');
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

  const handleFileUpload = async (monthIndex: number, file: File) => {
    if (!user || !selectedLocation) return;
    
    const monthName = MONTHS[monthIndex];
    setUploading(prev => ({ ...prev, [monthName]: true }));
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${selectedLocation}/${monthName}_${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('invoice-uploads')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('invoice-uploads')
        .getPublicUrl(fileName);

      setData(prev => prev.map((row, index) => {
        if (index === monthIndex) {
          return { ...row, invoiceFile: file, invoiceFileUrl: publicUrl };
        }
        return row;
      }));

      toast({
        title: "Success",
        description: "Invoice uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload invoice",
        variant: "destructive",
      });
    } finally {
      setUploading(prev => ({ ...prev, [monthName]: false }));
    }
  };

  const handleFileDelete = async (monthIndex: number) => {
    const monthName = MONTHS[monthIndex];
    const row = data[monthIndex];
    
    if (row.invoiceFileUrl) {
      try {
        // Extract file path from URL
        const urlParts = row.invoiceFileUrl.split('/');
        const fileName = urlParts.slice(-3).join('/'); // user_id/location_id/filename
        
        const { error } = await supabase.storage
          .from('invoice-uploads')
          .remove([fileName]);

        if (error) throw error;
      } catch (error) {
        console.error('Error deleting file:', error);
      }
    }

    setData(prev => prev.map((row, index) => {
      if (index === monthIndex) {
        return { ...row, invoiceFile: null, invoiceFileUrl: '' };
      }
      return row;
    }));

    toast({
      title: "Success",
      description: "Invoice deleted successfully",
    });
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

    if (!serviceProvider || !receivesBillsDirectly || !providePriorYear) {
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
        .filter(row => row.invoiceQuantity || row.totalBuildingElectricity || row.invoiceQuantityPriorYear)
        .map(row => ({
          user_id: user.id,
          office_location_id: selectedLocation,
          month: row.month,
          source_of_energy: serviceProvider,
          unit_of_measurement: 'KWh',
          quantity_used: row.invoiceQuantity ? parseFloat(row.invoiceQuantity) : null,
          total_building_electricity: row.totalBuildingElectricity ? parseFloat(row.totalBuildingElectricity) : null,
          invoice_quantity_prior_year: row.invoiceQuantityPriorYear ? parseFloat(row.invoiceQuantityPriorYear) : null,
          receives_bills_directly: receivesBillsDirectly,
          provide_prior_year: providePriorYear === 'Yes',
          organization_area: organizationArea ? parseFloat(organizationArea) : null,
          total_building_area: totalBuildingArea ? parseFloat(totalBuildingArea) : null,
          invoice_file_url: row.invoiceFileUrl || null,
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

  const showTable = serviceProvider && receivesBillsDirectly && providePriorYear;
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Do you want to provide prior year's Carbon Emission equivalent?
              </label>
              <Select value={providePriorYear} onValueChange={setProvidePriorYear}>
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
                  <TableHead>Invoice Quantity</TableHead>
                  <TableHead>Unit Of Measurement</TableHead>
                  {providePriorYear === 'Yes' && <TableHead>Invoice Quantity: Prior Year</TableHead>}
                  <TableHead>Upload Monthly Invoice</TableHead>
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
                        value={row.invoiceQuantity}
                        onChange={(e) => handleInputChange(index, 'invoiceQuantity', e.target.value)}
                        className="w-32"
                      />
                    </TableCell>
                    <TableCell>KWh</TableCell>
                    {providePriorYear === 'Yes' && (
                      <TableCell>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={row.invoiceQuantityPriorYear}
                          onChange={(e) => handleInputChange(index, 'invoiceQuantityPriorYear', e.target.value)}
                          className="w-32"
                        />
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {!row.invoiceFileUrl ? (
                          <div className="relative">
                            <input
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleFileUpload(index, file);
                              }}
                              className="hidden"
                              id={`file-${index}`}
                            />
                            <label
                              htmlFor={`file-${index}`}
                              className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white rounded cursor-pointer hover:bg-blue-600 text-sm"
                            >
                              <Upload className="h-3 w-3" />
                              {uploading[row.month] ? 'Uploading...' : 'Upload'}
                            </label>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <a
                              href={row.invoiceFileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-green-600 hover:text-green-800 text-sm"
                            >
                              View Invoice
                            </a>
                            <button
                              onClick={() => handleFileDelete(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </TableCell>
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
