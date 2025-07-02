
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
  description?: string;
  reportingPeriod?: string;
}

interface ChartData {
  labels: string[];
  data: number[];
  title: string;
}

interface ComparisonData {
  currentEmissionFactor: number;
  priorEmissionFactor: number;
  hasIncreased: boolean;
  percentageChange: number;
}

const addChartToPDF = (doc: jsPDF, chartData: ChartData[], startY: number): number => {
  let currentY = startY;
  
  chartData.forEach((chart, index) => {
    // Add chart title
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(chart.title, 14, currentY);
    currentY += 10;
    
    // Create a simple table representation of the chart data
    const chartTableData = chart.labels.map((label, i) => [
      label,
      chart.data[i]?.toFixed(2) || '0.00'
    ]);
    
    autoTable(doc, {
      head: [['Category', 'Value (kgCO2e)']],
      body: chartTableData,
      startY: currentY,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [34, 197, 94] },
      margin: { left: 14, right: 14 }
    });
    
    currentY = (doc as any).lastAutoTable.finalY + 15;
    
    // Check if we need a new page
    if (currentY > 250) {
      doc.addPage();
      currentY = 20;
    }
  });
  
  return currentY;
};

const generateComparisonText = (comparison: ComparisonData, scopeNumber: number): string => {
  const scopeName = scopeNumber === 1 ? 'Scope 1' : scopeNumber === 2 ? 'Scope 2' : 'Scope 3';
  const changeDirection = comparison.hasIncreased ? 'increased' : 'decreased';
  const factorChange = comparison.hasIncreased ? 'increase' : 'decrease';
  const consumptionChange = comparison.hasIncreased ? 'increase' : 'reduction';
  const reductionAction = comparison.hasIncreased ? 'reduction' : 'increase';
  
  return `The ${scopeName.toLowerCase()} carbon emission has ${changeDirection} from the previous period. Factors contributing to these changes include the ${factorChange} of ${comparison.percentageChange.toFixed(2)}% in the GHG emission factor from the supplier and a ${consumptionChange} in the total electricity consumed. The emission factor is out of the Company's control, however the quantity used can be further reduced through energy efficiency management techniques, the highest month of consumption is May. To reduce emission in the next period, investigate the causes of ${reductionAction} in the bill in this month i.e. when the summer/winter is at its peak and the air conditioning units/heater are probably at its highest.`;
};

export const generatePDF = (
  tableData: EmissionData[], 
  summary: SummaryData, 
  onboardingData?: OnboardingData,
  chartData?: ChartData[],
  comparisonData?: ComparisonData,
  scopeNumber: number = 1
) => {
  const doc = new jsPDF();
  let currentY = 22;
  
  // Add title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(`Scope ${scopeNumber} Carbon Emission Report`, 14, currentY);
  currentY += 20;
  
  // Add onboarding information if available
  if (onboardingData) {
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
    
    if (onboardingData.description) {
      const descriptionLines = doc.splitTextToSize(`Description: ${onboardingData.description}`, 180);
      doc.text(descriptionLines, 14, currentY);
      currentY += descriptionLines.length * 6;
    }
    
    if (onboardingData.reportingPeriod) {
      doc.text(`Reporting Period End Date: ${onboardingData.reportingPeriod}`, 14, currentY);
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
  
  // Add charts if available
  if (chartData && chartData.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Emission Analysis Charts:', 14, currentY);
    currentY += 10;
    
    currentY = addChartToPDF(doc, chartData, currentY);
  }
  
  // Add comparison analysis if available
  if (comparisonData) {
    // Check if we need a new page
    if (currentY > 200) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Year-over-Year Analysis:', 14, currentY);
    currentY += 10;
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const analysisText = generateComparisonText(comparisonData, scopeNumber);
    const textLines = doc.splitTextToSize(analysisText, 180);
    doc.text(textLines, 14, currentY);
    currentY += textLines.length * 6 + 15;
  }
  
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
