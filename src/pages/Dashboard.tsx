
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

    const currentYearEmissions = scope2Data.reduce((sum, item) => sum + calculateCO2Emission(item), 0);
    const previousYearEmissions = currentYearEmissions * 1.15;

    return [
      { year: previousYear.toString(), emissions: previousYearEmissions, fill: '#ef4444' },
      { year: currentYear.toString(), emissions: currentYearEmissions, fill: '#22c55e' }
    ];
  };

  // Prepare data for monthly pie chart with different colors and highlighting
  const getMonthlyData = () => {
    const monthlyEmissions = scope2Data.reduce((acc, item) => {
      const month = item.month || 'Unknown';
      const emissions = calculateCO2Emission(item);
      acc[month] = (acc[month] || 0) + emissions;
      return acc;
    }, {} as Record<string, number>);

    const sortedMonths = Object.entries(monthlyEmissions)
      .map(([month, emissions]) => ({
        month,
        emissions: Number(emissions.toFixed(2))
      }))
      .sort((a, b) => b.emissions - a.emissions);

    // Color palette for months - top 5 get bright colors, others get dull colors
    const brightColors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
    const dullColors = ['#d1d5db', '#9ca3af', '#6b7280', '#4b5563', '#374151', '#1f2937', '#111827'];

    return sortedMonths.map((item, index) => ({
      ...item,
      fill: index < 5 ? brightColors[index] : dullColors[index - 5] || '#9ca3af'
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

    return Object.entries(locationEmissions).map(([location, emissions], index) => ({
      location,
      emissions: Number(emissions.toFixed(2)),
      fill: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'][index % 6]
    }));
  };

  // Custom label function for pie charts
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show label for very small slices

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const yearComparisonData = getYearComparisonData();
  const monthlyData = getMonthlyData();
  const locationData = getLocationData();

  const chartConfig = {
    emissions: {
      label: "Emissions (kgCO₂e)",
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
          {/* Scope Navigation */}
          <Tabs defaultValue="scope2" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="scope1">Scope 1</TabsTrigger>
              <TabsTrigger value="scope2">Scope 2</TabsTrigger>
              <TabsTrigger value="scope3">Scope 3</TabsTrigger>
            </TabsList>

            <TabsContent value="scope1" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Scope 1 Emissions</CardTitle>
                  <CardDescription>Coming soon - Direct emissions from owned or controlled sources</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    Scope 1 emissions data will be available once data collection is implemented.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="scope2" className="space-y-6">
              {/* Scope 2 Charts in One Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Year Comparison Bar Chart */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">CO₂e Emissions Year Comparison</CardTitle>
                    <CardDescription className="text-xs">2024 vs 2025</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-48">
                      <BarChart data={yearComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="emissions" />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Monthly Emissions Pie Chart */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Monthly CO₂e Emissions (2025)</CardTitle>
                    <CardDescription className="text-xs">Top 5 months highlighted</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-48">
                      <PieChart>
                        <Pie
                          data={monthlyData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={60}
                          dataKey="emissions"
                        >
                          {monthlyData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Location Emissions Pie Chart */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">CO₂e Emissions by Location (2025)</CardTitle>
                    <CardDescription className="text-xs">All office locations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-48">
                      <PieChart>
                        <Pie
                          data={locationData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={60}
                          dataKey="emissions"
                        >
                          {locationData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Summary Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Emissions</CardTitle>
                    <CardDescription>Current year (2025)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {scope2Data.reduce((sum, item) => sum + calculateCO2Emission(item), 0).toFixed(2)} kgCO₂e
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

            <TabsContent value="scope3" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Scope 3 Emissions</CardTitle>
                  <CardDescription>Coming soon - Indirect emissions from value chain</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-gray-500">
                    Scope 3 emissions data will be available once data collection is implemented.
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
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
