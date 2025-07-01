import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { supabase } from '../../integrations/supabase/client';
import { useAuthContext } from '../../contexts/AuthContext';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface Scope2Data {
  id: string;
  source_of_energy: string;
  quantity_used: number | null;
  emission_factor: number | null;
  emissions_kg_co2: number | null;
  organization_area: number | null;
  total_building_area: number | null;
  office_location_name: string;
  month: string | null;
  receives_bills_directly: string;
  total_building_electricity: number | null;
}

interface LocationSummary {
  location: string;
  totalQuantity: number;
  emissionFactor: number;
  totalEmission: number;
  receivesBillsDirectly: string;
}

const Scope2Result = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [scope2Data, setScope2Data] = useState<Scope2Data[]>([]);
  const [loading, setLoading] = useState(true);

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
          emission_factor,
          emissions_kg_co2,
          organization_area,
          total_building_area,
          month,
          office_locations!inner(name),
          receives_bills_directly,
          total_building_electricity
        `)
        .eq('user_id', user.id)
        .not('quantity_used', 'is', null);

      if (error) throw error;

      const formattedData = data?.map(item => ({
        ...item,
        office_location_name: (item as any).office_locations?.name || 'Unknown Location'
      })) || [];

      setScope2Data(formattedData);
    } catch (error) {
      console.error('Error fetching Scope 2 data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group data by location and calculate totals
  const getLocationSummaries = (): LocationSummary[] => {
    const locationGroups: Record<string, Scope2Data[]> = {};
    
    // Group by location
    scope2Data.forEach(item => {
      const location = item.office_location_name;
      if (!locationGroups[location]) {
        locationGroups[location] = [];
      }
      locationGroups[location].push(item);
    });

    // Calculate totals for each location
    return Object.entries(locationGroups).map(([location, items]) => {
      // Get the billing method (should be consistent for a location)
      const receivesBillsDirectly = items[0]?.receives_bills_directly || 'yes';
      const emissionFactor = items[0]?.emission_factor || 0;
      
      let totalQuantity = 0;
      let totalEmission = 0;

      if (receivesBillsDirectly === 'yes') {
        // For direct billing: sum up all monthly quantities
        totalQuantity = items.reduce((sum, item) => sum + (item.quantity_used || 0), 0);
        totalEmission = totalQuantity * emissionFactor;
      } else {
        // For indirect billing: use the calculated quantity (should be same for all records)
        const firstItem = items[0];
        if (firstItem && firstItem.organization_area && firstItem.total_building_area && firstItem.total_building_electricity) {
          totalQuantity = (firstItem.organization_area / firstItem.total_building_area) * firstItem.total_building_electricity;
          totalEmission = totalQuantity * emissionFactor;
        }
      }

      return {
        location,
        totalQuantity,
        emissionFactor,
        totalEmission,
        receivesBillsDirectly
      };
    });
  };

  const locationSummaries = getLocationSummaries();

  const getTotalQuantity = () => {
    return locationSummaries.reduce((sum, item) => sum + item.totalQuantity, 0);
  };

  const getTotalEmissions = () => {
    return locationSummaries.reduce((sum, item) => sum + item.totalEmission, 0);
  };

  const getActiveSources = () => {
    return locationSummaries.length;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text('Scope 2 Carbon Emission Results', 14, 22);
    
    // Summary data
    doc.setFontSize(12);
    doc.text(`Total Quantity Till Date: ${getTotalQuantity().toFixed(2)} kWh`, 14, 40);
    doc.text(`Total Active Sources: ${getActiveSources()}`, 14, 48);
    doc.text(`Total Emission: ${getTotalEmissions().toFixed(2)} kgCO2e`, 14, 56);
    
    // Table data
    const tableData = locationSummaries.map(row => [
      row.location,
      row.totalQuantity.toFixed(2),
      row.emissionFactor.toFixed(3),
      row.totalEmission.toFixed(2)
    ]);

    autoTable(doc, {
      startY: 70,
      head: [['Location', 'Total Quantity (kWh)', 'GHG Emission Factor', 'CO2 Carbon Emitted (kgCO2e)']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [34, 197, 94] }
    });

    // Footer
    doc.setFontSize(10);
    doc.text('Emission Factor Source: View Reference', 14, doc.internal.pageSize.height - 10);
    
    doc.save('scope2-carbon-emissions.pdf');
  };

  const generateExcel = () => {
    // Summary data
    const summaryData = [
      ['Scope 2 Carbon Emission Results'],
      [''],
      ['Total Quantity Till Date', `${getTotalQuantity().toFixed(2)} kWh`],
      ['Total Active Sources', getActiveSources().toString()],
      ['Total Emission', `${getTotalEmissions().toFixed(2)} kgCO2e`],
      [''],
      ['Location', 'Total Quantity (kWh)', 'GHG Emission Factor', 'CO2 Carbon Emitted (kgCO2e)']
    ];

    // Table data
    const tableData = locationSummaries.map(row => [
      row.location,
      row.totalQuantity.toFixed(2),
      row.emissionFactor.toFixed(3),
      row.totalEmission.toFixed(2)
    ]);

    const allData = [...summaryData, ...tableData];
    
    const ws = XLSX.utils.aoa_to_sheet(allData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Scope 2 Results');
    
    XLSX.writeFile(wb, 'scope2-carbon-emissions.xlsx');
  };

  const summary = [
    { label: 'Total Quantity Till Date', value: `${getTotalQuantity().toFixed(2)} kWh` },
    { label: 'Total Active Sources', value: getActiveSources().toString() },
    { label: 'Total Emission', value: `${getTotalEmissions().toFixed(2)} kgCO2e` },
  ];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Your Scope 2 Carbon Emission Results</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {summary.map((s) => (
          <div key={s.label} className="bg-white rounded-xl shadow p-6 flex flex-col items-center">
            <div className="text-gray-500 text-sm mb-2 text-center">{s.label}</div>
            <div className="text-2xl font-bold text-green-900">{s.value}</div>
          </div>
        ))}
      </div>
      
      <div className="bg-white rounded-xl shadow p-4 mb-4 overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-3 font-semibold">Location</th>
              <th className="py-2 px-3 font-semibold">Total Quantity (kWh)</th>
              <th className="py-2 px-3 font-semibold">GHG Emission Factor</th>
              <th className="py-2 px-3 font-semibold">CO2 Carbon Emitted (kgCO2e)</th>
            </tr>
          </thead>
          <tbody>
            {locationSummaries.map(row => (
              <tr key={row.location}>
                <td className="py-2 px-3">{row.location}</td>
                <td className="py-2 px-3">{row.totalQuantity.toFixed(2)}</td>
                <td className="py-2 px-3">{row.emissionFactor.toFixed(3)}</td>
                <td className="py-2 px-3">{row.totalEmission.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mb-6 text-gray-700 text-sm">
        Emission Factor Source: <a href="#" className="text-green-700 underline">View Reference</a>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 justify-end">
        <Button 
          className="bg-green-500 hover:bg-green-600 text-white" 
          variant="default"
          onClick={generatePDF}
        >
          Generate PDF
        </Button>
        <Button 
          className="bg-green-500 hover:bg-green-600 text-white" 
          variant="default"
          onClick={generateExcel}
        >
          Generate Excel
        </Button>
        <Button 
          className="bg-green-500 hover:bg-green-600 text-white" 
          variant="default" 
          onClick={() => navigate('/my-esg/environmental/scope-3')}
        >
          Next &rarr;
        </Button>
      </div>
    </div>
  );
};

export default Scope2Result;
