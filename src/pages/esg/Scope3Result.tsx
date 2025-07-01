import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { supabase } from '../../integrations/supabase/client';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface PaperData {
  quantity_landfill: number | null;
  quantity_recycle: number | null;
  quantity_combust: number | null;
  quantity_vendor: number | null;
  carbon_dioxide_emitted_co2_landfill: number | null;
  carbon_dioxide_emitted_co2_recycle: number | null;
  carbon_dioxide_emitted_co2_combust: number | null;
}

const Scope3Result = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [paper, setPaper] = useState<PaperData | null>(null);
  const [loading, setLoading] = useState(true);
  const [waterData, setWaterData] = useState<any[]>([]);
  const [waterLoading, setWaterLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPaperData();
      fetchWaterData();
    }
  }, [user]);

  const fetchPaperData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('paper')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw error;
      if (data) {
        // Type assertion to allow access to new columns
        const d = data as any;
        const mapped: PaperData = {
          quantity_landfill: d.quantity_landfill ?? null,
          quantity_recycle: d.quantity_recycle ?? null,
          quantity_combust: d.quantity_combust ?? null,
          quantity_vendor: d.quantity_vendor ?? null,
          carbon_dioxide_emitted_co2_landfill: d.carbon_dioxide_emitted_co2_landfill ?? null,
          carbon_dioxide_emitted_co2_recycle: d.carbon_dioxide_emitted_co2_recycle ?? null,
          carbon_dioxide_emitted_co2_combust: d.carbon_dioxide_emitted_co2_combust ?? null,
        };
        setPaper(mapped);
      } else {
        setPaper(null);
      }
    } catch (e) {
      console.error('Error fetching paper data:', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchWaterData = async () => {
    setWaterLoading(true);
    try {
      const { data, error } = await (supabase.from as any)('scope3a_water')
        .select('*, office_locations(name)')
        .eq('user_id', user.id);
      if (error) throw error;
      setWaterData((data || []) as any);
    } catch (e) {
      console.error('Error fetching water data:', e);
    } finally {
      setWaterLoading(false);
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto p-6 text-center">Loading...</div>;
  }

  if (!paper) {
    return <div className="max-w-4xl mx-auto p-6 text-center">No Scope 3 data found.</div>;
  }

  // Calculate emissions
  const landfillEmission = (paper.quantity_landfill || 0) * (paper.carbon_dioxide_emitted_co2_landfill || 0);
  const recycleEmission = (paper.quantity_recycle || 0) * (paper.carbon_dioxide_emitted_co2_recycle || 0);
  const combustEmission = (paper.quantity_combust || 0) * (paper.carbon_dioxide_emitted_co2_combust || 0);
  // For vendor, use emission factor = 1 (or 0) if not provided, or show as N/A
  const vendorEmission = paper.quantity_vendor != null ? paper.quantity_vendor : null;

  const totalEmission = landfillEmission + recycleEmission + combustEmission + (vendorEmission || 0);

  // Group water data by location
  const waterByLocation: Record<string, { name: string, totalQuantity: number, emissionFactor: number, totalEmission: number }> = {};
  waterData.forEach(row => {
    const loc = row.office_locations?.name || 'Unknown';
    const q = parseFloat(row.quantity_used) || 0;
    const ef = parseFloat(row.emission_factor) || 0;
    if (!waterByLocation[loc]) {
      waterByLocation[loc] = { name: loc, totalQuantity: 0, emissionFactor: ef, totalEmission: 0 };
    }
    waterByLocation[loc].totalQuantity += q;
    // If emission factor varies, you could average or just use the last one
    waterByLocation[loc].emissionFactor = ef;
    waterByLocation[loc].totalEmission += q * ef;
  });
  const waterRows = Object.values(waterByLocation);

  // Calculate total water emission
  const totalWaterEmission = waterRows.reduce((sum, row) => row.totalEmission, 0);

  // Add water emission to total emission
  const totalEmissionWithWater = totalEmission + totalWaterEmission;

  // Calculate total paper quantity and emission
  const totalPaperQuantity = (paper?.quantity_landfill || 0) + (paper?.quantity_recycle || 0) + (paper?.quantity_combust || 0) + (paper?.quantity_vendor || 0);
  const totalPaperEmission = landfillEmission + recycleEmission + combustEmission + (vendorEmission || 0);

  const summary = [
    { label: 'Total Landfill Emission', value: `${landfillEmission.toFixed(2)} kgCO2e` },
    { label: 'Total Recycle Emission', value: `${recycleEmission.toFixed(2)} kgCO2e` },
    { label: 'Total Combustion Emission', value: `${combustEmission.toFixed(2)} kgCO2e` },
    { label: 'Vendor Emission', value: vendorEmission != null ? `${vendorEmission.toFixed(2)} kgCO2e` : 'N/A' },
    { label: 'Total Water Emission', value: `${totalWaterEmission.toFixed(2)} kgCO2e` },
    { label: 'Total Emission', value: `${totalEmissionWithWater.toFixed(2)} kgCO2e` },
  ];

  // For vendor, only include if quantity_vendor is not null
  const vendorRow = (paper?.quantity_vendor != null)
    ? {
        type: 'Vendor',
        quantity: paper.quantity_vendor,
        factor: 'N/A',
        emission: vendorEmission != null ? vendorEmission.toFixed(2) : 'N/A',
      }
    : null;

  const tableRows = [
    {
      type: 'Landfill',
      quantity: paper?.quantity_landfill ?? 0,
      factor: paper?.carbon_dioxide_emitted_co2_landfill ?? 0,
      emission: landfillEmission.toFixed(2),
    },
    {
      type: 'Recycle',
      quantity: paper?.quantity_recycle ?? 0,
      factor: paper?.carbon_dioxide_emitted_co2_recycle ?? 0,
      emission: recycleEmission.toFixed(2),
    },
    {
      type: 'Combust',
      quantity: paper?.quantity_combust ?? 0,
      factor: paper?.carbon_dioxide_emitted_co2_combust ?? 0,
      emission: combustEmission.toFixed(2),
    },
    ...(vendorRow ? [vendorRow] : []),
  ];

  // For paper tableRows, add a total row
  const totalPaperTableQuantity = tableRows.reduce((sum, row) => sum + (typeof row.quantity === 'string' ? parseFloat(row.quantity) : (typeof row.quantity === 'number' ? row.quantity : 0)), 0);
  const totalPaperTableEmission = tableRows.reduce((sum, row) => sum + (typeof row.emission === 'string' ? parseFloat(row.emission) : (typeof row.emission === 'number' ? row.emission : 0)), 0);
  const totalPaperTableFactor = totalPaperTableQuantity > 0 ? totalPaperTableEmission / totalPaperTableQuantity : 0;
  // For water table, add a total row
  const totalWaterTableQuantity = waterRows.reduce((sum, row) => sum + row.totalQuantity, 0);
  const totalWaterTableEmission = waterRows.reduce((sum, row) => sum + row.totalEmission, 0);
  const totalWaterTableFactor = totalWaterTableQuantity > 0 ? totalWaterTableEmission / totalWaterTableQuantity : 0;

  const generateExcel = () => {
    const summaryData = summary.map(s => [s.label, s.value]);
    const tableData = [
      ['Type', 'Quantity (kg)', 'Emission Factor', 'CO2e Emission (kgCO2e)'],
      ...tableRows.map(row => [row.type, row.quantity, row.factor, row.emission]),
    ];
    const allData = [['Scope 3 Carbon Emission Results'], [''], ...summaryData, [''], ...tableData];
    const ws = XLSX.utils.aoa_to_sheet(allData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Scope 3 Results');
    XLSX.writeFile(wb, 'scope3-carbon-emissions.xlsx');
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Scope 3 Carbon Emission Results', 14, 22);
    doc.setFontSize(12);
    let y = 40;
    summary.forEach(s => {
      doc.text(`${s.label}: ${s.value}`, 14, y);
      y += 8;
    });
    y += 4;
    autoTable(doc, {
      startY: y,
      head: [['Type', 'Quantity (kg)', 'Emission Factor', 'CO2e Emission (kgCO2e)']],
      body: tableRows.map(row => [row.type, row.quantity, row.factor, row.emission]),
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [34, 197, 94] },
    });
    doc.save('scope3-carbon-emissions.pdf');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Your Scope 3 Carbon Emission Results</h1>
      {/* Paper summary table */}
      <h2 className="text-xl font-bold mb-2">Waste Paper Summary</h2>
      <table className="min-w-[300px] mb-6">
        <tbody>
          <tr>
            <td className="font-semibold pr-4">Total Paper Quantity</td>
            <td>{totalPaperQuantity.toFixed(2)} kg</td>
          </tr>
          <tr>
            <td className="font-semibold pr-4">Total Paper Emission</td>
            <td>{totalPaperEmission.toFixed(2)} kgCO2e</td>
          </tr>
        </tbody>
      </table>
      <div className="bg-white rounded-xl shadow p-4 mb-4 overflow-x-auto">
        <table className="min-w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2 px-3 font-semibold">Type</th>
              <th className="py-2 px-3 font-semibold">Quantity (kg)</th>
              <th className="py-2 px-3 font-semibold">Emission Factor</th>
              <th className="py-2 px-3 font-semibold">CO2e Emission (kgCO2e)</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map(row => (
              <tr key={row.type}>
                <td className="py-2 px-3">{row.type}</td>
                <td className="py-2 px-3">{row.quantity}</td>
                <td className="py-2 px-3">{row.factor}</td>
                <td className="py-2 px-3">{row.emission}</td>
              </tr>
            ))}
            <tr className="font-bold bg-green-50">
              <td className="py-2 px-3">Total</td>
              <td className="py-2 px-3">{totalPaperTableQuantity.toFixed(2)}</td>
              <td className="py-2 px-3">{totalPaperTableFactor.toFixed(3)}</td>
              <td className="py-2 px-3">{totalPaperTableEmission.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Water Results Section */}
      {waterLoading ? (
        <div className="text-center">Loading water data...</div>
      ) : waterRows.length === 0 ? (
        <div className="text-center">No water data found.</div>
      ) : (
        <>
          {/* Water summary table */}
          <h2 className="text-xl font-bold mb-2 mt-10">Waste Water Summary</h2>
          <table className="min-w-[300px] mb-6">
            <tbody>
              <tr>
                <td className="font-semibold pr-4">Total Water Quantity</td>
                <td>{waterRows.reduce((sum, row) => sum + row.totalQuantity, 0).toFixed(2)} m³</td>
              </tr>
              <tr>
                <td className="font-semibold pr-4">Total Water Emission</td>
                <td>{totalWaterEmission.toFixed(2)} kgCO2e</td>
              </tr>
            </tbody>
          </table>
          <div className="bg-white rounded-xl shadow p-4 mb-4 overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-3 font-semibold">Location</th>
                  <th className="py-2 px-3 font-semibold">Total Quantity</th>
                  <th className="py-2 px-3 font-semibold">Emission Factor</th>
                  <th className="py-2 px-3 font-semibold">Total CO2e Emission (kg CO2e)</th>
                </tr>
              </thead>
              <tbody>
                {waterRows.map((row, idx) => (
                  <tr key={row.name + idx}>
                    <td className="py-2 px-3">{row.name}</td>
                    <td className="py-2 px-3">{row.totalQuantity.toFixed(2)}</td>
                    <td className="py-2 px-3">{row.emissionFactor}</td>
                    <td className="py-2 px-3">{row.totalEmission.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="font-bold bg-green-50">
                  <td className="py-2 px-3">Total</td>
                  <td className="py-2 px-3">{totalWaterTableQuantity.toFixed(2)}</td>
                  <td className="py-2 px-3">{totalWaterTableFactor.toFixed(3)}</td>
                  <td className="py-2 px-3">{totalWaterTableEmission.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
      <div className="flex flex-row gap-4 justify-end fixed bottom-8 right-8 z-50">
        <Button onClick={generateExcel} className="bg-green-600 hover:bg-green-700 text-white">Generate Excel</Button>
        <Button onClick={generatePDF} className="bg-green-600 hover:bg-green-700 text-white">Generate PDF</Button>
        <Button onClick={() => navigate('/my-esg/social/employee-profile')} className="bg-green-600 hover:bg-green-700 text-white">Next</Button>
      </div>
    </div>
  );
};

export default Scope3Result; 