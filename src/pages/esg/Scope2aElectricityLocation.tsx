
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from '../../components/ui/use-toast';
import { supabase } from '../../integrations/supabase/client';
import { useAuthContext } from '../../contexts/AuthContext';

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
  invoice_file_url?: string | null;
}

const Scope2aElectricity = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [scope2Data, setScope2Data] = useState<Scope2Data[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<Scope2Data>({
    id: '',
    source_of_energy: '',
    quantity_used: null,
    quantity_used_prior_year: null,
    emission_factor: null,
    emission_factor_prior_year: null,
    emissions_kg_co2: null,
    office_location_id: null,
    office_location_name: '',
    month: null,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchScope2Data();
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
          month,
          invoice_file_url,
          office_locations!inner(name)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedData = data?.map(item => ({
        ...item,
        office_location_name: (item as any).office_locations?.name || 'Unknown Location'
      })) || [];

      setScope2Data(formattedData);
    } catch (error) {
      console.error('Error fetching Scope 2 data:', error);
      toast({
        title: "Error!",
        description: "Failed to fetch scope 2 data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false);
    }
  };

  const calculateCO2Emission = (item: Scope2Data) => {
    if (!item.quantity_used || !item.emission_factor) return 0;
    return item.quantity_used * item.emission_factor;
  };

  const handleEdit = (row: Scope2Data) => {
    setEditMode(row.id);
    setEditedData(row);
  };

  const handleCancelEdit = () => {
    setEditMode(null);
  };

  const handleSaveEdit = async () => {
    try {
      const { data, error } = await supabase
        .from('scope2a_electricity')
        .update({
          source_of_energy: editedData.source_of_energy,
          quantity_used: editedData.quantity_used,
          quantity_used_prior_year: editedData.quantity_used_prior_year,
          emission_factor: editedData.emission_factor,
          emission_factor_prior_year: editedData.emission_factor_prior_year,
          month: editedData.month,
        })
        .eq('id', editedData.id);

      if (error) throw error;

      setScope2Data(prevData =>
        prevData.map(item => (item.id === editedData.id ? { ...editedData, office_location_name: item.office_location_name } : item))
      );
      setEditMode(null);
      toast({
        title: "Success",
        description: "Successfully updated the data.",
      })
    } catch (error) {
      console.error('Error updating Scope 2 data:', error);
      toast({
        title: "Error!",
        description: "Failed to update scope 2 data. Please try again.",
        variant: "destructive",
      })
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, rowId: string) => {
    const file = e.target.files?.[0];

    if (!file) {
      toast({
        title: "Error!",
        description: "Please select a file to upload.",
        variant: "destructive",
      })
      return;
    }

    try {
      // Delete existing file if it exists
      const existingData = scope2Data.find(item => item.id === rowId);
      if (existingData?.invoice_file_url) {
        await supabase.storage.from('invoice-uploads').remove([existingData.invoice_file_url.split('/').pop()!]);
      }

      // Upload new file
      const filePath = `${user?.id}/${rowId}/${file.name}`;
      const { data, error } = await supabase.storage
        .from('invoice-uploads')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Update database record
      const { error: dbError } = await supabase
        .from('scope2a_electricity')
        .update({ invoice_file_url: filePath } as any)
        .eq('id', rowId);

      if (dbError) {
        throw dbError;
      }

      // Update state
      setScope2Data(prevData =>
        prevData.map(item =>
          item.id === rowId ? { ...item, invoice_file_url: filePath } : item
        )
      );
      toast({
        title: "Success",
        description: "Successfully uploaded the invoice.",
      })
    } catch (error) {
      console.error('File upload error:', error);
      toast({
        title: "Error!",
        description: "Failed to upload invoice. Please try again.",
        variant: "destructive",
      })
    }
  };

  const handleViewFile = (filePath: string) => {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/invoice-uploads/${filePath}`;
    window.open(url, '_blank');
  };

  const handleDeleteFile = async (rowId: string, filePath: string) => {
    try {
      // Delete file from storage
      const { error } = await supabase.storage.from('invoice-uploads').remove([filePath]);
      if (error) {
        throw error;
      }

      // Update database record
      const { error: dbError } = await supabase
        .from('scope2a_electricity')
        .update({ invoice_file_url: null } as any)
        .eq('id', rowId);

      if (dbError) {
        throw dbError;
      }

      // Update state
      setScope2Data(prevData =>
        prevData.map(item => (item.id === rowId ? { ...item, invoice_file_url: null } : item))
      );
      toast({
        title: "Success",
        description: "Successfully deleted the invoice.",
      })
    } catch (error) {
      console.error('File deletion error:', error);
      toast({
        title: "Error!",
        description: "Failed to delete invoice. Please try again.",
        variant: "destructive",
      })
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
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Add New Entry</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="source_of_energy">Description Of Sources</Label>
            <Input type="text" id="source_of_energy" />
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input type="text" id="location" />
          </div>
          <div>
            <Label htmlFor="month">Month</Label>
            <Input type="text" id="month" />
          </div>
          <div>
            <Label htmlFor="invoice_quantity">Invoice Quantity</Label>
            <Input type="number" id="invoice_quantity" />
          </div>
          <div>
            <Label htmlFor="unit_of_measurement">Unit Of Measurement</Label>
            <Input type="text" id="unit_of_measurement" value="kWh" readOnly />
          </div>
          <div>
            <Label htmlFor="invoice_quantity_prior_year">Invoice Quantity: Prior Year</Label>
            <Input type="number" id="invoice_quantity_prior_year" />
          </div>
          <div>
            <Label htmlFor="ghg_emission_factor">GHG Emission Factor</Label>
            <Input type="number" id="ghg_emission_factor" />
          </div>
          <div>
            <Label htmlFor="ghg_emission_factor_prior_year">GHG Emission Factor: Prior Year</Label>
            <Input type="number" id="ghg_emission_factor_prior_year" />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <Button variant="default" className="bg-green-500 hover:bg-green-600 text-white">
              Save
            </Button>
          </div>
        </form>
      </section>
      
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
              <th className="py-2 px-3 font-semibold">GHG Emission Factor</th>
              <th className="py-2 px-3 font-semibold">GHG Emission Factor: Prior Year</th>
              <th className="py-2 px-3 font-semibold">Co2e Carbon Emitted</th>
              <th className="py-2 px-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {scope2Data.length === 0 ? (
              <tr>
                <td colSpan={11} className="text-center py-8 text-gray-500">No data available</td>
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
                  <td className="py-2 px-3">{row.emission_factor?.toFixed(3) || '0'}</td>
                  <td className="py-2 px-3">{row.emission_factor_prior_year?.toFixed(3) || 'N/A'}</td>
                  <td className="py-2 px-3">{calculateCO2Emission(row).toFixed(2)}</td>
                  <td className="py-2 px-3">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(row)}
                      className="text-xs"
                    >
                      Edit
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mb-6 text-gray-700 text-sm">
        Emission Factor Source: <a href="#" className="text-green-700 underline">View Reference</a>
      </div>
      
      <div className="flex justify-end">
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
