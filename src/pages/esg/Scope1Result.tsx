
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';

interface EmissionData {
  source: string;
  quantity: number;
  ghgFactor: number;
  co2Emitted: number;
}

const Scope1Result = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState<EmissionData[]>([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalActiveSources, setTotalActiveSources] = useState(0);
  const [totalEmission, setTotalEmission] = useState(0);

  useEffect(() => {
    if (user) {
      fetchAllEmissionData();
    }
  }, [user]);

  const fetchAllEmissionData = async () => {
    try {
      setLoading(true);
      const allData: EmissionData[] = [];
      let totalQty = 0;
      let totalSources = 0;
      let totalCO2 = 0;

      // Fetch Stationary Combustion data
      const { data: stationaryData, error: stationaryError } = await supabase
        .from('stationary_combustion')
        .select('*')
        .eq('user_id', user?.id);

      if (stationaryError) throw stationaryError;

      if (stationaryData) {
        stationaryData.forEach(row => {
          const quantity = row.quantity_used || 0;
          const ghgFactor = row.carbon_dioxide_emitted_co2 || 0;
          const co2Emitted = quantity * ghgFactor;
          
          allData.push({
            source: row.source_of_energy,
            quantity,
            ghgFactor,
            co2Emitted
          });
          
          totalQty += quantity;
          totalSources += 1;
          totalCO2 += co2Emitted;
        });
      }

      // Fetch Process Emissions data
      const { data: processData, error: processError } = await supabase
        .from('process_emissions')
        .select('*')
        .eq('user_id', user?.id);

      if (processError) throw processError;

      if (processData) {
        processData.forEach(row => {
          const quantity = row.quantity_used || 0;
          const ghgFactor = row.carbon_dioxide_emitted_co2 || 0;
          const co2Emitted = quantity * ghgFactor;
          
          allData.push({
            source: row.source_of_energy,
            quantity,
            ghgFactor,
            co2Emitted
          });
          
          totalQty += quantity;
          totalSources += 1;
          totalCO2 += co2Emitted;
        });
      }

      // Fetch Mobile Combustion data
      const { data: mobileData, error: mobileError } = await supabase
        .from('mobile_combustion')
        .select('*')
        .eq('user_id', user?.id);

      if (mobileError) throw mobileError;

      if (mobileData) {
        mobileData.forEach(row => {
          const quantity = row.fuel_per_vehicle || 0;
          const ghgFactor = row.carbon_dioxide_emitted_co2 || 0;
          const co2Emitted = quantity * ghgFactor;
          
          allData.push({
            source: `${row.vehicle_fuel_type} (${row.vehicle_no || 'Unknown'})`,
            quantity,
            ghgFactor,
            co2Emitted
          });
          
          totalQty += quantity;
          totalSources += 1;
          totalCO2 += co2Emitted;
        });
      }

      // Fetch Refrigerant Emissions data
      const { data: refrigerantData, error: refrigerantError } = await supabase
        .from('refrigerant_emissions')
        .select('*')
        .eq('user_id', user?.id);

      if (refrigerantError) throw refrigerantError;

      if (refrigerantData) {
        refrigerantData.forEach(row => {
          const quantity = row.quantity_used || 0;
          const ghgFactor = row.carbon_dioxide_emitted_co2 || 0;
          const co2Emitted = quantity * ghgFactor;
          
          allData.push({
            source: row.refrigerant_type,
            quantity,
            ghgFactor,
            co2Emitted
          });
          
          totalQty += quantity;
          totalSources += 1;
          totalCO2 += co2Emitted;
        });
      }

      setTableData(allData);
      setTotalQuantity(totalQty);
      setTotalActiveSources(totalSources);
      setTotalEmission(totalCO2);

    } catch (error) {
      console.error('Error fetching emission data:', error);
      toast.error('Failed to load emission data');
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return num.toFixed(4);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading emission data...</div>
        </div>
      </div>
    );
  }

  const summary = [
    { label: 'Total Quantity Till Date', value: formatNumber(totalQuantity) },
    { label: 'Total Active Sources Of Emission', value: totalActiveSources.toString() },
    { label: 'Total Emission', value: `${formatNumber(totalEmission)} kgCO2e` },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Congratulations, your scope 1 carbon emission data is ready below</h1>
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
              <th className="py-2 px-3 font-semibold">Description Of Sources</th>
              <th className="py-2 px-3 font-semibold">Quantity Till Date</th>
              <th className="py-2 px-3 font-semibold">GHG Emission Factor</th>
              <th className="py-2 px-3 font-semibold">Co2 Carbon Emitted</th>
            </tr>
          </thead>
          <tbody>
            {tableData.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">No data available</td>
              </tr>
            ) : (
              tableData.map((row, idx) => (
                <tr key={idx} className="border-b">
                  <td className="py-2 px-3">{row.source}</td>
                  <td className="py-2 px-3">{formatNumber(row.quantity)}</td>
                  <td className="py-2 px-3">{formatNumber(row.ghgFactor)}</td>
                  <td className="py-2 px-3">{formatNumber(row.co2Emitted)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mb-6 text-gray-700 text-sm">
        Emission Factor Is Obtained From{' '}
        <a href="#" className="text-green-700 underline">Check Reference</a>
      </div>
      <div className="flex flex-col md:flex-row gap-4 justify-end">
        <Button className="bg-green-500 hover:bg-green-600 text-white" variant="default">Generate PDF</Button>
        <Button className="bg-green-500 hover:bg-green-600 text-white" variant="default">Generate Excel</Button>
        <Button className="bg-green-500 hover:bg-green-600 text-white" variant="default" onClick={() => navigate('/my-esg/environmental/scope-2')}>Next &rarr;</Button>
      </div>
    </div>
  );
};

export default Scope1Result;
