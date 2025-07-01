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

  useEffect(() => {
    if (user) fetchPaperData();
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

  const summary = [
    { label: 'Total Landfill Emission', value: `${landfillEmission.toFixed(2)} kgCO2e` },
    { label: 'Total Recycle Emission', value: `${recycleEmission.toFixed(2)} kgCO2e` },
    { label: 'Total Combustion Emission', value: `${combustEmission.toFixed(2)} kgCO2e` },
    { label: 'Vendor Emission', value: vendorEmission != null ? `${vendorEmission.toFixed(2)} kgCO2e` : 'N/A' },
    { label: 'Total Emission', value: `${totalEmission.toFixed(2)} kgCO2e` },
  ];

  const tableRows = [
    {
      type: 'Landfill',
      quantity: paper.quantity_landfill ?? 0,
      factor: paper.carbon_dioxide_emitted_co2_landfill ?? 0,
      emission: landfillEmission.toFixed(2),
    },
    {
      type: 'Recycle',
      quantity: paper.quantity_recycle ?? 0,
      factor: paper.carbon_dioxide_emitted_co2_recycle ?? 0,
      emission: recycleEmission.toFixed(2),
    },
    {
      type: 'Combust',
      quantity: paper.quantity_combust ?? 0,
      factor: paper.carbon_dioxide_emitted_co2_combust ?? 0,
      emission: combustEmission.toFixed(2),
    },
    {
      type: 'Vendor',
      quantity: paper.quantity_vendor ?? 'N/A',
      factor: 'N/A',
      emission: vendorEmission != null ? vendorEmission.toFixed(2) : 'N/A',
    },
  ];

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
          </tbody>
        </table>
      </div>
      <div className="flex flex-row gap-4 justify-end fixed bottom-8 right-8 z-50">
        <Button onClick={generateExcel} className="bg-green-600 hover:bg-green-700 text-white">Generate Excel</Button>
        <Button onClick={generatePDF} className="bg-green-600 hover:bg-green-700 text-white">Generate PDF</Button>
        <Button onClick={() => navigate('/my-esg/social/employee-profile')} className="bg-green-600 hover:bg-green-700 text-white">Next</Button>
      </div>
    </div>
  );
};

export default Scope3Result; 