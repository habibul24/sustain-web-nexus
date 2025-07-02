import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { supabase } from '../../integrations/supabase/client';
import { useAuthContext } from '../../contexts/AuthContext';
import { toast } from 'sonner';
import { generatePDF, generateExcel } from '../../utils/exportUtils';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  receives_bills_directly: string;
  total_building_electricity: number | null;
}

interface LocationSummary {
  location: string;
  totalQuantity: number;
  emissionFactor: number;
  totalEmission: number;
  receivesBillsDirectly: string;
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

const Scope2Result = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [scope2Data, setScope2Data] = useState<Scope2Data[]>([]);
  const [loading, setLoading] = useState(true);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);

  useEffect(() => {
    if (user) {
      fetchScope2Data();
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

  const generateDashboardCharts = (locationSummaries: LocationSummary[]): ChartData[] => {
    const charts: ChartData[] = [];
    
    if (locationSummaries.length === 0) return charts;

    const totalEmission = locationSummaries.reduce((sum, loc) => sum + loc.totalEmission, 0);

    // CO₂e Emissions by Location (matching dashboard)
    charts.push({
      title: 'CO₂e Emissions by Location (2025)',
      labels: locationSummaries.map(loc => loc.location),
      data: locationSummaries.map(loc => loc.totalEmission),
      type: 'doughnut',
      colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
    });

    // CO₂e Emissions Year Comparison (matching dashboard)
    const years = [2024, 2025];
    const yearlyEmissions = years.map((year) => {
      if (year === 2025) return totalEmission;
      return totalEmission * 1.15; // Previous year (simulated)
    });

    charts.push({
      title: 'CO₂e Emissions Year Comparison',
      labels: years.map(year => year.toString()),
      data: yearlyEmissions,
      type: 'bar',
      colors: ['#ef4444', '#22c55e'] // Red for 2024, Green for 2025
    });

    // Monthly CO₂e Emissions (if direct billing data available)
    const directBillingData = locationSummaries.filter(loc => loc.receivesBillsDirectly === 'yes');
    if (directBillingData.length > 0) {
      const monthlyData = Array(12).fill(0);
      const monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 
                          'July', 'August', 'September', 'October', 'November', 'December'];
      
      // Simulate monthly distribution (in real implementation, this would come from actual monthly data)
      const avgMonthlyEmission = totalEmission / 12;
      for (let i = 0; i < 12; i++) {
        monthlyData[i] = avgMonthlyEmission * (0.8 + Math.random() * 0.4);
      }

      charts.push({
        title: 'Monthly CO₂e Emissions (2025)',
        labels: monthLabels,
        data: monthlyData,
        type: 'doughnut',
        colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', 
                '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1',
                '#14b8a6', '#f43f5e']
      });
    }

    return charts;
  };

  const calculateYearOverYearComparison = (locationSummaries: LocationSummary[]): ComparisonData | null => {
    if (locationSummaries.length === 0) return null;

    const currentYearFactor = locationSummaries.reduce((sum, item) => sum + item.emissionFactor, 0) / locationSummaries.length;
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
          office_locations!inner(name),
          receives_bills_directly,
          total_building_electricity
        `)
        .eq('user_id', user.id)
        .not('quantity_used', 'is', null);

      if (error) throw error;

      const formattedData = data?.map(item => ({
        ...item,
        office_location_name: (item as any).office_locations?.name || 'Unknown Location'
      })) || [];

      setScope2Data(formattedData);

      // Generate charts and comparison data
      const locationSummaries = getLocationSummaries(formattedData);
      setChartData(generateDashboardCharts(locationSummaries));
      setComparisonData(calculateYearOverYearComparison(locationSummaries));
    } catch (error) {
      console.error('Error fetching Scope 2 data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group data by location and calculate totals
  const getLocationSummaries = (data = scope2Data): LocationSummary[] => {
    const locationGroups: Record<string, Scope2Data[]> = {};
    
    // Group by location
    data.forEach(item => {
      const location = item.office_location_name;
      if (!locationGroups[location]) {
        locationGroups[location] = [];
      }
      locationGroups[location].push(item);
    });

    // Calculate totals for each location
    return Object.entries(locationGroups).map(([location, items]) => {
      // Get the billing method (should be consistent for a location)
      const receivesBillsDirectly = items[0]?.receives_bills_directly || 'yes';
      const emissionFactor = items[0]?.emission_factor || 0;
      
      let totalQuantity = 0;
      let totalEmission = 0;

      if (receivesBillsDirectly === 'yes') {
        // For direct billing: sum up all monthly quantities
        totalQuantity = items.reduce((sum, item) => sum + (item.quantity_used || 0), 0);
        totalEmission = totalQuantity * emissionFactor;
      } else {
        // For indirect billing: use the calculated quantity (should be same for all records)
        const firstItem = items[0];
        if (firstItem && firstItem.organization_area && firstItem.total_building_area && firstItem.total_building_electricity) {
          totalQuantity = (firstItem.organization_area / firstItem.total_building_area) * firstItem.total_building_electricity;
          totalEmission = totalQuantity * emissionFactor;
        }
      }

      return {
        location,
        totalQuantity,
        emissionFactor,
        totalEmission,
        receivesBillsDirectly
      };
    });
  };

  const locationSummaries = getLocationSummaries();

  const getTotalQuantity = () => {
    return locationSummaries.reduce((sum, item) => sum + item.totalQuantity, 0);
  };

  const getTotalEmissions = () => {
    return locationSummaries.reduce((sum, item) => sum + item.totalEmission, 0);
  };

  const getActiveSources = () => {
    return locationSummaries.length;
  };

  const handleGeneratePDF = () => {
    try {
      const summary = {
        totalQuantity: getTotalQuantity(),
        totalActiveSources: getActiveSources(),
        totalEmission: getTotalEmissions()
      };
      // Only generate the PDF with summary, table, and footer (no charts)
      const doc = new jsPDF();
      let currentY = 22;
      // Add title
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(`Scope 2 Carbon Emission Report`, 14, currentY);
      currentY += 20;
      // Add onboarding information if available
      if (onboardingData && (onboardingData.companyName || onboardingData.operationsDescription || onboardingData.reportingYearEndDate)) {
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Company Information:', 14, currentY);
        currentY += 10;
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        if (onboardingData.companyName) {
          doc.text(`Company Name: ${onboardingData.companyName}`, 14, currentY);
          currentY += 8;
        }
        if (onboardingData.operationsDescription) {
          const descriptionLines = doc.splitTextToSize(`Operations Description: ${onboardingData.operationsDescription}`, 180);
          doc.text(descriptionLines, 14, currentY);
          currentY += descriptionLines.length * 6;
        }
        if (onboardingData.reportingYearEndDate) {
          doc.text(`Reporting Year End Date: ${onboardingData.reportingYearEndDate}`, 14, currentY);
          currentY += 8;
        }
        currentY += 10;
      }
      // Add summary section
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Summary:', 14, currentY);
      currentY += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total Quantity Till Date: ${summary.totalQuantity.toFixed(4)}`, 14, currentY);
      currentY += 8;
      doc.text(`Total Active Sources Of Emission: ${summary.totalActiveSources}`, 14, currentY);
      currentY += 8;
      doc.text(`Total Emission: ${summary.totalEmission.toFixed(4)} kgCO2e`, 14, currentY);
      currentY += 15;
      // Add detailed data table
      const tableHeaders = [
        'Description Of Sources',
        'Quantity Till Date',
        'GHG Emission Factor',
        'Co2 Carbon Emitted'
      ];
      const tableRows = locationSummaries.map(row => [
        row.location,
        row.totalQuantity.toFixed(4),
        row.emissionFactor.toFixed(4),
        row.totalEmission.toFixed(4)
      ]);
      autoTable(doc, {
        head: [tableHeaders],
        body: tableRows,
        startY: currentY,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [34, 197, 94] }
      });
      // Add footer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.text(
          `Generated on ${new Date().toLocaleDateString()} - Page ${i} of ${pageCount}`,
          14,
          doc.internal.pageSize.height - 10
        );
      }
      // Save the PDF
      doc.save(`scope-2-emissions-report.pdf`);
      toast.success('PDF generated. Go to Dashboard to print the graphs!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const handleGenerateExcel = () => {
    try {
      const summary = {
        totalQuantity: getTotalQuantity(),
        totalActiveSources: getActiveSources(),
        totalEmission: getTotalEmissions()
      };
      
      const tableData = locationSummaries.map(row => ({
        source: row.location,
        quantity: row.totalQuantity,
        ghgFactor: row.emissionFactor,
        co2Emitted: row.totalEmission
      }));
      
      generateExcel(tableData, summary);
      toast.success('Excel file generated successfully!');
    } catch (error) {
      console.error('Error generating Excel:', error);
      toast.error('Failed to generate Excel file');
    }
  };

  const summary = [
    { label: 'Total Quantity Till Date', value: `${getTotalQuantity().toFixed(2)} kWh` },
    { label: 'Total Active Sources', value: getActiveSources().toString() },
    { label: 'Total Emission', value: `${getTotalEmissions().toFixed(2)} kgCO2e` },
  ];

  const goToDashboardScope2 = () => {
    navigate('/dashboard?tab=environmental&scope=scope2');
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={goToDashboardScope2}
      >
        Go to Scope 2 Dashboard
      </button>
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Your Scope 2 Carbon Emission Results</h1>
      
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
              <th className="py-2 px-3 font-semibold">Location</th>
              <th className="py-2 px-3 font-semibold">Total Quantity (kWh)</th>
              <th className="py-2 px-3 font-semibold">GHG Emission Factor</th>
              <th className="py-2 px-3 font-semibold">CO2 Carbon Emitted (kgCO2e)</th>
            </tr>
          </thead>
          <tbody>
            {locationSummaries.map(row => (
              <tr key={row.location}>
                <td className="py-2 px-3">{row.location}</td>
                <td className="py-2 px-3">{row.totalQuantity.toFixed(2)}</td>
                <td className="py-2 px-3">{row.emissionFactor.toFixed(3)}</td>
                <td className="py-2 px-3">{row.totalEmission.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mb-6 text-gray-700 text-sm">
        Emission Factor Source: <a href="#" className="text-green-700 underline">View Reference</a>
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
          onClick={() => navigate('/my-esg/environmental/scope-3')}
        >
          Next &rarr;
        </Button>
      </div>
    </div>
  );
};

export default Scope2Result;
