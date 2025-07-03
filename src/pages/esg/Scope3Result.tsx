import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../../contexts/AuthContext';
import { supabase } from '../../integrations/supabase/client';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { generatePDF, generateExcel, generateDynamicSummaryText } from '../../utils/exportUtils';
import { jsPDF } from 'jspdf';
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

const Scope3Result = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [paper, setPaper] = useState<PaperData | null>(null);
  const [loading, setLoading] = useState(true);
  const [waterData, setWaterData] = useState<any[]>([]);
  const [waterLoading, setWaterLoading] = useState(true);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);

  useEffect(() => {
    if (user) {
      fetchPaperData();
      fetchWaterData();
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

  const generateDashboardCharts = (paperData: PaperData | null, waterRows: any[]): ChartData[] => {
    const charts: ChartData[] = [];

    // Paper Waste by Type (matching dashboard)
    if (paperData) {
      const paperLabels = [];
      const paperValues = [];
      
      if (paperData.quantity_landfill) {
        paperLabels.push('Landfill');
        paperValues.push((paperData.quantity_landfill || 0) * (paperData.carbon_dioxide_emitted_co2_landfill || 0));
      }
      if (paperData.quantity_recycle) {
        paperLabels.push('Recycle');
        paperValues.push((paperData.quantity_recycle || 0) * (paperData.carbon_dioxide_emitted_co2_recycle || 0));
      }
      if (paperData.quantity_combust) {
        paperLabels.push('Combust');
        paperValues.push((paperData.quantity_combust || 0) * (paperData.carbon_dioxide_emitted_co2_combust || 0));
      }

      if (paperLabels.length > 0) {
        charts.push({
          title: 'Paper Waste by Type',
          labels: paperLabels,
          data: paperValues,
          type: 'doughnut',
          colors: ['#22c55e', '#3b82f6', '#f59e0b']
        });
      }
    }

    // Water Emissions by Location (matching dashboard)
    if (waterRows.length > 0) {
      charts.push({
        title: 'Water Emissions by Location',
        labels: waterRows.map(row => row.name),
        data: waterRows.map(row => row.totalEmission),
        type: 'doughnut',
        colors: ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
      });
    }

    // Paper Emissions by Year (matching dashboard)
    const totalPaperEmission = paperData ? 
      ((paperData.quantity_landfill || 0) * (paperData.carbon_dioxide_emitted_co2_landfill || 0)) +
      ((paperData.quantity_recycle || 0) * (paperData.carbon_dioxide_emitted_co2_recycle || 0)) +
      ((paperData.quantity_combust || 0) * (paperData.carbon_dioxide_emitted_co2_combust || 0)) : 0;

    if (totalPaperEmission > 0) {
      const years = [2024, 2025];
      const yearlyPaperEmissions = years.map((year) => {
        if (year === 2025) return totalPaperEmission;
        return totalPaperEmission * 0.95; // Previous year (simulated)
      });

      charts.push({
        title: 'Paper Emissions by Year',
        labels: years.map(year => year.toString()),
        data: yearlyPaperEmissions,
        type: 'bar',
        colors: ['#ef4444', '#22c55e'] // Red for 2024, Green for 2025
      });
    }

    // Water Emissions by Year (matching dashboard)
    const totalWaterEmission = waterRows.reduce((sum, row) => sum + row.totalEmission, 0);
    if (totalWaterEmission > 0) {
      const years = [2024, 2025];
      const yearlyWaterEmissions = years.map((year) => {
        if (year === 2025) return totalWaterEmission;
        return totalWaterEmission * 0.95; // Previous year (simulated)
      });

      charts.push({
        title: 'Water Emissions by Year',
        labels: years.map(year => year.toString()),
        data: yearlyWaterEmissions,
        type: 'bar',
        colors: ['#ef4444', '#22c55e'] // Red for 2024, Green for 2025
      });
    }

    return charts;
  };

  const calculateYearOverYearComparison = (): ComparisonData | null => {
    const totalEmission = getTotalEmissionWithWater();
    if (totalEmission === 0) return null;

    // For Scope 3, we'll simulate a comparison
    const currentYearFactor = totalEmission;
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

  const fetchWaterData = async () => {
    setWaterLoading(true);
    try {
      const { data, error } = await (supabase.from as any)('scope3a_water')
        .select('*, office_locations(name)')
        .eq('user_id', user.id);
      if (error) throw error;
      setWaterData((data || []) as any);
      
      // Generate charts and comparison after both paper and water data are loaded
      if (!loading) {
        const waterRows = getWaterByLocation(data || []);
        setChartData(generateDashboardCharts(paper, waterRows));
        setComparisonData(calculateYearOverYearComparison());
      }
    } catch (e) {
      console.error('Error fetching water data:', e);
    } finally {
      setWaterLoading(false);
    }
  };

  // Update charts when paper data changes
  useEffect(() => {
    if (paper && !waterLoading) {
      const waterRows = getWaterByLocation(waterData);
      setChartData(generateDashboardCharts(paper, waterRows));
      setComparisonData(calculateYearOverYearComparison());
    }
  }, [paper, waterData]);

  const getWaterByLocation = (data = waterData) => {
    const waterByLocation: Record<string, { name: string, totalQuantity: number, emissionFactor: number, totalEmission: number }> = {};
    data.forEach(row => {
      const loc = row.office_locations?.name || 'Unknown';
      const q = parseFloat(row.quantity_used) || 0;
      const ef = parseFloat(row.emission_factor) || 0;
      if (!waterByLocation[loc]) {
        waterByLocation[loc] = { name: loc, totalQuantity: 0, emissionFactor: ef, totalEmission: 0 };
      }
      waterByLocation[loc].totalQuantity += q;
      waterByLocation[loc].emissionFactor = ef;
      waterByLocation[loc].totalEmission += q * ef;
    });
    return Object.values(waterByLocation);
  };

  const getTotalEmissionWithWater = () => {
    const waterRows = getWaterByLocation();
    const totalWaterEmission = waterRows.reduce((sum, row) => sum + row.totalEmission, 0);
    
    let totalPaperEmission = 0;
    if (paper) {
      const landfillEmission = (paper.quantity_landfill || 0) * (paper.carbon_dioxide_emitted_co2_landfill || 0);
      const recycleEmission = (paper.quantity_recycle || 0) * (paper.carbon_dioxide_emitted_co2_recycle || 0);
      const combustEmission = (paper.quantity_combust || 0) * (paper.carbon_dioxide_emitted_co2_combust || 0);
      const vendorEmission = paper.quantity_vendor || 0;
      totalPaperEmission = landfillEmission + recycleEmission + combustEmission + vendorEmission;
    }
    
    return totalPaperEmission + totalWaterEmission;
  };

  const handleGeneratePDF = () => {
    try {
      const waterRows = getWaterByLocation();
      const totalEmission = getTotalEmissionWithWater();
      const totalQuantity = (paper?.quantity_landfill || 0) + (paper?.quantity_recycle || 0) + 
                           (paper?.quantity_combust || 0) + (paper?.quantity_vendor || 0) +
                           waterRows.reduce((sum, row) => sum + row.totalQuantity, 0);
      const summary = {
        totalQuantity,
        totalActiveSources: (paper ? 1 : 0) + waterRows.length,
        totalEmission
      };
      const previousEmissions = undefined;
      const previousQuantity = undefined;
      const highestMonth = 'May';
      const summaryText = generateDynamicSummaryText({
        scope: 3,
        currentEmissions: totalEmission,
        previousEmissions,
        currentEmissionFactors: undefined,
        previousEmissionFactors: undefined,
        currentQuantity: totalQuantity,
        previousQuantity,
        highestMonth
      });
      // Only generate the PDF with summary, table, and footer (no charts)
      const tableRows = [];
      if (paper) {
        if (paper.quantity_landfill) {
          tableRows.push([
            'Paper - Landfill',
            paper.quantity_landfill.toFixed(4),
            (paper.carbon_dioxide_emitted_co2_landfill || 0).toFixed(4),
            ((paper.quantity_landfill || 0) * (paper.carbon_dioxide_emitted_co2_landfill || 0)).toFixed(4)
          ]);
        }
        if (paper.quantity_recycle) {
          tableRows.push([
            'Paper - Recycle',
            paper.quantity_recycle.toFixed(4),
            (paper.carbon_dioxide_emitted_co2_recycle || 0).toFixed(4),
            ((paper.quantity_recycle || 0) * (paper.carbon_dioxide_emitted_co2_recycle || 0)).toFixed(4)
          ]);
        }
        if (paper.quantity_combust) {
          tableRows.push([
            'Paper - Combust',
            paper.quantity_combust.toFixed(4),
            (paper.carbon_dioxide_emitted_co2_combust || 0).toFixed(4),
            ((paper.quantity_combust || 0) * (paper.carbon_dioxide_emitted_co2_combust || 0)).toFixed(4)
          ]);
        }
        if (paper.quantity_vendor) {
          tableRows.push([
            'Paper - Vendor',
            paper.quantity_vendor.toFixed(4),
            '0.0000',
            paper.quantity_vendor.toFixed(4)
          ]);
        }
      }
      waterRows.forEach(row => {
        tableRows.push([
          `Water - ${row.name}`,
          row.totalQuantity.toFixed(4),
          row.emissionFactor.toFixed(4),
          row.totalEmission.toFixed(4)
        ]);
      });
      generatePDF(tableRows.map(([source, quantity, ghgFactor, co2Emitted]) => ({
        source,
        quantity: Number(quantity),
        ghgFactor: Number(ghgFactor),
        co2Emitted: Number(co2Emitted)
      })), summary, onboardingData, undefined, undefined, 3, summaryText);
      toast.success('PDF generated. Go to Dashboard to print the graphs!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const handleGenerateExcel = () => {
    try {
      const waterRows = getWaterByLocation();
      const totalEmission = getTotalEmissionWithWater();
      const totalQuantity = (paper?.quantity_landfill || 0) + (paper?.quantity_recycle || 0) + 
                           (paper?.quantity_combust || 0) + (paper?.quantity_vendor || 0) +
                           waterRows.reduce((sum, row) => sum + row.totalQuantity, 0);
      
      const summary = {
        totalQuantity,
        totalActiveSources: (paper ? 1 : 0) + waterRows.length,
        totalEmission
      };
      
      const tableData = [];
      
      if (paper) {
        if (paper.quantity_landfill) {
          tableData.push({
            source: 'Paper - Landfill',
            quantity: paper.quantity_landfill,
            ghgFactor: paper.carbon_dioxide_emitted_co2_landfill || 0,
            co2Emitted: (paper.quantity_landfill || 0) * (paper.carbon_dioxide_emitted_co2_landfill || 0)
          });
        }
        if (paper.quantity_recycle) {
          tableData.push({
            source: 'Paper - Recycle',
            quantity: paper.quantity_recycle,
            ghgFactor: paper.carbon_dioxide_emitted_co2_recycle || 0,
            co2Emitted: (paper.quantity_recycle || 0) * (paper.carbon_dioxide_emitted_co2_recycle || 0)
          });
        }
        if (paper.quantity_combust) {
          tableData.push({
            source: 'Paper - Combust',
            quantity: paper.quantity_combust,
            ghgFactor: paper.carbon_dioxide_emitted_co2_combust || 0,
            co2Emitted: (paper.quantity_combust || 0) * (paper.carbon_dioxide_emitted_co2_combust || 0)
          });
        }
        if (paper.quantity_vendor) {
          tableData.push({
            source: 'Paper - Vendor',
            quantity: paper.quantity_vendor,
            ghgFactor: 1,
            co2Emitted: paper.quantity_vendor
          });
        }
      }
      
      waterRows.forEach(row => {
        tableData.push({
          source: `Water - ${row.name}`,
          quantity: row.totalQuantity,
          ghgFactor: row.emissionFactor,
          co2Emitted: row.totalEmission
        });
      });
      
      generateExcel(tableData, summary);
      toast.success('Excel file generated successfully!');
    } catch (error) {
      console.error('Error generating Excel:', error);
      toast.error('Failed to generate Excel file');
    }
  };

  const goToDashboardScope3 = () => {
    navigate('/dashboard?tab=environmental&scope=scope3');
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

  // Group water data by location
  const waterByLocation: Record<string, { name: string, totalQuantity: number, emissionFactor: number, totalEmission: number }> = {};
  waterData.forEach(row => {
    const loc = row.office_locations?.name || 'Unknown';
    const q = parseFloat(row.quantity_used) || 0;
    const ef = parseFloat(row.emission_factor) || 0;
    if (!waterByLocation[loc]) {
      waterByLocation[loc] = { name: loc, totalQuantity: 0, emissionFactor: ef, totalEmission: 0 };
    }
    waterByLocation[loc].totalQuantity += q;
    // If emission factor varies, you could average or just use the last one
    waterByLocation[loc].emissionFactor = ef;
    waterByLocation[loc].totalEmission += q * ef;
  });
  const waterRows = Object.values(waterByLocation);

  // Calculate total water emission
  const totalWaterEmission = waterRows.reduce((sum, row) => sum + row.totalEmission, 0);

  // Add water emission to total emission
  const totalEmissionWithWater = totalEmission + totalWaterEmission;

  // Calculate total paper quantity and emission
  const totalPaperQuantity = (paper?.quantity_landfill || 0) + (paper?.quantity_recycle || 0) + (paper?.quantity_combust || 0) + (paper?.quantity_vendor || 0);
  const totalPaperEmission = landfillEmission + recycleEmission + combustEmission + (vendorEmission || 0);

  const summary = [
    { label: 'Total Landfill Emission', value: `${landfillEmission.toFixed(2)} kgCO2e` },
    { label: 'Total Recycle Emission', value: `${recycleEmission.toFixed(2)} kgCO2e` },
    { label: 'Total Combustion Emission', value: `${combustEmission.toFixed(2)} kgCO2e` },
    { label: 'Vendor Emission', value: vendorEmission != null ? `${vendorEmission.toFixed(2)} kgCO2e` : 'N/A' },
    { label: 'Total Water Emission', value: `${totalWaterEmission.toFixed(2)} kgCO2e` },
    { label: 'Total Emission', value: `${totalEmissionWithWater.toFixed(2)} kgCO2e` },
  ];

  // For vendor, only include if quantity_vendor is not null
  const vendorRow = (paper?.quantity_vendor != null)
    ? {
        type: 'Vendor',
        quantity: paper.quantity_vendor,
        factor: 'N/A',
        emission: vendorEmission != null ? vendorEmission.toFixed(2) : 'N/A',
      }
    : null;

  const tableRows = [
    {
      type: 'Landfill',
      quantity: paper?.quantity_landfill ?? 0,
      factor: paper?.carbon_dioxide_emitted_co2_landfill ?? 0,
      emission: landfillEmission.toFixed(2),
    },
    {
      type: 'Recycle',
      quantity: paper?.quantity_recycle ?? 0,
      factor: paper?.carbon_dioxide_emitted_co2_recycle ?? 0,
      emission: recycleEmission.toFixed(2),
    },
    {
      type: 'Combust',
      quantity: paper?.quantity_combust ?? 0,
      factor: paper?.carbon_dioxide_emitted_co2_combust ?? 0,
      emission: combustEmission.toFixed(2),
    },
    ...(vendorRow ? [vendorRow] : []),
  ];

  // For paper tableRows, add a total row
  const totalPaperTableQuantity = tableRows.reduce((sum, row) => sum + (typeof row.quantity === 'string' ? parseFloat(row.quantity) : (typeof row.quantity === 'number' ? row.quantity : 0)), 0);
  const totalPaperTableEmission = tableRows.reduce((sum, row) => sum + (typeof row.emission === 'string' ? parseFloat(row.emission) : (typeof row.emission === 'number' ? row.emission : 0)), 0);
  const totalPaperTableFactor = totalPaperTableQuantity > 0 ? totalPaperTableEmission / totalPaperTableQuantity : 0;
  // For water table, add a total row
  const totalWaterTableQuantity = waterRows.reduce((sum, row) => sum + row.totalQuantity, 0);
  const totalWaterTableEmission = waterRows.reduce((sum, row) => sum + row.totalEmission, 0);
  const totalWaterTableFactor = totalWaterTableQuantity > 0 ? totalWaterTableEmission / totalWaterTableQuantity : 0;

  return (
    <div className="max-w-4xl mx-auto p-6 relative">
      <button
        className="mb-4 px-4 py-2 bg-yellow-600 text-white rounded"
        onClick={goToDashboardScope3}
      >
        Go to Scope 3 Dashboard
      </button>
      <h1 className="text-2xl md:text-3xl font-bold mb-8">Your Scope 3 Carbon Emission Results</h1>
      {/* Paper summary table */}
      <h2 className="text-xl font-bold mb-2">Waste Paper Summary</h2>
      <table className="min-w-[300px] mb-6">
        <tbody>
          <tr>
            <td className="font-semibold pr-4">Total Paper Quantity</td>
            <td>{totalPaperQuantity.toFixed(2)} kg</td>
          </tr>
          <tr>
            <td className="font-semibold pr-4">Total Paper Emission</td>
            <td>{totalPaperEmission.toFixed(2)} kgCO2e</td>
          </tr>
        </tbody>
      </table>
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
            <tr className="font-bold bg-green-50">
              <td className="py-2 px-3">Total</td>
              <td className="py-2 px-3">{totalPaperTableQuantity.toFixed(2)}</td>
              <td className="py-2 px-3">{totalPaperTableFactor.toFixed(3)}</td>
              <td className="py-2 px-3">{totalPaperTableEmission.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {/* Water Results Section */}
      {waterLoading ? (
        <div className="text-center">Loading water data...</div>
      ) : waterRows.length === 0 ? (
        <div className="text-center">No water data found.</div>
      ) : (
        <>
          {/* Water summary table */}
          <h2 className="text-xl font-bold mb-2 mt-10">Waste Water Summary</h2>
          <table className="min-w-[300px] mb-6">
            <tbody>
              <tr>
                <td className="font-semibold pr-4">Total Water Quantity</td>
                <td>{waterRows.reduce((sum, row) => sum + row.totalQuantity, 0).toFixed(2)} m³</td>
              </tr>
              <tr>
                <td className="font-semibold pr-4">Total Water Emission</td>
                <td>{totalWaterEmission.toFixed(2)} kgCO2e</td>
              </tr>
            </tbody>
          </table>
          <div className="bg-white rounded-xl shadow p-4 mb-4 overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-3 font-semibold">Location</th>
                  <th className="py-2 px-3 font-semibold">Total Quantity</th>
                  <th className="py-2 px-3 font-semibold">Emission Factor</th>
                  <th className="py-2 px-3 font-semibold">Total CO2e Emission (kg CO2e)</th>
                </tr>
              </thead>
              <tbody>
                {waterRows.map((row, idx) => (
                  <tr key={row.name + idx}>
                    <td className="py-2 px-3">{row.name}</td>
                    <td className="py-2 px-3">{row.totalQuantity.toFixed(2)}</td>
                    <td className="py-2 px-3">{row.emissionFactor}</td>
                    <td className="py-2 px-3">{row.totalEmission.toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="font-bold bg-green-50">
                  <td className="py-2 px-3">Total</td>
                  <td className="py-2 px-3">{totalWaterTableQuantity.toFixed(2)}</td>
                  <td className="py-2 px-3">{totalWaterTableFactor.toFixed(3)}</td>
                  <td className="py-2 px-3">{totalWaterTableEmission.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
      <div className="flex flex-row gap-4 justify-end fixed bottom-8 right-8 z-50">
        <Button onClick={handleGenerateExcel} className="bg-green-600 hover:bg-green-700 text-white">Generate Excel</Button>
        <Button onClick={handleGeneratePDF} className="bg-green-600 hover:bg-green-700 text-white">Generate PDF</Button>
        <Button onClick={() => navigate('/my-esg/social/employee-profile')} className="bg-green-600 hover:bg-green-700 text-white">Next</Button>
      </div>
    </div>
  );
};

export default Scope3Result;
