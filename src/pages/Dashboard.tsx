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
  receives_bills_directly: string | null;
  created_at: string;
}

interface Scope1Data {
  id: string;
  source_type: string;
  quantity_used: number | null;
  emission_factor: number | null;
  emissions_kg_co2: number | null;
  created_at: string;
}

interface Scope3Data {
  id: string;
  source_type: string;
  waste_type?: string;
  location_name?: string;
  quantity_used: number | null;
  emission_factor: number | null;
  emissions_kg_co2: number | null;
  receives_bills_directly?: string | null;
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
  const [scope1Data, setScope1Data] = useState<Scope1Data[]>([]);
  const [scope3Data, setScope3Data] = useState<Scope3Data[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchScope2Data();
      fetchScope1Data();
      fetchScope3Data();
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
          receives_bills_directly,
          created_at,
          office_locations!inner(name)
        `)
        .eq('user_id', user.id)
        .not('quantity_used', 'is', null);

      if (error) throw error;

      const formattedData = data?.map(item => ({
        ...item,
        office_location_name: (item as any).office_locations?.name || 'Unknown Location'
      })) || [];

      console.log('Formatted Scope2 Data:', formattedData);
      setScope2Data(formattedData);
    } catch (error) {
      console.error('Error fetching Scope 2 data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchScope1Data = async () => {
    try {
      // Fetch Stationary Combustion (1a)
      const { data: stationaryData, error: stationaryError } = await supabase
        .from('stationary_combustion')
        .select('*')
        .eq('user_id', user.id)
        .not('quantity_used', 'is', null);

      if (stationaryError) throw stationaryError;

      // Fetch Mobile Combustion (1b)
      const { data: mobileData, error: mobileError } = await supabase
        .from('mobile_combustion')
        .select('*')
        .eq('user_id', user.id)
        .not('fuel_per_vehicle', 'is', null);

      if (mobileError) throw mobileError;

      // Fetch Process Emissions (1c)
      const { data: processData, error: processError } = await supabase
        .from('process_emissions')
        .select('*')
        .eq('user_id', user.id)
        .not('quantity_used', 'is', null);

      if (processError) throw processError;

      // Fetch Refrigerant Emissions (1d)
      const { data: refrigerantData, error: refrigerantError } = await supabase
        .from('refrigerant_emissions')
        .select('*')
        .eq('user_id', user.id)
        .not('quantity_used', 'is', null);

      if (refrigerantError) throw refrigerantError;

      // Combine all Scope 1 data
      const combinedData = [
        ...(stationaryData || []).map(item => ({
          ...item,
          source_type: 'Stationary Combustion (1a)',
          emissions_kg_co2: item.quantity_used * (item.emission_factor || 0)
        })),
        ...(mobileData || []).map(item => ({
          ...item,
          source_type: 'Mobile Combustion (1b)',
          quantity_used: item.fuel_per_vehicle,
          emissions_kg_co2: item.fuel_per_vehicle * (item.emission_factor || 0)
        })),
        ...(processData || []).map(item => ({
          ...item,
          source_type: 'Process Emissions (1c)',
          emissions_kg_co2: item.quantity_used * (item.emission_factor || 0)
        })),
        ...(refrigerantData || []).map(item => ({
          ...item,
          source_type: 'Refrigerant Emissions (1d)',
          emissions_kg_co2: item.quantity_used * (item.emission_factor || 0)
        }))
      ];

      setScope1Data(combinedData);
    } catch (error) {
      console.error('Error fetching Scope 1 data:', error);
    }
  };

  const fetchScope3Data = async () => {
    try {
      // Fetch Paper data (3a)
      const { data: paperData, error: paperError } = await supabase
        .from('paper')
        .select('*')
        .eq('user_id', user.id);

      if (paperError) throw paperError;

      // Fetch Water data (3a)
      const { data: waterData, error: waterError } = await supabase
        .from('scope3a_water')
        .select(`
          *,
          office_locations!inner(name)
        `)
        .eq('user_id', user.id)
        .not('quantity_used', 'is', null);

      if (waterError) throw waterError;

      // Combine all Scope 3 data
      const combinedData = [
        ...(paperData || []).map(item => ({
          ...item,
          source_type: 'Paper',
          emissions_kg_co2: item.emissions_kg_co2 || 0
        })),
        ...(waterData || []).map(item => ({
          ...item,
          source_type: 'Water',
          location_name: (item as any).office_locations?.name || 'Unknown Location',
          emissions_kg_co2: item.quantity_used * (item.emission_factor || 0)
        }))
      ];

      setScope3Data(combinedData);
    } catch (error) {
      console.error('Error fetching Scope 3 data:', error);
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

  // Scope 1 Data Preparation Functions
  const getScope1PieData = () => {
    const scope1Emissions = scope1Data.reduce((acc, item) => {
      const sourceType = item.source_type;
      const emissions = item.emissions_kg_co2 || 0;
      
      acc[sourceType] = (acc[sourceType] || 0) + emissions;
      return acc;
    }, {} as Record<string, number>);

    const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444'];
    
    return Object.entries(scope1Emissions).map(([source, emissions], index) => ({
      source,
      emissions: Number(emissions.toFixed(2)),
      fill: colors[index % colors.length]
    }));
  };

  const getScope1YearlyData = () => {
    const currentYear = new Date().getFullYear();
    const years = [currentYear - 2, currentYear - 1, currentYear];
    
    const yearlyData = years.map(year => {
      const yearData = scope1Data.filter(item => 
        new Date(item.created_at).getFullYear() === year
      );
      
      const emissions = {
        year: year.toString(),
        'Stationary Combustion (1a)': 0,
        'Mobile Combustion (1b)': 0,
        'Process Emissions (1c)': 0,
        'Refrigerant Emissions (1d)': 0
      };
      
      yearData.forEach(item => {
        const sourceType = item.source_type as keyof typeof emissions;
        if (sourceType !== 'year') {
          emissions[sourceType] += item.emissions_kg_co2 || 0;
        }
      });
      
      return emissions;
    });
    
    return yearlyData;
  };

  // Scope 3 Data Preparation Functions
  const getScope3PaperTypeData = () => {
    const paperData = scope3Data.filter(item => item.source_type === 'Paper');
    const paperTypes = paperData.reduce((acc, item) => {
      const wasteType = item.waste_type || 'Unknown';
      const emissions = item.emissions_kg_co2 || 0;
      
      acc[wasteType] = (acc[wasteType] || 0) + emissions;
      return acc;
    }, {} as Record<string, number>);

    const colors = ['#22c55e', '#3b82f6', '#f59e0b'];
    
    return Object.entries(paperTypes).map(([type, emissions], index) => ({
      type,
      emissions: Number(emissions.toFixed(2)),
      fill: colors[index % colors.length]
    }));
  };

  const getScope3WaterLocationData = () => {
    // Filter water data where bills are received directly (similar to Scope 2)
    const waterData = scope3Data.filter(item => 
      item.source_type === 'Water' && item.receives_bills_directly === 'yes'
    );
    
    const locationEmissions = waterData.reduce((acc, item) => {
      const location = item.location_name || 'Unknown Location';
      const emissions = item.emissions_kg_co2 || 0;
      
      acc[location] = (acc[location] || 0) + emissions;
      return acc;
    }, {} as Record<string, number>);

    const colors = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    
    return Object.entries(locationEmissions).map(([location, emissions], index) => ({
      location,
      emissions: Number(emissions.toFixed(2)),
      fill: colors[index % colors.length]
    }));
  };

  const getScope3YearlyData = () => {
    const currentYear = new Date().getFullYear();
    const years = [currentYear - 2, currentYear - 1, currentYear];
    
    const yearlyData = years.map(year => {
      const yearData = scope3Data.filter(item => 
        new Date(item.created_at).getFullYear() === year
      );
      
      const emissions = {
        year: year.toString(),
        'Paper': 0,
        'Water': 0
      };
      
      yearData.forEach(item => {
        const sourceType = item.source_type as keyof typeof emissions;
        if (sourceType !== 'year') {
          emissions[sourceType] += item.emissions_kg_co2 || 0;
        }
      });
      
      return emissions;
    });
    
    return yearlyData;
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

  // Fixed month name mapping
  const getMonthName = (monthValue: string | null) => {
    if (!monthValue) return 'Unknown';
    
    // Handle both string numbers and month names
    const monthNum = parseInt(monthValue);
    if (isNaN(monthNum)) {
      // If it's already a month name, return it
      return monthValue;
    }
    
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return monthNames[monthNum - 1] || 'Unknown';
  };

  // Updated monthly data preparation - exclude data where bills aren't received directly
  const getMonthlyData = () => {
    // Filter out data where bills aren't received directly (no monthly breakdown)
    const directBillData = scope2Data.filter(item => item.receives_bills_directly === 'yes');
    
    const monthlyEmissions = directBillData.reduce((acc, item) => {
      const monthValue = item.month;
      const monthName = getMonthName(monthValue);
      const emissions = calculateCO2Emission(item);
      
      console.log('Processing month:', monthValue, 'mapped to:', monthName, 'emissions:', emissions);
      
      acc[monthName] = (acc[monthName] || 0) + emissions;
      return acc;
    }, {} as Record<string, number>);

    console.log('Monthly emissions breakdown:', monthlyEmissions);

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

  // Fixed location data preparation
  const getLocationData = () => {
    const locationEmissions = scope2Data.reduce((acc, item) => {
      const location = item.office_location_name || 'Unknown Location';
      const emissions = calculateCO2Emission(item);
      
      console.log('Processing location:', location, 'emissions:', emissions);
      
      acc[location] = (acc[location] || 0) + emissions;
      return acc;
    }, {} as Record<string, number>);

    console.log('Location emissions breakdown:', locationEmissions);

    return Object.entries(locationEmissions).map(([location, emissions], index) => ({
      location,
      emissions: Number(emissions.toFixed(2)),
      fill: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'][index % 6]
    }));
  };

  // Helper function to parse dates consistently
  const parseDate = (dateString: string | null): Date | null => {
    if (!dateString) return null;
    
    let date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      const dateValue = parseFloat(dateString);
      if (!isNaN(dateValue)) {
        date = new Date((dateValue - 25569) * 86400 * 1000);
      } else {
        const dateParts = dateString.toString().split('/');
        if (dateParts.length === 3) {
          const month = parseInt(dateParts[0]) - 1;
          const day = parseInt(dateParts[1]);
          const year = parseInt(dateParts[2]);
          date = new Date(year, month, day);
        }
      }
    }
    
    return isNaN(date.getTime()) ? null : date;
  };

  // Filter employees for 2025 only
  const employees2025 = employees.filter(emp => {
    const hireDate = parseDate(emp.date_of_employment);
    const exitDate = parseDate(emp.date_of_exit);
    
    if (!hireDate) return false;
    
    // Employee was hired before or during 2025
    const hiredBeforeOrDuring2025 = hireDate.getFullYear() <= 2025;
    
    // Employee was still employed during 2025 (no exit date or exited after 2025)
    const stillEmployedIn2025 = !exitDate || exitDate.getFullYear() > 2025;
    
    return hiredBeforeOrDuring2025 && stillEmployedIn2025;
  });

  // Social data preparation functions - filtered for 2025
  const getGenderDistributionData = () => {
    const maleCount = employees2025.filter(emp => emp.sex === 'M' || emp.sex === 'Male').length;
    const femaleCount = employees2025.filter(emp => emp.sex === 'F' || emp.sex === 'Female').length;
    
    return [
      { name: 'Male', value: maleCount, fill: '#3b82f6' },
      { name: 'Female', value: femaleCount, fill: '#ec4899' }
    ];
  };

  const getExecutiveGenderData = () => {
    const executives = employees2025.filter(emp => emp.position === 'Yes');
    const maleExecutives = executives.filter(emp => emp.sex === 'M' || emp.sex === 'Male').length;
    const femaleExecutives = executives.filter(emp => emp.sex === 'F' || emp.sex === 'Female').length;
    
    return [
      { name: 'Male Exec', value: maleExecutives, fill: '#1e40af' },
      { name: 'Female Exec', value: femaleExecutives, fill: '#be185d' }
    ];
  };

  const getAgeDistributionData = () => {
    const under30 = employees2025.filter(emp => emp.age && emp.age < 30).length;
    const age30to50 = employees2025.filter(emp => emp.age && emp.age >= 30 && emp.age <= 50).length;
    const above50 = employees2025.filter(emp => emp.age && emp.age > 50).length;
    
    return [
      { name: 'Under 30', value: under30, fill: '#22c55e' },
      { name: '30-50', value: age30to50, fill: '#f59e0b' },
      { name: 'Above 50', value: above50, fill: '#ef4444' }
    ];
  };

  const getEmployeesByCountryData = () => {
    const countryCount = employees2025.reduce((acc, emp) => {
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
    // Use the full employees array for turnover calculation
    const maleEmployees = employees.filter(emp => emp.sex === 'M' || emp.sex === 'Male');
    const femaleEmployees = employees.filter(emp => emp.sex === 'F' || emp.sex === 'Female');

    // Count employees who left in 2025
    const maleEmployeesWhoLeftIn2025 = maleEmployees.filter(emp => {
      const exitDate = parseDate(emp.date_of_exit);
      return exitDate && exitDate.getFullYear() === 2025;
    }).length;

    const femaleEmployeesWhoLeftIn2025 = femaleEmployees.filter(emp => {
      const exitDate = parseDate(emp.date_of_exit);
      return exitDate && exitDate.getFullYear() === 2025;
    }).length;

    // Calculate average employees during 2025
    const maleEmployeesAtStartOf2025 = maleEmployees.filter(emp => {
      const hireDate = parseDate(emp.date_of_employment);
      return hireDate && hireDate.getFullYear() <= 2025;
    }).length;

    const maleEmployeesAtEndOf2025 = maleEmployees.filter(emp => {
      const hireDate = parseDate(emp.date_of_employment);
      if (!hireDate || hireDate.getFullYear() > 2025) return false;
      const exitDate = parseDate(emp.date_of_exit);
      return !exitDate || exitDate.getFullYear() > 2025;
    }).length;

    const femaleEmployeesAtStartOf2025 = femaleEmployees.filter(emp => {
      const hireDate = parseDate(emp.date_of_employment);
      return hireDate && hireDate.getFullYear() <= 2025;
    }).length;

    const femaleEmployeesAtEndOf2025 = femaleEmployees.filter(emp => {
      const hireDate = parseDate(emp.date_of_employment);
      if (!hireDate || hireDate.getFullYear() > 2025) return false;
      const exitDate = parseDate(emp.date_of_exit);
      return !exitDate || exitDate.getFullYear() > 2025;
    }).length;

    const averageMaleEmployees = (maleEmployeesAtStartOf2025 + maleEmployeesAtEndOf2025) / 2;
    const averageFemaleEmployees = (femaleEmployeesAtStartOf2025 + femaleEmployeesAtEndOf2025) / 2;

    const maleTurnover = averageMaleEmployees > 0 ? (maleEmployeesWhoLeftIn2025 / averageMaleEmployees) * 100 : 0;
    const femaleTurnover = averageFemaleEmployees > 0 ? (femaleEmployeesWhoLeftIn2025 / averageFemaleEmployees) * 100 : 0;

    return [
      { gender: 'Male', turnover: Number(maleTurnover.toFixed(2)), fill: '#3b82f6' },
      { gender: 'Female', turnover: Number(femaleTurnover.toFixed(2)), fill: '#ec4899' }
    ];
  };

  const getTurnoverByAgeData = () => {
    // Use the full employees array for turnover calculation
    const under30 = employees.filter(emp => emp.age && emp.age < 30);
    const age30to50 = employees.filter(emp => emp.age && emp.age >= 30 && emp.age <= 50);
    const above50 = employees.filter(emp => emp.age && emp.age > 50);

    // Count employees who left in 2025 by age group
    const under30WhoLeftIn2025 = under30.filter(emp => {
      const exitDate = parseDate(emp.date_of_exit);
      return exitDate && exitDate.getFullYear() === 2025;
    }).length;

    const age30to50WhoLeftIn2025 = age30to50.filter(emp => {
      const exitDate = parseDate(emp.date_of_exit);
      return exitDate && exitDate.getFullYear() === 2025;
    }).length;

    const above50WhoLeftIn2025 = above50.filter(emp => {
      const exitDate = parseDate(emp.date_of_exit);
      return exitDate && exitDate.getFullYear() === 2025;
    }).length;

    // Calculate average employees during 2025 by age group
    const under30AtStartOf2025 = under30.filter(emp => {
      const hireDate = parseDate(emp.date_of_employment);
      return hireDate && hireDate.getFullYear() <= 2025;
    }).length;

    const under30AtEndOf2025 = under30.filter(emp => {
      const hireDate = parseDate(emp.date_of_employment);
      if (!hireDate || hireDate.getFullYear() > 2025) return false;
      const exitDate = parseDate(emp.date_of_exit);
      return !exitDate || exitDate.getFullYear() > 2025;
    }).length;

    const age30to50AtStartOf2025 = age30to50.filter(emp => {
      const hireDate = parseDate(emp.date_of_employment);
      return hireDate && hireDate.getFullYear() <= 2025;
    }).length;

    const age30to50AtEndOf2025 = age30to50.filter(emp => {
      const hireDate = parseDate(emp.date_of_employment);
      if (!hireDate || hireDate.getFullYear() > 2025) return false;
      const exitDate = parseDate(emp.date_of_exit);
      return !exitDate || exitDate.getFullYear() > 2025;
    }).length;

    const above50AtStartOf2025 = above50.filter(emp => {
      const hireDate = parseDate(emp.date_of_employment);
      return hireDate && hireDate.getFullYear() <= 2025;
    }).length;

    const above50AtEndOf2025 = above50.filter(emp => {
      const hireDate = parseDate(emp.date_of_employment);
      if (!hireDate || hireDate.getFullYear() > 2025) return false;
      const exitDate = parseDate(emp.date_of_exit);
      return !exitDate || exitDate.getFullYear() > 2025;
    }).length;

    const averageUnder30 = (under30AtStartOf2025 + under30AtEndOf2025) / 2;
    const averageAge30to50 = (age30to50AtStartOf2025 + age30to50AtEndOf2025) / 2;
    const averageAbove50 = (above50AtStartOf2025 + above50AtEndOf2025) / 2;

    const under30Turnover = averageUnder30 > 0 ? (under30WhoLeftIn2025 / averageUnder30) * 100 : 0;
    const age30to50Turnover = averageAge30to50 > 0 ? (age30to50WhoLeftIn2025 / averageAge30to50) * 100 : 0;
    const above50Turnover = averageAbove50 > 0 ? (above50WhoLeftIn2025 / averageAbove50) * 100 : 0;

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
    cx, cy, midAngle, innerRadius, outerRadius, percent, index, month, isTop5
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

  // Custom label function for location pie chart with external labels
  const renderLocationLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index, location
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
        fontSize="12"
        fontWeight="bold"
      >
        {`${location} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  // Custom label function for social pie charts with external labels
  const renderSocialLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value
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
        fontSize="12"
        fontWeight="bold"
      >
        {`${name} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  // Prepare data for charts
  const yearComparisonData = getYearComparisonData();
  const monthlyData = getMonthlyData();
  const locationData = getLocationData();
  
  // Scope 1 data
  const scope1PieData = getScope1PieData();
  const scope1YearlyData = getScope1YearlyData();
  
  // Scope 3 data
  const scope3PaperTypeData = getScope3PaperTypeData();
  const scope3WaterLocationData = getScope3WaterLocationData();
  const scope3YearlyData = getScope3YearlyData();
  
  // Social data
  const genderDistributionData = getGenderDistributionData();
  const executiveGenderData = getExecutiveGenderData();
  const ageDistributionData = getAgeDistributionData();
  const employeesByCountryData = getEmployeesByCountryData();
  const turnoverByGenderData = getTurnoverByGenderData();
  const turnoverByAgeData = getTurnoverByAgeData();

  // --- Social Year Comparison Data ---
  const socialYears = [2025, 2024, 2023];

  // Helper to calculate stats for a given year
  const getSocialStatsForYear = (year: number) => {
    // Parse dates
    const parseDate = (dateString: string | null): Date | null => {
      if (!dateString) return null;
      let date = new Date(dateString);
      if (isNaN(date.getTime())) {
        const dateValue = parseFloat(dateString);
        if (!isNaN(dateValue)) {
          date = new Date((dateValue - 25569) * 86400 * 1000);
        } else {
          const dateParts = dateString.toString().split('/');
          if (dateParts.length === 3) {
            const month = parseInt(dateParts[0]) - 1;
            const day = parseInt(dateParts[1]);
            const year = parseInt(dateParts[2]);
            date = new Date(year, month, day);
          }
        }
      }
      return isNaN(date.getTime()) ? null : date;
    };

    // Employees at start of year
    const employeesAtStart = employees.filter(emp => {
      const hireDate = parseDate(emp.date_of_employment);
      return hireDate && hireDate.getFullYear() <= year;
    }).length;
    // Employees at end of year
    const employeesAtEnd = employees.filter(emp => {
      const hireDate = parseDate(emp.date_of_employment);
      if (!hireDate || hireDate.getFullYear() > year) return false;
      const exitDate = parseDate(emp.date_of_exit);
      return !exitDate || exitDate.getFullYear() > year;
    }).length;
    // Average employees
    const avgEmployees = (employeesAtStart + employeesAtEnd) / 2;
    // Employees who left in year
    const leftInYear = employees.filter(emp => {
      const exitDate = parseDate(emp.date_of_exit);
      return exitDate && exitDate.getFullYear() === year;
    }).length;
    // New hires in year
    const newHires = employees.filter(emp => {
      const hireDate = parseDate(emp.date_of_employment);
      return hireDate && hireDate.getFullYear() === year;
    }).length;
    // Turnover rate
    const turnoverRate = avgEmployees > 0 ? (leftInYear / avgEmployees) * 100 : 0;
    return {
      year,
      avgEmployees,
      turnoverRate: Number(turnoverRate.toFixed(2)),
      newHires
    };
  };

  const socialYearStats = socialYears.map(getSocialStatsForYear);

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
          <Tabs defaultValue="scope1" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="scope1">Scope 1</TabsTrigger>
              <TabsTrigger value="scope2">Scope 2</TabsTrigger>
              <TabsTrigger value="scope3">Scope 3</TabsTrigger>
            </TabsList>

            <TabsContent value="scope1" className="space-y-6">
              {scope1Data.length > 0 ? (
                <>
                  {/* Scope 1 Pie Charts in One Row */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Scope 1 Emissions Distribution</CardTitle>
                        <CardDescription className="text-xs">All emission sources (2025)</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer config={chartConfig} className="h-48">
                          <PieChart>
                            <Pie
                              data={scope1PieData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              label={renderCustomizedLabel}
                              outerRadius={60}
                              dataKey="emissions"
                            >
                              {scope1PieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Pie>
                            <ChartTooltip content={<ChartTooltipContent />} />
                          </PieChart>
                        </ChartContainer>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Scope 1 Year by Year Comparison */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Scope 1 Emissions by Year</CardTitle>
                        <CardDescription className="text-xs">Yearly comparison by source type</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer config={chartConfig} className="h-64">
                          <BarChart data={scope1YearlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="Stationary Combustion (1a)" fill="#22c55e" />
                            <Bar dataKey="Mobile Combustion (1b)" fill="#3b82f6" />
                            <Bar dataKey="Process Emissions (1c)" fill="#f59e0b" />
                            <Bar dataKey="Refrigerant Emissions (1d)" fill="#ef4444" />
                          </BarChart>
                        </ChartContainer>
                      </CardContent>
                    </Card>

                    {/* Summary Statistics */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Scope 1 Total Emissions</CardTitle>
                        <CardDescription>Current year (2025)</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                          {scope1Data.reduce((sum, item) => sum + (item.emissions_kg_co2 || 0), 0).toFixed(2)} kgCO₂e
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Data Points:</span>
                            <span className="font-medium">{scope1Data.length}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Scope 1 Emissions</CardTitle>
                    <CardDescription>Direct emissions from owned or controlled sources</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-gray-500">
                      No Scope 1 emissions data available. Start by adding data in the respective emission categories.
                    </div>
                  </CardContent>
                </Card>
              )}
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

                {/* Monthly Emissions Pie Chart - Only show if there's monthly data */}
                {monthlyData.length > 0 ? (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Monthly CO₂e Emissions (2025)</CardTitle>
                      <CardDescription className="text-xs">Direct billing only</CardDescription>
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
                ) : (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Monthly CO₂e Emissions (2025)</CardTitle>
                      <CardDescription className="text-xs">No monthly data available</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
                        Monthly breakdown not available for area-based calculations
                      </div>
                    </CardContent>
                  </Card>
                )}

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
                          label={renderLocationLabel}
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
              {scope3Data.length > 0 ? (
                <>
                  {/* Scope 3 Pie Charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Paper Types Pie Chart */}
                    {scope3PaperTypeData.length > 0 && (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Paper Waste by Type</CardTitle>
                          <CardDescription className="text-xs">Distribution by disposal method</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ChartContainer config={chartConfig} className="h-48">
                            <PieChart>
                              <Pie
                                data={scope3PaperTypeData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={60}
                                dataKey="emissions"
                              >
                                {scope3PaperTypeData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Pie>
                              <ChartTooltip content={<ChartTooltipContent />} />
                            </PieChart>
                          </ChartContainer>
                        </CardContent>
                      </Card>
                    )}

                    {/* Water Locations Pie Chart - Only show if there's direct billing data */}
                    {scope3WaterLocationData.length > 0 ? (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Water Emissions by Location</CardTitle>
                          <CardDescription className="text-xs">Direct billing only</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ChartContainer config={chartConfig} className="h-48">
                            <PieChart>
                              <Pie
                                data={scope3WaterLocationData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderLocationLabel}
                                outerRadius={60}
                                dataKey="emissions"
                              >
                                {scope3WaterLocationData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                              </Pie>
                              <ChartTooltip content={<ChartTooltipContent />} />
                            </PieChart>
                          </ChartContainer>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Water Emissions by Location</CardTitle>
                          <CardDescription className="text-xs">No direct billing data available</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
                            Location breakdown not available for area-based calculations
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>

                  {/* Scope 3 Year by Year Comparison */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Scope 3 Emissions by Year</CardTitle>
                        <CardDescription className="text-xs">Yearly comparison by source type</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <ChartContainer config={chartConfig} className="h-64">
                          <BarChart data={scope3YearlyData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                            <YAxis tick={{ fontSize: 10 }} />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="Paper" fill="#22c55e" />
                            <Bar dataKey="Water" fill="#3b82f6" />
                          </BarChart>
                        </ChartContainer>
                      </CardContent>
                    </Card>

                    {/* Summary Statistics */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Scope 3 Total Emissions</CardTitle>
                        <CardDescription>Current year (2025)</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                          {scope3Data.reduce((sum, item) => sum + (item.emissions_kg_co2 || 0), 0).toFixed(2)} kgCO₂e
                        </div>
                        <div className="mt-4 space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Paper Emissions:</span>
                            <span className="font-medium">
                              {scope3Data.filter(item => item.source_type === 'Paper')
                                .reduce((sum, item) => sum + (item.emissions_kg_co2 || 0), 0).toFixed(2)} kgCO₂e
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Water Emissions:</span>
                            <span className="font-medium">
                              {scope3Data.filter(item => item.source_type === 'Water')
                                .reduce((sum, item) => sum + (item.emissions_kg_co2 || 0), 0).toFixed(2)} kgCO₂e
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Data Points:</span>
                            <span className="font-medium">{scope3Data.length}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Scope 3 Emissions</CardTitle>
                    <CardDescription>Indirect emissions from value chain</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12 text-gray-500">
                      No Scope 3 emissions data available. Start by adding data in the Paper and Water sections.
                    </div>
                  </CardContent>
                </Card>
              )}
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
                    <CardDescription className="text-xs">All employees (2025)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-48">
                      <PieChart>
                        <Pie
                          data={genderDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderSocialLabel}
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
                    <CardDescription className="text-xs">Leadership positions (2025)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-48">
                      <PieChart>
                        <Pie
                          data={executiveGenderData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderSocialLabel}
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
                    <CardDescription className="text-xs">Employee age groups (2025)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-48">
                      <PieChart>
                        <Pie
                          data={ageDistributionData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderSocialLabel}
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
                    <CardDescription className="text-xs">Geographic distribution (2025)</CardDescription>
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
                    <CardDescription className="text-xs">Percentage by gender (2025)</CardDescription>
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
                    <CardDescription className="text-xs">Percentage by age range (2025)</CardDescription>
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
                    <CardDescription>Current workforce (2025)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      {employees2025.length}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Gender Ratio</CardTitle>
                    <CardDescription>Male to Female (2025)</CardDescription>
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
                    <CardDescription>Leadership positions (2025)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      {employees2025.filter(emp => emp.position === 'Yes').length}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Countries</CardTitle>
                    <CardDescription>Operating locations (2025)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      {employeesByCountryData.length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Social Year Comparison Charts */}
              <div className="mt-8">
                <h2 className="text-lg font-bold mb-4">Year-by-Year Comparison</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Total Employees by Year */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Total Employees by Year</CardTitle>
                      <CardDescription className="text-xs">Average number of employees</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig} className="h-48">
                        <BarChart data={socialYearStats}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="avgEmployees" fill="#3b82f6" />
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                  {/* Turnover Rate by Year */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Turnover Rate by Year</CardTitle>
                      <CardDescription className="text-xs">% of employees who left</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig} className="h-48">
                        <BarChart data={socialYearStats}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="turnoverRate" fill="#ef4444" />
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                  {/* New Hires by Year */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">New Hires by Year</CardTitle>
                      <CardDescription className="text-xs">Employees hired each year</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ChartContainer config={chartConfig} className="h-48">
                        <BarChart data={socialYearStats}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="year" tick={{ fontSize: 10 }} />
                          <YAxis tick={{ fontSize: 10 }} />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Bar dataKey="newHires" fill="#22c55e" />
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>
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
