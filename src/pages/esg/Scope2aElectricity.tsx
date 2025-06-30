
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { ExternalLink } from 'lucide-react';
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
  const [data, setData] = useState(
    MONTHS.map((month) => ({
      month,
      quantityUsed: '',
      serviceProvider: '',
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
              quantityUsed: existing.quantity_used?.toString() || '',
              serviceProvider: existing.source_of_energy || '',
              lastYearEmission: existing.last_year_emission_figures?.toString() || '',
              emissionFactor: provider?.factor || 0,
              sourceLink: provider?.source || ''
            };
          }
          return {
            month,
            quantityUsed: '',
            serviceProvider: '',
            lastYearEmission: '',
            emissionFactor: 0,
            sourceLink: ''
          };
        });
        setData(updatedData);
      } else {
        // Reset data if no existing data for this location
        setData(MONTHS.map((month) => ({
          month,
          quantityUsed: '',
          serviceProvider: '',
          lastYearEmission: '',
          emissionFactor: 0,
          sourceLink: ''
        })));
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
        const updated = { ...row, [field]: value };
        
        if (field === 'serviceProvider') {
          const provider = SERVICE_PROVIDERS.find(p => p.name === value);
          if (provider) {
            updated.emissionFactor = provider.factor;
            updated.sourceLink = provider.source;
          }
        }
        
        return updated;
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
        .filter(row => row.quantityUsed || row.serviceProvider || row.lastYearEmission)
        .map(row => ({
          user_id: user.id,
          office_location_id: selectedLocation,
          month: row.month,
          source_of_energy: row.serviceProvider,
          unit_of_measurement: 'KWh',
          quantity_used: row.quantityUsed ? parseFloat(row.quantityUsed) : null,
          last_year_emission_figures: row.lastYearEmission ? parseFloat(row.lastYearEmission) : null,
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

  if (loading) {
    return <div className="max-w-6xl mx-auto p-6">Loading...</div>;
  }

  return (
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

      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto mb-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead>Quantity Used</TableHead>
              <TableHead>Service Provider</TableHead>
              <TableHead>GHG Emission Factor</TableHead>
              <TableHead>Last Year Emission Figure</TableHead>
              <TableHead>Unit Of Measurement</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={row.month}>
                <TableCell className="font-medium">{row.month}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={row.quantityUsed}
                    onChange={(e) => handleInputChange(index, 'quantityUsed', e.target.value)}
                    className="w-32"
                  />
                </TableCell>
                <TableCell>
                  <Select value={row.serviceProvider} onValueChange={(value) => handleInputChange(index, 'serviceProvider', value)}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {SERVICE_PROVIDERS.map((provider) => (
                        <SelectItem key={provider.name} value={provider.name}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{row.emissionFactor}</span>
                    {row.sourceLink && (
                      <a 
                        href={row.sourceLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-800"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
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
      </div>

      <div className="flex justify-between items-center">
        <Button 
          onClick={handleSave} 
          disabled={saving}
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
  );
};

export default Scope2aElectricity;
