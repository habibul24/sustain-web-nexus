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
  scopeNumber: number = 1
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
