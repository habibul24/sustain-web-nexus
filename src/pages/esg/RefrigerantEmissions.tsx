
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Switch } from '../../components/ui/switch';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../../components/ui/select';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../components/ui/accordion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { useToast } from '../../hooks/use-toast';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../hooks/useAuth';

const REFRIGERANT_TYPES = [
  'R-401A',
  'R-401B',
  'R-401C',
  'R-402A',
  'R-402B',
  'R-403B',
  'R-404A',
  'R-406A',
  'R-407A',
  'R-407B',
  'R-407C',
  'R-407D',
  'R-408A',
  'R-409A',
  'R-410A',
  'R-410B',
  'R-411A',
  'R-411B',
  'R-414A',
  'R-414B',
  'R-417A',
  'R-422A',
  'R-422D',
  'R-424A',
  'R-426A',
  'R-428A',
  'R-434A',
  'R-507A',
  'R-508A',
  'R-508B',
  'HFC-23',
  'HFC-32',
  'HFC-41',
  'HFC-125',
  'HFC-134',
  'HFC-134a',
  'HFC-143',
  'HFC-143a',
  'HFC-152',
  'HFC-152a',
  'HFC-161',
  'HFC-227ea',
  'HFC-236cb',
  'HFC-236ea',
  'HFC-236fa',
  'HFC-245ca',
  'HFC-245fa',
  'HFC-365mfc',
  'HFC-43-10mee',
];

const UNITS = ['Kg', 'Litres', 'Units'];

const RefrigerantEmissions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [hasRefrigerant, setHasRefrigerant] = useState(true);
  const [records, setRecords] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [modalData, setModalData] = useState({
    refrigerant_type: '',
    quantity_used: '',
    last_year_emission_figures: '',
    unit_of_measurement: 'Kg',
  });

  useEffect(() => {
    if (user) {
      fetchRecords();
    }
  }, [user]);

  const fetchRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('refrigerant_emissions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching refrigerant emissions:', error);
      toast({
        title: "Error",
        description: "Failed to load refrigerant emissions data",
        variant: "destructive",
      });
    }
  };

  const openModal = (record = null) => {
    if (record) {
      setEditingRecord(record);
      setModalData({
        refrigerant_type: record.refrigerant_type,
        quantity_used: record.quantity_used?.toString() || '',
        last_year_emission_figures: record.last_year_emission_figures?.toString() || '',
        unit_of_measurement: record.unit_of_measurement || 'Kg',
      });
    } else {
      setEditingRecord(null);
      setModalData({
        refrigerant_type: '',
        quantity_used: '',
        last_year_emission_figures: '',
        unit_of_measurement: 'Kg',
      });
    }
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingRecord(null);
  };

  const handleModalChange = (field, value) => {
    setModalData((prev) => ({ ...prev, [field]: value }));
  };

  const handleModalSubmit = async (e) => {
    e.preventDefault();
    if (!modalData.refrigerant_type || !user) return;

    try {
      const recordData = {
        user_id: user.id,
        refrigerant_type: modalData.refrigerant_type,
        quantity_used: modalData.quantity_used ? parseFloat(modalData.quantity_used) : null,
        last_year_emission_figures: modalData.last_year_emission_figures ? parseFloat(modalData.last_year_emission_figures) : null,
        unit_of_measurement: modalData.unit_of_measurement,
      };

      if (editingRecord) {
        const { error } = await supabase
          .from('refrigerant_emissions')
          .update(recordData)
          .eq('id', editingRecord.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Refrigerant emission record updated successfully. Emission factors have been automatically calculated.",
        });
      } else {
        const { error } = await supabase
          .from('refrigerant_emissions')
          .insert([recordData]);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Refrigerant emission record created successfully. Emission factors have been automatically calculated.",
        });
      }

      setModalOpen(false);
      fetchRecords();
    } catch (error) {
      console.error('Error saving refrigerant emission:', error);
      toast({
        title: "Error",
        description: "Failed to save refrigerant emission record",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      const { error } = await supabase
        .from('refrigerant_emissions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Refrigerant emission record deleted successfully",
      });
      fetchRecords();
    } catch (error) {
      console.error('Error deleting refrigerant emission:', error);
      toast({
        title: "Error",
        description: "Failed to delete refrigerant emission record",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Refrigerant Releases from Air-conditioning and Refrigeration Equipment</h1>
      <p className="text-lg text-gray-700 mb-4">Does your Company use any refrigerants in air-conditioning or refrigeration equipment?</p>
      <div className="flex items-center gap-3 mb-6">
        <Switch checked={hasRefrigerant} onCheckedChange={setHasRefrigerant} />
        <span className="text-lg font-medium">{hasRefrigerant ? 'Yes' : 'No'}</span>
      </div>
      <Accordion type="single" collapsible className="mb-6">
        <AccordionItem value="instructions">
          <AccordionTrigger className="text-base font-semibold">Instructions</AccordionTrigger>
          <AccordionContent>
            <div className="text-gray-700">Please fill in the details for each refrigerant that applies to your business. Emission factors will be automatically calculated based on the refrigerant type selected.</div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="bg-white rounded-xl shadow p-4 overflow-x-auto">
        <div className="flex justify-end mb-2">
          <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={() => openModal()}>Create record</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Refrigerant Type</TableHead>
              <TableHead>Quantity Used</TableHead>
              <TableHead>Last Year Emission Figures</TableHead>
              <TableHead>Unit Of Measurement</TableHead>
              <TableHead>Emission Factor</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">No Refrigerant Releases</TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.refrigerant_type}</TableCell>
                  <TableCell>{record.quantity_used || '-'}</TableCell>
                  <TableCell>{record.last_year_emission_figures || '-'}</TableCell>
                  <TableCell>{record.unit_of_measurement}</TableCell>
                  <TableCell>{record.emission_factor || 'Auto-calculated'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openModal(record)}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(record.id)}>Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-end mt-6">
        <Button className="bg-green-500 hover:bg-green-600 text-white px-8" onClick={() => navigate('/my-esg/environmental/scope-1-result')}>Next</Button>
      </div>
      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-2xl" onClick={closeModal}>&times;</button>
            <h2 className="text-lg font-semibold mb-4">{editingRecord ? 'Edit Record' : 'Create Record'}</h2>
            <form onSubmit={handleModalSubmit}>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Refrigerant type</label>
                <Select value={modalData.refrigerant_type} onValueChange={v => handleModalChange('refrigerant_type', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                  </SelectTrigger>
                  <SelectContent>
                    {REFRIGERANT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Quantity Used</label>
                <Input
                  type="number"
                  min="0"
                  step="0.0001"
                  value={modalData.quantity_used}
                  onChange={e => handleModalChange('quantity_used', e.target.value)}
                  placeholder="Enter quantity"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Last Year Emission Figures</label>
                <Input
                  type="number"
                  min="0"
                  step="0.0001"
                  value={modalData.last_year_emission_figures}
                  onChange={e => handleModalChange('last_year_emission_figures', e.target.value)}
                  placeholder="Enter last year figures"
                />
              </div>
              <div className="mb-6">
                <label className="block mb-2 font-medium">Unit of Measurement</label>
                <Select value={modalData.unit_of_measurement} onValueChange={v => handleModalChange('unit_of_measurement', v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map(unit => (
                      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mb-4 text-sm text-gray-600 bg-blue-50 p-3 rounded">
                <strong>Note:</strong> Emission factors will be automatically calculated based on the selected refrigerant type.
              </div>
              <div className="flex gap-3">
                <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">
                  {editingRecord ? 'Update' : 'Submit'}
                </Button>
                <Button type="button" variant="secondary" onClick={closeModal}>Cancel</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RefrigerantEmissions;
