
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

const CHEMICAL_SOURCES = [
  'Ammonia (NH3)',
  'Methanol',
  'Chlorine (Cl2)',
  'Hydrochloric Acid (HCl)',
  'Nitrogen (N2)',
  'Ethylene (C2H4)',
  'Sulfuric Acid (H2SO4)',
  'Sodium Hydroxide (NaOH)',
  'Propylene (C3H6)',
  'Phosphoric Acid (H3PO4)',
];

const UNITS = ['Kg', 'Litres', 'Units'];

const ProcessEmissions = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [usesChemicals, setUsesChemicals] = useState(true);
  const [records, setRecords] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [modalData, setModalData] = useState({
    source_of_energy: '',
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
        .from('process_emissions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRecords(data || []);
    } catch (error) {
      console.error('Error fetching process emissions:', error);
      toast({
        title: "Error",
        description: "Failed to load process emissions data",
        variant: "destructive",
      });
    }
  };

  const openModal = (record = null) => {
    if (record) {
      setEditingRecord(record);
      setModalData({
        source_of_energy: record.source_of_energy,
        quantity_used: record.quantity_used?.toString() || '',
        last_year_emission_figures: record.last_year_emission_figures?.toString() || '',
        unit_of_measurement: record.unit_of_measurement || 'Kg',
      });
    } else {
      setEditingRecord(null);
      setModalData({
        source_of_energy: '',
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
    if (!modalData.source_of_energy || !user) return;

    try {
      const recordData = {
        user_id: user.id,
        source_of_energy: modalData.source_of_energy,
        quantity_used: modalData.quantity_used ? parseFloat(modalData.quantity_used) : null,
        last_year_emission_figures: modalData.last_year_emission_figures ? parseFloat(modalData.last_year_emission_figures) : null,
        unit_of_measurement: modalData.unit_of_measurement,
      };

      if (editingRecord) {
        const { error } = await supabase
          .from('process_emissions')
          .update(recordData)
          .eq('id', editingRecord.id);

        if (error) throw error;
        toast({
          title: "Success",
          description: "Process emission record updated successfully",
        });
      } else {
        const { error } = await supabase
          .from('process_emissions')
          .insert([recordData]);

        if (error) throw error;
        toast({
          title: "Success", 
          description: "Process emission record created successfully",
        });
      }

      setModalOpen(false);
      fetchRecords();
    } catch (error) {
      console.error('Error saving process emission:', error);
      toast({
        title: "Error",
        description: "Failed to save process emission record",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
      const { error } = await supabase
        .from('process_emissions')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Process emission record deleted successfully",
      });
      fetchRecords();
    } catch (error) {
      console.error('Error deleting process emission:', error);
      toast({
        title: "Error",
        description: "Failed to delete process emission record",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">Activities related to physical or chemical processing within the Company premises (process emissions)</h1>
      <p className="text-lg text-gray-700 mb-4">Do you use chemicals in your company owned/controlled factory?</p>
      <div className="flex items-center gap-3 mb-6">
        <Switch checked={usesChemicals} onCheckedChange={setUsesChemicals} />
        <span className="text-lg font-medium">{usesChemicals ? 'Yes' : 'No'}</span>
      </div>
      <Accordion type="single" collapsible defaultValue="instructions" className="mb-6">
        <AccordionItem value="instructions">
          <AccordionTrigger className="text-base font-semibold">Instructions</AccordionTrigger>
          <AccordionContent>
            <div className="text-gray-700">Please fill in the details for each chemical source that applies to your business.</div>
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
              <TableHead>Source Of Energy</TableHead>
              <TableHead>Quantity Used</TableHead>
              <TableHead>Last Year Emission Figures</TableHead>
              <TableHead>Unit Of Measurement</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {records.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-gray-500">No Process Emissions</TableCell>
              </TableRow>
            ) : (
              records.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.source_of_energy}</TableCell>
                  <TableCell>{record.quantity_used || '-'}</TableCell>
                  <TableCell>{record.last_year_emission_figures || '-'}</TableCell>
                  <TableCell>{record.unit_of_measurement}</TableCell>
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
        <Button className="bg-green-500 hover:bg-green-600 text-white px-8" onClick={() => navigate('/my-esg/environmental/scope-1/mobile-combustion')}>
          Next
        </Button>
      </div>
      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-2xl" onClick={closeModal}>&times;</button>
            <h2 className="text-lg font-semibold mb-4">{editingRecord ? 'Edit Record' : 'Create Record'}</h2>
            <form onSubmit={handleModalSubmit}>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Source of Energy</label>
                <Select value={modalData.source_of_energy} onValueChange={v => handleModalChange('source_of_energy', v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select chemical source" />
                  </SelectTrigger>
                  <SelectContent>
                    {CHEMICAL_SOURCES.map((source) => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
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

export default ProcessEmissions;
