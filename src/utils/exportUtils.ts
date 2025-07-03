import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface EmissionData {
  source: string;
  quantity: number;
  ghgFactor: number;
  co2Emitted: number;
}

interface SummaryData {
  totalQuantity: number;
  totalActiveSources: number;
  totalEmission: number;
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

export const generatePDF = (
  tableData: EmissionData[], 
  summary: SummaryData, 
  onboardingData?: OnboardingData,
  chartData?: ChartData[],
  comparisonData?: ComparisonData,
  scopeNumber: number = 1,
  summaryText?: string
) => {
  console.log('Generating PDF with onboarding data:', onboardingData);
  
  const doc = new jsPDF();
  let currentY = 22;
  
  // Add title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`Scope ${scopeNumber} Carbon Emission Report`, 14, currentY);
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
  
  const tableRows = tableData.map(row => [
    row.source,
    row.quantity.toFixed(4),
    row.ghgFactor.toFixed(4),
    row.co2Emitted.toFixed(4)
  ]);
  
  autoTable(doc, {
    head: [tableHeaders],
    body: tableRows,
    startY: currentY,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [34, 197, 94] }
  });
  
  // Add summaryText at the bottom before the footer
  if (summaryText) {
    const pageHeight = doc.internal.pageSize.height;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    const summaryLines = doc.splitTextToSize(summaryText, 180);
    doc.text(summaryLines, 14, pageHeight - 40 - summaryLines.length * 5);
  }
  
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
  doc.save(`scope-${scopeNumber}-emissions-report.pdf`);
};

export const generateExcel = (tableData: EmissionData[], summary: SummaryData) => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Create summary data
  const summaryData = [
    ['Scope 1 Carbon Emission Report', ''],
    ['', ''],
    ['Summary', ''],
    ['Total Quantity Till Date', summary.totalQuantity.toFixed(4)],
    ['Total Active Sources Of Emission', summary.totalActiveSources.toString()],
    ['Total Emission', `${summary.totalEmission.toFixed(4)} kgCO2e`],
    ['', ''],
    ['Detailed Data', ''],
    ['Description Of Sources', 'Quantity Till Date', 'GHG Emission Factor', 'Co2 Carbon Emitted']
  ];
  
  // Add table data
  const detailedData = tableData.map(row => [
    row.source,
    row.quantity.toFixed(4),
    row.ghgFactor.toFixed(4),
    row.co2Emitted.toFixed(4)
  ]);
  
  // Combine all data
  const allData = [...summaryData, ...detailedData];
  
  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(allData);
  
  // Set column widths
  ws['!cols'] = [
    { width: 30 },
    { width: 20 },
    { width: 20 },
    { width: 20 }
  ];
  
  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Scope 1 Emissions');
  
  // Save the Excel file
  XLSX.writeFile(wb, 'scope-1-emissions-report.xlsx');
};

// Add this function to generate the dynamic summary text
export function generateDynamicSummaryText({
  scope,
  currentEmissions,
  previousEmissions,
  currentEmissionFactors,
  previousEmissionFactors,
  currentQuantity,
  previousQuantity,
  highestMonth
}: {
  scope: 1 | 2 | 3,
  currentEmissions: number,
  previousEmissions?: number,
  currentEmissionFactors?: number[] | number,
  previousEmissionFactors?: number[] | number,
  currentQuantity: number,
  previousQuantity?: number,
  highestMonth: string
}) {
  const scopeLabel = `Scope ${scope}`;
  let emissionChange = 'increased';
  if (previousEmissions !== undefined) {
    emissionChange = currentEmissions > previousEmissions ? 'increased' : 'decreased';
  }
  let efChangeText = '';
  if (scope === 1 && currentEmissionFactors && previousEmissionFactors) {
    const pct = ((currentEmissionFactors as number) - (previousEmissionFactors as number)) / (previousEmissionFactors as number) * 100;
    efChangeText = `${pct > 0 ? 'increase' : 'decrease'} of ${Math.abs(pct).toFixed(1)}%`;
  } else if (scope === 2 && Array.isArray(currentEmissionFactors) && Array.isArray(previousEmissionFactors)) {
    const pctArr = currentEmissionFactors.map((cur, i) => {
      const prev = previousEmissionFactors[i];
      console.log('cur', cur);
      console.log('prev', prev);
      return prev ? ((cur - prev) / prev) * 100 : 0;
    });
    const avgPct = pctArr.reduce((a, b) => a + b, 0) / pctArr.length;
    efChangeText = `${avgPct > 0 ? 'increase' : 'decrease'} of ${Math.abs(avgPct).toFixed(1)}%`;
  }
  let qtyChange = 'reduction';
  if (previousQuantity !== undefined) {
    qtyChange = currentQuantity > previousQuantity ? 'increase' : 'reduction';
  }
  const qtyLabel = scope === 2 ? 'electricity' : 'fuel';
  return `The ${scopeLabel} carbon emission has ${emissionChange} from the previous period. Factors contributing to these changes include the ${efChangeText || '(N/A)'} in the GHG emission factor from the supplier and a ${qtyChange} in the total ${qtyLabel} consumed. The emission factor is out of the Companys control, however the quantity used can be further reduced through energy efficiency management techniques, the highest month of consumption is ${highestMonth}. To reduce emission in the next period, investigate the causes of increase in the bill in this month i.e. when the summer/ winter is at its peak and the airconditioning units/ heater are probably at its highest.`;
}
