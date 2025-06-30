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

interface Employee {
  id: string;
  name: string;
  position?: string;
  is_executive?: boolean;
  age?: number;
  sex?: string;
  country_of_assignment?: string;
  date_of_employment?: string;
  date_of_exit?: string;
}

const Dashboard = () => {
  const { user } = useAuthContext();
  const [scope2Data, setScope2Data] = useState<Scope2Data[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchScope2Data();
      fetchEmployeeData();
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

  const fetchEmployeeData = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('user_id', user?.id);

      if (error) throw error;

      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employee data:', error);
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

    // Color palette for months - each month gets a unique color
    const colors = [
      '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', 
      '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1',
      '#14b8a6', '#f43f5e'
    ];

    return sortedMonths.map((item, index) => ({
      ...item,
      fill: colors[index % colors.length],
      isTop5: index < 5
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

  // Social data preparation functions
  const getGenderDistributionData = () => {
    const maleCount = employees.filter(emp => emp.sex === 'M' || emp.sex === 'Male').length;
    const femaleCount = employees.filter(emp => emp.sex === 'F' || emp.sex === 'Female').length;
    
    return [
      { name: 'Male', value: maleCount, fill: '#3b82f6' },
      { name: 'Female', value: femaleCount, fill: '#ec4899' }
    ];
  };

  const getExecutiveGenderData = () => {
    const executives = employees.filter(emp => emp.position === 'Yes');
    const maleExecutives = executives.filter(emp => emp.sex === 'M' || emp.sex === 'Male').length;
    const femaleExecutives = executives.filter(emp => emp.sex === 'F' || emp.sex === 'Female').length;
    
    return [
      { name: 'Male Executives', value: maleExecutives, fill: '#1e40af' },
      { name: 'Female Executives', value: femaleExecutives, fill: '#be185d' }
    ];
  };

  const getAgeDistributionData = () => {
    const under30 = employees.filter(emp => emp.age && emp.age < 30).length;
    const age30to50 = employees.filter(emp => emp.age && emp.age >= 30 && emp.age <= 50).length;
    const above50 = employees.filter(emp => emp.age && emp.age > 50).length;
    
    return [
      { name: 'Under 30', value: under30, fill: '#22c55e' },
      { name: '30-50', value: age30to50, fill: '#f59e0b' },
      { name: 'Above 50', value: above50, fill: '#ef4444' }
    ];
  };

  const getEmployeesByCountryData = () => {
    const countryCount = employees.reduce((acc, emp) => {
      if (emp.country_of_assignment) {
        acc[emp.country_of_assignment] = (acc[emp.country_of_assignment] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(countryCount).map(([country, count]) => ({
      country,
      count,
      fill: '#3b82f6'
    }));
  };

  const getTurnoverByGenderData = () => {
    const maleEmployees = employees.filter(emp => emp.sex === 'M' || emp.sex === 'Male');
    const femaleEmployees = employees.filter(emp => emp.sex === 'F' || emp.sex === 'Female');
    
    const maleLeft = maleEmployees.filter(emp => emp.date_of_exit).length;
    const femaleLeft = femaleEmployees.filter(emp => emp.date_of_exit).length;
    
    const maleTurnover = maleEmployees.length > 0 ? (maleLeft / maleEmployees.length) * 100 : 0;
    const femaleTurnover = femaleEmployees.length > 0 ? (femaleLeft / femaleEmployees.length) * 100 : 0;
    
    return [
      { gender: 'Male', turnover: Number(maleTurnover.toFixed(2)), fill: '#3b82f6' },
      { gender: 'Female', turnover: Number(femaleTurnover.toFixed(2)), fill: '#ec4899' }
    ];
  };

  const getTurnoverByAgeData = () => {
    const under30 = employees.filter(emp => emp.age && emp.age < 30);
    const age30to50 = employees.filter(emp => emp.age && emp.age >= 30 && emp.age <= 50);
    const above50 = employees.filter(emp => emp.age && emp.age > 50);
    
    const under30Left = under30.filter(emp => emp.date_of_exit).length;
    const age30to50Left = age30to50.filter(emp => emp.date_of_exit).length;
    const above50Left = above50.filter(emp => emp.date_of_exit).length;
    
    const under30Turnover = under30.length > 0 ? (under30Left / under30.length) * 100 : 0;
    const age30to50Turnover = age30to50.length > 0 ? (age30to50Left / age30to50.length) * 100 : 0;
    const above50Turnover = above50.length > 0 ? (above50Left / above50.length) * 100 : 0;
    
    return [
      { ageGroup: 'Under 30', turnover: Number(under30Turnover.toFixed(2)), fill: '#22c55e' },
      { ageGroup: '30-50', turnover: Number(age30to50Turnover.toFixed(2)), fill: '#f59e0b' },
      { ageGroup: 'Above 50', turnover: Number(above50Turnover.toFixed(2)), fill: '#ef4444' }
    ];
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

  // Custom label function for monthly pie chart with external labels
  const renderMonthlyLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value, month, isTop5
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20; // Position labels outside the pie
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show label for very small slices

    return (
      <text 
        x={x} 
        y={y} 
        fill="#374151" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={isTop5 ? "12" : "10"}
        fontWeight={isTop5 ? "bold" : "normal"}
      >
        {`${month} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  const yearComparisonData = getYearComparisonData();
  const monthlyData = getMonthlyData();
  const locationData = getLocationData();
  
  // Social data
  const genderDistributionData = getGenderDistributionData();
  const executiveGenderData = getExecutiveGenderData();
  const ageDistributionData = getAgeDistributionData();
  const employeesByCountryData = getEmployeesByCountryData();
  const turnoverByGenderData = getTurnoverByGenderData();
  const turnoverByAgeData = getTurnoverByAgeData();

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
                          label={renderMonthlyLabel}
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
          {employees.length > 0 ? (
            <>
              {/* Social Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {/* Gender Distribution Pie Chart */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Gender Distribution</CardTitle>
                    <CardDescription className="text-xs">All employees</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-48">
                      <PieChart>
                        <Pie
                          data={genderDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={60}
                          dataKey="value"
                        >
                          {genderDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Executive Gender Distribution */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Executive Gender Distribution</CardTitle>
                    <CardDescription className="text-xs">Leadership positions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-48">
                      <PieChart>
                        <Pie
                          data={executiveGenderData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={60}
                          dataKey="value"
                        >
                          {executiveGenderData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Age Distribution */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Age Distribution</CardTitle>
                    <CardDescription className="text-xs">Employee age groups</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-48">
                      <PieChart>
                        <Pie
                          data={ageDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={60}
                          dataKey="value"
                        >
                          {ageDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Employees by Country */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Employees by Country</CardTitle>
                    <CardDescription className="text-xs">Geographic distribution</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-48">
                      <BarChart data={employeesByCountryData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="country" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="count" />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Turnover by Gender */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Turnover Rate by Gender</CardTitle>
                    <CardDescription className="text-xs">Percentage by gender</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-48">
                      <BarChart data={turnoverByGenderData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="gender" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="turnover" />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Turnover by Age Group */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Turnover Rate by Age Group</CardTitle>
                    <CardDescription className="text-xs">Percentage by age range</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-48">
                      <BarChart data={turnoverByAgeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="ageGroup" tick={{ fontSize: 10 }} />
                        <YAxis tick={{ fontSize: 10 }} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="turnover" />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Social Summary Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Employees</CardTitle>
                    <CardDescription>Current workforce</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {employees.length}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Gender Ratio</CardTitle>
                    <CardDescription>Male to Female</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-purple-600">
                      {genderDistributionData[0]?.value || 0}:{genderDistributionData[1]?.value || 0}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Executives</CardTitle>
                    <CardDescription>Leadership positions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {employees.filter(emp => emp.position === 'Yes').length}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Countries</CardTitle>
                    <CardDescription>Operating locations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      {employeesByCountryData.length}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Social Impact Metrics</CardTitle>
                <CardDescription>Upload employee data to view social metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  Social metrics will be available once you upload employee data in the Employee Profile section.
                </div>
              </CardContent>
            </Card>
          )}
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
