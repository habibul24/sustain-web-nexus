
import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../contexts/AuthContext';
import { supabase } from '../integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../components/ui/chart';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface Scope1Data {
  id: string;
  source_of_energy?: string;
  vehicle_fuel_type?: string;
  refrigerant_type?: string;
  emissions_kg_co2: number;
  created_at: string;
  category: '1a' | '1b' | '1c' | '1d';
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
  waste_type?: string;
  location_name?: string;
  receives_bills_directly?: boolean;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const Dashboard = () => {
  const { user } = useAuthContext();
  const [scope1Data, setScope1Data] = useState<Scope1Data[]>([]);
  const [scope2Data, setScope2Data] = useState<Scope2Data[]>([]);
  const [scope3Data, setScope3Data] = useState<Scope3Data[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchAllData();
    }
  }, [user]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchScope1Data(), fetchScope2Data(), fetchScope3Data()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchScope1Data = async () => {
    try {
      // Fetch stationary combustion (1a)
      const { data: stationaryData, error: stationaryError } = await supabase
        .from('stationary_combustion')
        .select('*')
        .eq('user_id', user.id);

      if (stationaryError) throw stationaryError;

      // Fetch mobile combustion (1b)
      const { data: mobileData, error: mobileError } = await supabase
        .from('mobile_combustion')
        .select('*')
        .eq('user_id', user.id);

      if (mobileError) throw mobileError;

      // Fetch process emissions (1c)
      const { data: processData, error: processError } = await supabase
        .from('process_emissions')
        .select('*')
        .eq('user_id', user.id);

      if (processError) throw processError;

      // Fetch refrigerant emissions (1d)
      const { data: refrigerantData, error: refrigerantError } = await supabase
        .from('refrigerant_emissions')
        .select('*')
        .eq('user_id', user.id);

      if (refrigerantError) throw refrigerantError;

      // Combine all data with categories
      const combinedData: Scope1Data[] = [
        ...(stationaryData || []).map(item => ({
          id: item.id,
          source_of_energy: item.source_of_energy,
          emissions_kg_co2: item.emissions_kg_co2 || 0,
          created_at: item.created_at,
          category: '1a' as const
        })),
        ...(mobileData || []).map(item => ({
          id: item.id,
          vehicle_fuel_type: item.vehicle_fuel_type,
          emissions_kg_co2: item.emissions_kg_co2 || 0,
          created_at: item.created_at,
          category: '1b' as const
        })),
        ...(processData || []).map(item => ({
          id: item.id,
          source_of_energy: item.source_of_energy,
          emissions_kg_co2: item.emissions_kg_co2 || 0,
          created_at: item.created_at,
          category: '1c' as const
        })),
        ...(refrigerantData || []).map(item => ({
          id: item.id,
          refrigerant_type: item.refrigerant_type,
          emissions_kg_co2: item.emissions_kg_co2 || 0,
          created_at: item.created_at,
          category: '1d' as const
        }))
      ];

      setScope1Data(combinedData);
    } catch (error) {
      console.error('Error fetching Scope 1 data:', error);
    }
  };

  const fetchScope2Data = async () => {
    try {
      const { data, error } = await supabase
        .from('scope2a_electricity')
        .select(`
          *,
          office_locations(name)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedData: Scope2Data[] = (data || []).map(item => ({
        id: item.id,
        source_of_energy: item.source_of_energy,
        quantity_used: item.quantity_used,
        emission_factor: item.emission_factor || 0,
        emissions_kg_co2: item.emissions_kg_co2 || 0,
        created_at: item.created_at,
        receives_bills_directly: item.receives_bills_directly || false
      }));

      setScope2Data(formattedData);
    } catch (error) {
      console.error('Error fetching Scope 2 data:', error);
    }
  };

  const fetchScope3Data = async () => {
    try {
      // Fetch paper data
      const { data: paperData, error: paperError } = await supabase
        .from('paper')
        .select('*')
        .eq('user_id', user.id);

      if (paperError) throw paperError;

      // Fetch water data
      const { data: waterData, error: waterError } = await supabase
        .from('scope3a_water')
        .select(`
          *,
          office_locations(name)
        `)
        .eq('user_id', user.id);

      if (waterError) throw waterError;

      // Combine all Scope 3 data
      const combinedData: Scope3Data[] = [
        ...(paperData || []).map(item => {
          // Calculate total emissions from all paper types
          const landfillEmission = (item.quantity_landfill || 0) * (item.carbon_dioxide_emitted_co2_landfill || 0);
          const recycleEmission = (item.quantity_recycle || 0) * (item.carbon_dioxide_emitted_co2_recycle || 0);
          const combustEmission = (item.quantity_combust || 0) * (item.carbon_dioxide_emitted_co2_combust || 0);
          const vendorEmission = item.quantity_vendor || 0;
          
          return {
            id: item.id,
            source_type: 'Paper',
            waste_type: 'Mixed Paper',
            quantity_used: (item.quantity_landfill || 0) + (item.quantity_recycle || 0) + (item.quantity_combust || 0) + (item.quantity_vendor || 0),
            emission_factor: 0, // Paper emissions are pre-calculated
            emissions_kg_co2: landfillEmission + recycleEmission + combustEmission + vendorEmission,
            created_at: item.created_at
          };
        }),
        ...(waterData || []).map(item => ({
          id: item.id,
          source_type: 'Water',
          location_name: (item as any).office_locations?.name || 'Unknown Location',
          quantity_used: item.quantity_used,
          emission_factor: item.emission_factor || 0,
          emissions_kg_co2: item.quantity_used * (item.emission_factor || 0),
          receives_bills_directly: item.receives_bills_directly,
          created_at: item.created_at
        }))
      ];

      setScope3Data(combinedData);
    } catch (error) {
      console.error('Error fetching Scope 3 data:', error);
    }
  };

  // Process data for Scope 1 pie charts (separate charts for each category)
  const getScope1PieChartData = (category: '1a' | '1b' | '1c' | '1d') => {
    const categoryData = scope1Data.filter(item => item.category === category);
    const grouped = categoryData.reduce((acc, item) => {
      const key = item.source_of_energy || item.vehicle_fuel_type || item.refrigerant_type || 'Unknown';
      acc[key] = (acc[key] || 0) + item.emissions_kg_co2;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  };

  // Process data for Scope 1 bar chart (year-by-year comparison)
  const getScope1BarChartData = () => {
    const yearlyData = scope1Data.reduce((acc, item) => {
      const year = new Date(item.created_at).getFullYear().toString();
      if (!acc[year]) acc[year] = { year, '1a': 0, '1b': 0, '1c': 0, '1d': 0 };
      acc[year][item.category] += item.emissions_kg_co2;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(yearlyData);
  };

  // Process data for Scope 2 pie chart (only direct billing)
  const getScope2PieChartData = () => {
    const directBillingData = scope2Data.filter(item => item.receives_bills_directly);
    const grouped = directBillingData.reduce((acc, item) => {
      acc[item.source_of_energy] = (acc[item.source_of_energy] || 0) + item.emissions_kg_co2;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  };

  // Process data for Scope 2 bar chart (year-by-year)
  const getScope2BarChartData = () => {
    const yearlyData = scope2Data.reduce((acc, item) => {
      const year = new Date(item.created_at).getFullYear().toString();
      if (!acc[year]) acc[year] = { year, emissions: 0 };
      acc[year].emissions += item.emissions_kg_co2;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(yearlyData);
  };

  // Process data for Scope 3 pie charts
  const getScope3PaperPieChartData = () => {
    const paperData = scope3Data.filter(item => item.source_type === 'Paper');
    return paperData.map(item => ({
      name: item.waste_type || 'Paper',
      value: item.emissions_kg_co2
    }));
  };

  const getScope3WaterPieChartData = () => {
    const waterData = scope3Data.filter(item => item.source_type === 'Water' && item.receives_bills_directly);
    const grouped = waterData.reduce((acc, item) => {
      const location = item.location_name || 'Unknown Location';
      acc[location] = (acc[location] || 0) + item.emissions_kg_co2;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(grouped).map(([name, value]) => ({ name, value }));
  };

  // Process data for Scope 3 bar chart (year-by-year)
  const getScope3BarChartData = () => {
    const yearlyData = scope3Data.reduce((acc, item) => {
      const year = new Date(item.created_at).getFullYear().toString();
      if (!acc[year]) acc[year] = { year, Paper: 0, Water: 0 };
      acc[year][item.source_type] += item.emissions_kg_co2;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(yearlyData);
  };

  const chartConfig = {
    emissions: { label: "Emissions (kg CO2e)", color: "#2563eb" },
    '1a': { label: "Stationary Combustion", color: "#0088FE" },
    '1b': { label: "Mobile Combustion", color: "#00C49F" },
    '1c': { label: "Process Emissions", color: "#FFBB28" },
    '1d': { label: "Refrigerant Emissions", color: "#FF8042" },
    Paper: { label: "Paper", color: "#8884D8" },
    Water: { label: "Water", color: "#82CA9D" }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-8">Environmental Dashboard</h1>
      
      {/* Scope 1 Environmental */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Scope 1 Environmental</h2>
        
        {/* Scope 1 Pie Charts - 4 separate charts in one row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['1a', '1b', '1c', '1d'] as const).map((category) => {
            const data = getScope1PieChartData(category);
            const categoryNames = {
              '1a': 'Stationary Combustion',
              '1b': 'Mobile Combustion', 
              '1c': 'Process Emissions',
              '1d': 'Refrigerant Emissions'
            };
            return (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-lg">Scope {category}</CardTitle>
                  <CardDescription>{categoryNames[category]}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={(entry) => `${entry.name}: ${entry.value.toFixed(1)}`}
                        >
                          {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Scope 1 Bar Chart - Year by year comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Scope 1 Year-by-Year Comparison</CardTitle>
            <CardDescription>Annual emissions by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getScope1BarChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="1a" fill="#0088FE" name="Stationary Combustion" />
                  <Bar dataKey="1b" fill="#00C49F" name="Mobile Combustion" />
                  <Bar dataKey="1c" fill="#FFBB28" name="Process Emissions" />
                  <Bar dataKey="1d" fill="#FF8042" name="Refrigerant Emissions" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Scope 2 Environmental */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Scope 2 Environmental</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Scope 2 Emissions Distribution</CardTitle>
              <CardDescription>By energy source (direct billing only)</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getScope2PieChartData()}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => `${entry.name}: ${entry.value.toFixed(1)}`}
                    >
                      {getScope2PieChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Scope 2 Year-by-Year</CardTitle>
              <CardDescription>Annual emissions trend</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getScope2BarChartData()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="emissions" fill="#2563eb" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Scope 3 Environmental */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Scope 3 Environmental</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Paper Waste Emissions</CardTitle>
              <CardDescription>By waste type</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getScope3PaperPieChartData()}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => `${entry.name}: ${entry.value.toFixed(1)}`}
                    >
                      {getScope3PaperPieChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Water Emissions by Location</CardTitle>
              <CardDescription>Direct billing only</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getScope3WaterPieChartData()}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={(entry) => `${entry.name}: ${entry.value.toFixed(1)}`}
                    >
                      {getScope3WaterPieChartData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Scope 3 Year-by-Year Comparison</CardTitle>
            <CardDescription>Annual emissions by source type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getScope3BarChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="Paper" fill="#8884D8" />
                  <Bar dataKey="Water" fill="#82CA9D" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
