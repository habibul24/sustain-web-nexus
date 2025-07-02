import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';
import { generatePDF, generateExcel } from '../../utils/exportUtils';

interface EmissionData {
  source: string;
  quantity: number;
  ghgFactor: number;
  co2Emitted: number;
}

interface OnboardingData {
  companyName?: string;
  operationsDescription?: string;
  reportingYearEndDate?: string;
}

interface ChartData {
  labels: string[];
  data: number[];
  title: string;
  type: 'pie' | 'bar' | 'doughnut';
  colors?: string[];
}

interface ComparisonData {
  currentEmissionFactor: number;
  priorEmissionFactor: number;
  hasIncreased: boolean;
  percentageChange: number;
}

const Scope1Result = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tableData, setTableData] = useState<EmissionData[]>([]);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalActiveSources, setTotalActiveSources] = useState(0);
  const [totalEmission, setTotalEmission] = useState(0);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);

  useEffect(() => {
    if (user) {
      fetchAllEmissionData();
      fetchOnboardingData();
    }
  }, [user]);

  const fetchOnboardingData = async () => {
    try {
      console.log('Fetching onboarding data for user:', user?.id);
      
      // Fetch from user_profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('company_name, operations_description, reporting_year_end_date')
        .eq('id', user?.id)
        .single();

      console.log('Profile data:', profileData, 'Error:', profileError);

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile data:', profileError);
      }

      setOnboardingData({
        companyName: profileData?.company_name || undefined,
        operationsDescription: profileData?.operations_description || undefined,
        reportingYearEndDate: profileData?.reporting_year_end_date || undefined,
      });
    } catch (error) {
      console.error('Error fetching onboarding data:', error);
    }
  };

  const generateDashboardCharts = (allData: EmissionData[]): ChartData[] => {
    const charts: ChartData[] = [];
    
    if (allData.length === 0) return charts;

    // Group data by categories for Scope 1 subcategories (matching dashboard logic)
    const stationaryData = allData.filter(item => 
      item.source.includes('Diesel oil') || 
      item.source.includes('Kerosene') || 
      item.source.includes('Liquefied Petroleum Gas') || 
      item.source.includes('Charcoal') || 
      item.source.includes('Towngas')
    );
    
    const mobileData = allData.filter(item => 
      item.source.includes('Motorcycle') || 
      item.source.includes('Car') || 
      item.source.includes('Van') || 
      item.source.includes('bus') || 
      item.source.includes('Vehicle') || 
      item.source.includes('Ships') || 
      item.source.includes('Aviation')
    );
    
    const processData = allData.filter(item => 
      !stationaryData.includes(item) && 
      !mobileData.includes(item) && 
      !item.source.includes('R-') && 
      !item.source.includes('HFC')
    );
    
    const refrigerantData = allData.filter(item => 
      item.source.includes('R-') || 
      item.source.includes('HFC')
    );

    // Chart 1a: Stationary Combustion Breakdown (matching dashboard colors)
    if (stationaryData.length > 0) {
      const stationaryLabels = stationaryData.map(item => item.source);
      const stationaryValues = stationaryData.map(item => item.co2Emitted);
      charts.push({
        title: 'Stationary Combustion (1a)',
        labels: stationaryLabels,
        data: stationaryValues,
        type: 'doughnut',
        colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']
      });
    }

    // Chart 1b: Mobile Combustion Breakdown (matching dashboard colors)
    if (mobileData.length > 0) {
      const mobileLabels = mobileData.map(item => item.source);
      const mobileValues = mobileData.map(item => item.co2Emitted);
      charts.push({
        title: 'Mobile Combustion (1c)',
        labels: mobileLabels,
        data: mobileValues,
        type: 'doughnut',
        colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']
      });
    }

    // Chart 1c: Process Emissions Breakdown (matching dashboard colors)
    if (processData.length > 0) {
      const processLabels = processData.map(item => item.source);
      const processValues = processData.map(item => item.co2Emitted);
      charts.push({
        title: 'Process Emissions (1b)',
        labels: processLabels,
        data: processValues,
        type: 'doughnut',
        colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']
      });
    }

    // Chart 1d: Refrigerant Emissions Breakdown (matching dashboard colors)
    if (refrigerantData.length > 0) {
      const refrigerantLabels = refrigerantData.map(item => item.source);
      const refrigerantValues = refrigerantData.map(item => item.co2Emitted);
      charts.push({
        title: 'Refrigerant Emissions (1d)',
        labels: refrigerantLabels,
        data: refrigerantValues,
        type: 'doughnut',
        colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6']
      });
    }

    // Scope 1 Emissions by Year (Bar chart) - matching dashboard yearly comparison
    const years = [2024, 2025];
    const yearlyEmissions = years.map((year, index) => {
      if (year === 2025) return totalEmission; // Current year
      return totalEmission * 1.15; // Previous year (simulated)
    });

    charts.push({
      title: 'Scope 1 Emissions by Year',
      labels: years.map(year => year.toString()),
      data: yearlyEmissions,
      type: 'bar',
      colors: ['#ef4444', '#22c55e'] // Red for 2024, Green for 2025
    });

    return charts;
  };

  const calculateYearOverYearComparison = (allData: EmissionData[]): ComparisonData | null => {
    if (allData.length === 0) return null;

    // For Scope 1, we'll use an average of all emission factors
    const currentYearFactor = allData.reduce((sum, item) => sum + item.ghgFactor, 0) / allData.length;
    
    // Simulate prior year data (in a real scenario, this would come from historical data)
    // For demonstration, we'll assume a 5% difference
    const priorYearFactor = currentYearFactor * 0.95;
    
    const hasIncreased = currentYearFactor > priorYearFactor;
    const percentageChange = Math.abs(((currentYearFactor - priorYearFactor) / priorYearFactor) * 100);

    return {
      currentEmissionFactor: currentYearFactor,
      priorEmissionFactor: priorYearFactor,
      hasIncreased,
      percentageChange
    };
  };

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
      
      // Generate dashboard-style chart data and comparison
      setChartData(generateDashboardCharts(allData));
      setComparisonData(calculateYearOverYearComparison(allData));

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

  const handleGeneratePDF = () => {
    try {
      console.log('Generating PDF with onboarding data:', onboardingData);
      const summary = {
        totalQuantity,
        totalActiveSources,
        totalEmission
      };
      
      generatePDF(
        tableData, 
        summary, 
        onboardingData, 
        chartData, 
        comparisonData || undefined,
        1
      );
      toast.success('PDF generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const handleGenerateExcel = () => {
    try {
      const summary = {
        totalQuantity,
        totalActiveSources,
        totalEmission
      };
      generateExcel(tableData, summary);
      toast.success('Excel file generated successfully!');
    } catch (error) {
      console.error('Error generating Excel:', error);
      toast.error('Failed to generate Excel file');
    }
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
        <Button 
          className="bg-green-500 hover:bg-green-600 text-white" 
          variant="default"
          onClick={handleGeneratePDF}
        >
          Generate PDF
        </Button>
        <Button 
          className="bg-green-500 hover:bg-green-600 text-white" 
          variant="default"
          onClick={handleGenerateExcel}
        >
          Generate Excel
        </Button>
        <Button 
          className="bg-green-500 hover:bg-green-600 text-white" 
          variant="default" 
          onClick={() => navigate('/my-esg/environmental/scope-2')}
        >
          Next &rarr;
        </Button>
      </div>
    </div>
  );
};

export default Scope1Result;
