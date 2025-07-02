import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface Scope1Data {
  id: string;
  source_type: string;
  source_of_energy?: string;
  vehicle_fuel_type?: string;
  refrigerant_type?: string;
  emissions_kg_co2: number;
  created_at: string;
}

interface Scope2Data {
  id: string;
  source_of_energy: string;
  quantity_used: number;
  emission_factor: number;
  emissions_kg_co2: number;
  created_at: string;
  receives_bills_directly: boolean;
}

interface Scope3Data {
  id: string;
  source_type: string;
  quantity_used: number;
  emission_factor: number;
  emissions_kg_co2: number;
  created_at: string;
  receives_bills_directly?: boolean;
  waste_type?: string;
  location_name?: string;
}

interface PaperWasteData {
  id: string;
  quantity_landfill?: number;
  quantity_recycle?: number;
  quantity_combust?: number;
  carbon_dioxide_emitted_co2_landfill?: number;
  carbon_dioxide_emitted_co2_recycle?: number;
  carbon_dioxide_emitted_co2_combust?: number;
  created_at: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const Dashboard = () => {
  const [scope1Data, setScope1Data] = useState<Scope1Data[]>([]);
  const [scope2Data, setScope2Data] = useState<Scope2Data[]>([]);
  const [scope3Data, setScope3Data] = useState<Scope3Data[]>([]);
  const [paperWasteData, setPaperWasteData] = useState<PaperWasteData[]>([]);

  const fetchScope1Data = async () => {
    const [stationaryData, mobileData, processData, refrigerantData] = await Promise.all([
      supabase.from('stationary_combustion').select('*'),
      supabase.from('mobile_combustion').select('*'),
      supabase.from('process_emissions').select('*'),
      supabase.from('refrigerant_emissions').select('*')
    ]);

    const combinedData: Scope1Data[] = [
      ...(stationaryData.data || []).map(item => ({
        id: item.id,
        source_type: '1a - Stationary Combustion',
        source_of_energy: item.source_of_energy,
        emissions_kg_co2: item.emissions_kg_co2 || 0,
        created_at: item.created_at
      })),
      ...(mobileData.data || []).map(item => ({
        id: item.id,
        source_type: '1b - Mobile Combustion',
        vehicle_fuel_type: item.vehicle_fuel_type,
        emissions_kg_co2: item.emissions_kg_co2 || 0,
        created_at: item.created_at
      })),
      ...(processData.data || []).map(item => ({
        id: item.id,
        source_type: '1c - Process Emissions',
        source_of_energy: item.source_of_energy,
        emissions_kg_co2: item.emissions_kg_co2 || 0,
        created_at: item.created_at
      })),
      ...(refrigerantData.data || []).map(item => ({
        id: item.id,
        source_type: '1d - Refrigerant Emissions',
        refrigerant_type: item.refrigerant_type,
        emissions_kg_co2: item.emissions_kg_co2 || 0,
        created_at: item.created_at
      }))
    ];

    return combinedData;
  };

  const fetchScope2Data = async () => {
    const { data } = await supabase.from('scope2a_electricity').select('*');
    
    const transformedData: Scope2Data[] = (data || []).map(item => ({
      id: item.id,
      source_of_energy: item.source_of_energy,
      quantity_used: item.quantity_used || 0,
      emission_factor: item.emission_factor || 0,
      emissions_kg_co2: item.emissions_kg_co2 || 0,
      created_at: item.created_at,
      receives_bills_directly: item.receives_bills_directly === 'Yes'
    }));

    return transformedData;
  };

  const fetchScope3Data = async () => {
    const [paperData, waterData] = await Promise.all([
      supabase.from('paper').select('*'),
      supabase.from('scope3a_water').select('*, office_locations(name)')
    ]);

    const combinedData: Scope3Data[] = [
      ...(paperData.data || []).map(item => ({
        id: item.id,
        source_type: 'Paper Waste',
        waste_type: item.waste_type || 'mixed',
        quantity_used: item.quantity || 0,
        emission_factor: 0,
        emissions_kg_co2: item.emissions_kg_co2 || 0,
        created_at: item.created_at
      })),
      ...(waterData.data || []).map(item => ({
        id: item.id,
        source_type: 'Water',
        location_name: item.office_locations?.name,
        quantity_used: item.quantity_used || 0,
        emission_factor: item.emission_factor || 0,
        emissions_kg_co2: item.emissions_kg_co2 || 0,
        receives_bills_directly: item.receives_bills_directly === 'Yes',
        created_at: item.created_at
      }))
    ];

    return combinedData;
  };

  const fetchPaperWasteData = async () => {
    const { data } = await supabase.from('paper').select('*');
    return data || [];
  };

  const { data: scope1DataQuery, isLoading: scope1Loading } = useQuery({
    queryKey: ['scope1Data'],
    queryFn: fetchScope1Data,
  });

  const { data: scope2DataQuery, isLoading: scope2Loading } = useQuery({
    queryKey: ['scope2Data'],
    queryFn: fetchScope2Data,
  });

  const { data: scope3DataQuery, isLoading: scope3Loading } = useQuery({
    queryKey: ['scope3Data'],
    queryFn: fetchScope3Data,
  });

  const { data: paperWasteDataQuery, isLoading: paperWasteLoading } = useQuery({
    queryKey: ['paperWasteData'],
    queryFn: fetchPaperWasteData,
  });

  useEffect(() => {
    if (scope1DataQuery) setScope1Data(scope1DataQuery);
    if (scope2DataQuery) setScope2Data(scope2DataQuery);
    if (scope3DataQuery) setScope3Data(scope3DataQuery);
    if (paperWasteDataQuery) setPaperWasteData(paperWasteDataQuery);
  }, [scope1DataQuery, scope2DataQuery, scope3DataQuery, paperWasteDataQuery]);

  const prepareScope1ChartData = () => {
    const grouped = scope1Data.reduce((acc, item) => {
      const category = item.source_type;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += item.emissions_kg_co2;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2))
    }));
  };

  const prepareScope1SubChartData = (category: string) => {
    const filteredData = scope1Data.filter(item => item.source_type === category);
    const grouped = filteredData.reduce((acc, item) => {
      let key = '';
      if (category === '1a - Stationary Combustion') {
        key = item.source_of_energy || 'Unknown';
      } else if (category === '1b - Mobile Combustion') {
        key = item.vehicle_fuel_type || 'Unknown';
      } else if (category === '1c - Process Emissions') {
        key = item.source_of_energy || 'Unknown';
      } else if (category === '1d - Refrigerant Emissions') {
        key = item.refrigerant_type || 'Unknown';
      }
      
      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key] += item.emissions_kg_co2;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2))
    }));
  };

  const prepareScope2ChartData = () => {
    const directBillingData = scope2Data.filter(item => item.receives_bills_directly);
    const grouped = directBillingData.reduce((acc, item) => {
      if (!acc[item.source_of_energy]) {
        acc[item.source_of_energy] = 0;
      }
      acc[item.source_of_energy] += item.emissions_kg_co2;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2))
    }));
  };

  const prepareScope3ChartData = () => {
    const directBillingWaterData = scope3Data.filter(item => 
      item.source_type === 'Water' && item.receives_bills_directly
    );
    const grouped = directBillingWaterData.reduce((acc, item) => {
      const key = item.location_name || 'Unknown Location';
      if (!acc[key]) {
        acc[key] = 0;
      }
      acc[key] += item.emissions_kg_co2;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2))
    }));
  };

  const preparePaperWasteChartData = () => {
    const wasteTypes: { name: string; value: number }[] = [];
    
    paperWasteData.forEach(item => {
      if (item.quantity_landfill && item.quantity_landfill > 0) {
        const emissions = (item.quantity_landfill || 0) * (item.carbon_dioxide_emitted_co2_landfill || 4.8);
        wasteTypes.push({
          name: 'Landfill',
          value: Number(emissions.toFixed(2))
        });
      }
      
      if (item.quantity_recycle && item.quantity_recycle > 0) {
        const emissions = (item.quantity_recycle || 0) * (item.carbon_dioxide_emitted_co2_recycle || 0.01814882033);
        wasteTypes.push({
          name: 'Recycle',
          value: Number(emissions.toFixed(2))
        });
      }
      
      if (item.quantity_combust && item.quantity_combust > 0) {
        const emissions = (item.quantity_combust || 0) * (item.carbon_dioxide_emitted_co2_combust || 0.04537205082);
        wasteTypes.push({
          name: 'Combustion',
          value: Number(emissions.toFixed(2))
        });
      }
    });

    // Group by waste type and sum emissions
    const grouped = wasteTypes.reduce((acc, item) => {
      if (!acc[item.name]) {
        acc[item.name] = 0;
      }
      acc[item.name] += item.value;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value: Number(value.toFixed(2))
    }));
  };

  const scope1ChartData = prepareScope1ChartData();
  const scope2ChartData = prepareScope2ChartData();
  const scope3ChartData = prepareScope3ChartData();
  const paperWasteChartData = preparePaperWasteChartData();

  const scope1Categories = ['1a - Stationary Combustion', '1b - Mobile Combustion', '1c - Process Emissions', '1d - Refrigerant Emissions'];

  if (scope1Loading || scope2Loading || scope3Loading || paperWasteLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Environmental Dashboard</h1>
        <p className="text-gray-600">Overview of your organization's carbon emissions</p>
      </div>

      {/* Scope 1 Emissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Scope 1 Direct Emissions</CardTitle>
          <p className="text-sm text-gray-600">Emissions from sources owned or controlled by your organization</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {scope1Categories.map((category, index) => {
              const subChartData = prepareScope1SubChartData(category);
              return (
                <div key={category} className="text-center">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">{category}</h3>
                  {subChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={subChartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {subChartData.map((entry, idx) => (
                            <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} kg CO₂`, 'Emissions']} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-gray-500">
                      No data available
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Scope 2 Emissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Scope 2 Indirect Emissions</CardTitle>
          <p className="text-sm text-gray-600">Emissions from purchased electricity (Direct Billing Only)</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Electricity by Provider</h3>
              {scope2ChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={scope2ChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {scope2ChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} kg CO₂`, 'Emissions']} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[400px] flex items-center justify-center text-gray-500">
                  No direct billing electricity data available
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scope 3 Emissions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800">Scope 3 Other Indirect Emissions</CardTitle>
          <p className="text-sm text-gray-600">Emissions from activities in your value chain</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Water by Location</h3>
              <p className="text-sm text-gray-600 mb-4">Distribution by office location (Direct Billing Only)</p>
              {scope3ChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={scope3ChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {scope3ChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} kg CO₂`, 'Emissions']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  No direct billing water data available
                </div>
              )}
            </div>
            
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Paper Waste by Type</h3>
              <p className="text-sm text-gray-600 mb-4">Distribution by disposal method</p>
              {paperWasteChartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paperWasteChartData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {paperWasteChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} kg CO₂`, 'Emissions']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-gray-500">
                  No paper waste data available
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
