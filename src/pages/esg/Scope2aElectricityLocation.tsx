import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { useToast } from '../../components/ui/use-toast';
import { useAuthContext } from '../../contexts/AuthContext';
import { supabase } from '../../integrations/supabase/client';

interface Scope2Data {
  id: string;
  source_of_energy: string;
  quantity_used: number | null;
  quantity_used_prior_year: number | null;
  emission_factor: number | null;
  emission_factor_prior_year: number | null;
  emissions_kg_co2: number | null;
  organization_area: number | null;
  total_building_area: number | null;
  office_location_id: string;
  office_location_name?: string;
  month: string | null;
  invoice_file_url: string | null;
}

const Scope2aElectricityLocation = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [scope2Data, setScope2Data] = useState<Scope2Data[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [sourceOfEnergy, setSourceOfEnergy] = useState('');
	const [quantityUsed, setQuantityUsed] = useState<number | null>(null);
	const [quantityUsedPriorYear, setQuantityUsedPriorYear] = useState<number | null>(null);
  const [emissionFactor, setEmissionFactor] = useState<number | null>(null);
  const [emissionFactorPriorYear, setEmissionFactorPriorYear] = useState<number | null>(null);
  const [organizationArea, setOrganizationArea] = useState<number | null>(null);
  const [totalBuildingArea, setTotalBuildingArea] = useState<number | null>(null);
  const [officeLocation, setOfficeLocation] = useState('');
  const [month, setMonth] = useState('');
  const [officeLocations, setOfficeLocations] = useState<{ id: string; name: string; }[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      fetchScope2Data();
      fetchOfficeLocations();
    }
  }, [user]);

  const fetchScope2Data = async () => {
    try {
      const { data, error } = await supabase
        .from('scope2a_electricity')
        .select(`
          id,
          source_of_energy,
          quantity_used,
		  quantity_used_prior_year,
          emission_factor,
		  emission_factor_prior_year,
          emissions_kg_co2,
          organization_area,
          total_building_area,
          month,
          office_location_id,
          invoice_file_url,
          office_locations!inner(name)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedData = data?.map(item => ({
        ...item,
        office_location_name: item.office_locations?.name || 'Unknown Location'
      })) || [];

      setScope2Data(formattedData);
    } catch (error) {
      console.error('Error fetching Scope 2 data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOfficeLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('office_locations')
        .select('id, name')
        .eq('user_id', user.id);

      if (error) throw error;

      setOfficeLocations(data || []);
    } catch (error) {
      console.error('Error fetching office locations:', error);
    }
  };

  const calculateCO2Emission = (item: Scope2Data) => {
    if (!item.quantity_used || !item.emission_factor) return 0;
    
    if (item.organization_area && item.total_building_area) {
      return (item.organization_area / item.total_building_area) * item.quantity_used * item.emission_factor;
    }
    
    return item.quantity_used * item.emission_factor;
  };

  const handleEdit = (row: Scope2Data) => {
    setEditingRow(row.id);
    setSourceOfEnergy(row.source_of_energy);
	setQuantityUsed(row.quantity_used);
	setQuantityUsedPriorYear(row.quantity_used_prior_year);
    setEmissionFactor(row.emission_factor);
	setEmissionFactorPriorYear(row.emission_factor_prior_year);
    setOrganizationArea(row.organization_area);
    setTotalBuildingArea(row.total_building_area);
    setOfficeLocation(row.office_location_id);
    setMonth(row.month || '');
  };

  const handleCancel = () => {
    setEditingRow(null);
    setSourceOfEnergy('');
	setQuantityUsed(null);
	setQuantityUsedPriorYear(null);
    setEmissionFactor(null);
	setEmissionFactorPriorYear(null);
    setOrganizationArea(null);
    setTotalBuildingArea(null);
    setOfficeLocation('');
    setMonth('');
  };

  const handleSave = async (id: string) => {
    try {
      const { error } = await supabase
        .from('scope2a_electricity')
        .update({
          source_of_energy: sourceOfEnergy,
          quantity_used: quantityUsed,
		  quantity_used_prior_year: quantityUsedPriorYear,
          emission_factor: emissionFactor,
		  emission_factor_prior_year: emissionFactorPriorYear,
          organization_area: organizationArea,
          total_building_area: totalBuildingArea,
          office_location_id: officeLocation,
          month: month
        })
        .eq('id', id);

      if (error) throw error;

      fetchScope2Data();
      setEditingRow(null);
      toast({
        title: "Success",
        description: "Scope 2 data updated successfully.",
      })
    } catch (error) {
      console.error('Error updating Scope 2 data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update Scope 2 data.",
      })
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, rowId: string) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    try {
      // Delete the old file if it exists
      const rowData = scope2Data.find(row => row.id === rowId);
      if (rowData?.invoice_file_url) {
        await supabase.storage.from('invoice-uploads').remove([rowData.invoice_file_url.split('/').pop()!]);
      }

      // Upload the new file
      const filePath = `${user?.id}/${rowId}/${file.name}`;
      const { data, error } = await supabase.storage
        .from('invoice-uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Update the database record with the new file URL
      const fileUrl = `https://your-supabase-url.supabase.co/storage/v1/object/public/${data.Key}`; // Replace with your actual Supabase URL
      const { error: dbError } = await supabase
        .from('scope2a_electricity')
        .update({ invoice_file_url: filePath })
        .eq('id', rowId);

      if (dbError) throw dbError;

      fetchScope2Data();
      toast({
        title: "Success",
        description: "Invoice uploaded successfully.",
      })
    } catch (error) {
      console.error('Error uploading invoice:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload invoice.",
      })
    }
  };

  const handleViewFile = (fileUrl: string) => {
    const completeFileUrl = `https://your-supabase-url.supabase.co/storage/v1/object/public/invoice-uploads/${fileUrl}`; // Replace with your actual Supabase URL
    window.open(completeFileUrl, '_blank');
  };

  const handleDeleteFile = async (rowId: string, fileUrl: string) => {
    try {
      // Delete the file from storage
      await supabase.storage.from('invoice-uploads').remove([fileUrl.split('/').pop()!]);

      // Update the database record to remove the file URL
      const { error: dbError } = await supabase
        .from('scope2a_electricity')
        .update({ invoice_file_url: null })
        .eq('id', rowId);

      if (dbError) throw dbError;

      fetchScope2Data();
      toast({
        title: "Success",
        description: "Invoice deleted successfully.",
      })
    } catch (error) {
      console.error('Error deleting invoice:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete invoice.",
      })
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Scope 2a Electricity Location-Based</h1>
      
      <div className="mb-4">
        <Label htmlFor="source">Source of Energy</Label>
        <Input
          type="text"
          id="source"
          placeholder="Enter source of energy"
          value={sourceOfEnergy}
          onChange={(e) => setSourceOfEnergy(e.target.value)}
        />
      </div>
      
      <div className="mb-4">
        <Label htmlFor="quantity">Invoice Quantity</Label>
        <Input
          type="number"
          id="quantity"
          placeholder="Enter invoice quantity"
          value={quantityUsed !== null ? quantityUsed.toString() : ''}
          onChange={(e) => setQuantityUsed(e.target.value === '' ? null : parseFloat(e.target.value))}
        />
      </div>

	  <div className="mb-4">
        <Label htmlFor="quantity_used_prior_year">Invoice Quantity Prior Year</Label>
        <Input
          type="number"
          id="quantity_used_prior_year"
          placeholder="Enter invoice quantity prior year"
          value={quantityUsedPriorYear !== null ? quantityUsedPriorYear.toString() : ''}
          onChange={(e) => setQuantityUsedPriorYear(e.target.value === '' ? null : parseFloat(e.target.value))}
        />
      </div>
      
      <div className="mb-4">
        <Label htmlFor="emission">GHG Emission Factor</Label>
        <Input
          type="number"
          id="emission"
          placeholder="Enter GHG emission factor"
          value={emissionFactor !== null ? emissionFactor.toString() : ''}
          onChange={(e) => setEmissionFactor(e.target.value === '' ? null : parseFloat(e.target.value))}
        />
      </div>

	  <div className="mb-4">
        <Label htmlFor="emission_factor_prior_year">GHG Emission Factor Prior Year</Label>
        <Input
          type="number"
          id="emission_factor_prior_year"
          placeholder="Enter GHG emission factor prior year"
          value={emissionFactorPriorYear !== null ? emissionFactorPriorYear.toString() : ''}
          onChange={(e) => setEmissionFactorPriorYear(e.target.value === '' ? null : parseFloat(e.target.value))}
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="organization_area">Organization Area</Label>
        <Input
          type="number"
          id="organization_area"
          placeholder="Enter organization area"
          value={organizationArea !== null ? organizationArea.toString() : ''}
          onChange={(e) => setOrganizationArea(e.target.value === '' ? null : parseFloat(e.target.value))}
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="total_building_area">Total Building Area</Label>
        <Input
          type="number"
          id="total_building_area"
          placeholder="Enter total building area"
          value={totalBuildingArea !== null ? totalBuildingArea.toString() : ''}
          onChange={(e) => setTotalBuildingArea(e.target.value === '' ? null : parseFloat(e.target.value))}
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="office_location">Office Location</Label>
        <Select onValueChange={setOfficeLocation}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select location" />
          </SelectTrigger>
          <SelectContent>
            {officeLocations.map(location => (
              <SelectItem key={location.id} value={location.id}>{location.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="mb-4">
        <Label htmlFor="month">Month</Label>
        <Select onValueChange={setMonth}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="January">January</SelectItem>
            <SelectItem value="February">February</SelectItem>
            <SelectItem value="March">March</SelectItem>
            <SelectItem value="April">April</SelectItem>
            <SelectItem value="May">May</SelectItem>
            <SelectItem value="June">June</SelectItem>
            <SelectItem value="July">July</SelectItem>
            <SelectItem value="August">August</SelectItem>
            <SelectItem value="September">September</SelectItem>
            <SelectItem value="October">October</SelectItem>
            <SelectItem value="November">November</SelectItem>
            <SelectItem value="December">December</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="bg-white rounded-xl shadow p-4 mb-4 overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-3 font-semibold">Description Of Sources</th>
              <th className="py-2 px-3 font-semibold">Location</th>
              <th className="py-2 px-3 font-semibold">Month</th>
              <th className="py-2 px-3 font-semibold">Invoice Quantity</th>
              <th className="py-2 px-3 font-semibold">Upload Monthly Invoice</th>
              <th className="py-2 px-3 font-semibold">Unit Of Measurement</th>
              <th className="py-2 px-3 font-semibold">Invoice Quantity: Prior Year</th>
              <th className="py-2 px-3 font-semibold">Organization Area</th>
              <th className="py-2 px-3 font-semibold">Total Building Area</th>
              <th className="py-2 px-3 font-semibold">GHG Emission Factor</th>
              <th className="py-2 px-3 font-semibold">GHG Emission Factor: Prior Year</th>
              <th className="py-2 px-3 font-semibold">Co2e Carbon Emitted</th>
              <th className="py-2 px-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {scope2Data.length === 0 ? (
              <tr>
                <td colSpan={13} className="text-center py-8 text-gray-500">No data available</td>
              </tr>
            ) : (
              scope2Data.map((row) => (
                <tr key={row.id} className="border-b">
                  <td className="py-2 px-3">{row.source_of_energy}</td>
                  <td className="py-2 px-3">{row.office_location_name}</td>
                  <td className="py-2 px-3">{row.month || 'N/A'}</td>
                  <td className="py-2 px-3">{row.quantity_used?.toFixed(2) || '0'}</td>
                  <td className="py-2 px-3">
                    <div className="flex flex-col gap-2">
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload(e, row.id)}
                        className="text-xs"
                      />
                      {row.invoice_file_url && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewFile(row.invoice_file_url!)}
                            className="text-xs"
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteFile(row.id, row.invoice_file_url!)}
                            className="text-xs text-red-600"
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-3">kWh</td>
                  <td className="py-2 px-3">{row.quantity_used_prior_year?.toFixed(2) || 'N/A'}</td>
                  <td className="py-2 px-3">{row.organization_area?.toFixed(2) || 'N/A'}</td>
                  <td className="py-2 px-3">{row.total_building_area?.toFixed(2) || 'N/A'}</td>
                  <td className="py-2 px-3">{row.emission_factor?.toFixed(3) || '0'}</td>
                  <td className="py-2 px-3">{row.emission_factor_prior_year?.toFixed(3) || 'N/A'}</td>
                  <td className="py-2 px-3">{calculateCO2Emission(row).toFixed(2)}</td>
                  <td className="py-2 px-3">
                    {editingRow === row.id ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSave(row.id)}
                          className="text-xs"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCancel}
                          className="text-xs"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(row)}
                        className="text-xs"
                      >
                        Edit
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <Button variant="default" onClick={() => navigate('/my-esg/environmental/scope-2-result')}>
        Next &rarr;
      </Button>
    </div>
  );
};

export default Scope2aElectricityLocation;
