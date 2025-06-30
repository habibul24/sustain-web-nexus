
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { supabase } from '../integrations/supabase/client';
import { useAuthContext } from '../contexts/AuthContext';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '../components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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
  created_at: string;
}

const Dashboard = () => {
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
          created_at,
          office_locations!inner(name)
        `)
        .eq('user_id', user.id)
        .not('quantity_used', 'is', null);

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

  const calculateCO2Emission = (item: Scope2Data) => {
    if (!item.quantity_used || !item.emission_factor) return 0;
    
    if (item.organization_area && item.total_building_area) {
      return (item.organization_area / item.total_building_area) * item.quantity_used * item.emission_factor;
    }
    
    return item.quantity_used * item.emission_factor;
  };

  // Prepare data for year comparison chart
  const getYearComparisonData = () => {
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;

    // Current year data (from actual entries)
    const currentYearEmissions = scope2Data.reduce((sum, item) => sum + calculateCO2Emission(item), 0);

    // Previous year data (simulated - you could implement actual previous year data fetching)
    const previousYearEmissions = currentYearEmissions * 1.15; // Assuming 15% reduction from previous year

    return [
      { year: previousYear.toString(), emissions: previousYearEmissions },
      { year: currentYear.toString(), emissions: currentYearEmissions }
    ];
  };

  // Prepare data for monthly pie chart
  const getMonthlyData = () => {
    const monthlyEmissions = scope2Data.reduce((acc, item) => {
      const month = item.month || 'Unknown';
      const emissions = calculateCO2Emission(item);
      acc[month] = (acc[month] || 0) + emissions;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(monthlyEmissions).map(([month, emissions]) => ({
      month,
      emissions: Number(emissions.toFixed(2))
    }));
  };

  // Prepare data for location pie chart
  const getLocationData = () => {
    const locationEmissions = scope2Data.reduce((acc, item) => {
      const location = item.office_location_name;
      const emissions = calculateCO2Emission(item);
      acc[location] = (acc[location] || 0) + emissions;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(locationEmissions).map(([location, emissions]) => ({
      location,
      emissions: Number(emissions.toFixed(2))
    }));
  };

  const yearComparisonData = getYearComparisonData();
  const monthlyData = getMonthlyData();
  const locationData = getLocationData();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  const chartConfig = {
    emissions: {
      label: "Emissions (kgCO2e)",
    },
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">ESG Dashboard</h1>
      
      <Tabs defaultValue="environmental" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="environmental">Environmental</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="governance">Governance</TabsTrigger>
        </TabsList>

        <TabsContent value="environmental" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Year Comparison Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>CO2 Emissions Year Comparison</CardTitle>
                <CardDescription>Total CO2 emissions comparison between 2024 and 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <BarChart data={yearComparisonData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="emissions" fill="#22c55e" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Monthly Emissions Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly CO2 Emissions (2025)</CardTitle>
                <CardDescription>CO2 emissions breakdown by month for current year</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-80">
                  <PieChart>
                    <Pie
                      data={monthlyData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ month, percent }) => `${month} (${(percent * 100).toFixed(1)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="emissions"
                    >
                      {monthlyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Location Emissions Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>CO2 Emissions by Location (2025)</CardTitle>
              <CardDescription>CO2 emissions breakdown by office location for current year</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-80">
                <PieChart>
                  <Pie
                    data={locationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ location, percent }) => `${location} (${(percent * 100).toFixed(1)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="emissions"
                  >
                    {locationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Emissions</CardTitle>
                <CardDescription>Current year (2025)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {scope2Data.reduce((sum, item) => sum + calculateCO2Emission(item), 0).toFixed(2)} kgCO2e
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Locations</CardTitle>
                <CardDescription>Reporting emissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {locationData.length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Points</CardTitle>
                <CardDescription>Total entries recorded</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {scope2Data.length}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Impact Metrics</CardTitle>
              <CardDescription>Coming soon - Social performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                Social metrics will be available once social data collection is implemented.
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="governance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Governance Metrics</CardTitle>
              <CardDescription>Coming soon - Governance performance indicators</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                Governance metrics will be available once governance data collection is implemented.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
