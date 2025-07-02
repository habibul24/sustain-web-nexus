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

// Dashboard-style chart generation that matches the dashboard exactly
const generateDashboardStyleChart = (chartData: ChartData): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 300;
  const ctx = canvas.getContext('2d')!;

  // Clear canvas with white background
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (chartData.type === 'doughnut' || chartData.type === 'pie') {
    // Generate dashboard-style pie chart
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 40;
    const total = chartData.data.reduce((sum, val) => sum + val, 0);
    
    if (total === 0) {
      // Handle empty data
      ctx.fillStyle = '#f3f4f6';
      ctx.font = '14px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('No data available', centerX, centerY);
      return canvas;
    }
    
    let currentAngle = 0;
    const colors = chartData.colors || ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    
    // Draw pie slices
    chartData.data.forEach((value, index) => {
      if (value === 0) return;
      
      const sliceAngle = (value / total) * 2 * Math.PI;
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = colors[index % colors.length];
      ctx.fill();
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Add percentage labels inside slices (like dashboard)
      if (sliceAngle > 0.1) { // Only show labels for slices > 5%
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelRadius = radius * 0.6;
        const labelX = centerX + labelRadius * Math.cos(labelAngle);
        const labelY = centerY + labelRadius * Math.sin(labelAngle);
        
        ctx.fillStyle = 'white';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const percentage = ((value / total) * 100).toFixed(0);
        ctx.fillText(`${percentage}%`, labelX, labelY);
      }
      
      currentAngle += sliceAngle;
    });
    
    // Add legend with exact values (like dashboard)
    const legendStartY = 20;
    const legendSpacing = 25;
    
    chartData.labels.forEach((label, index) => {
      if (chartData.data[index] === 0) return;
      
      const y = legendStartY + index * legendSpacing;
      
      // Color box
      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(10, y - 8, 16, 16);
      ctx.strokeStyle = '#e5e7eb';
      ctx.lineWidth = 1;
      ctx.strokeRect(10, y - 8, 16, 16);
      
      // Label and value
      ctx.fillStyle = '#374151';
      ctx.font = '12px Arial';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${label}: ${chartData.data[index].toFixed(2)} kgCO₂e`, 35, y);
    });
    
  } else if (chartData.type === 'bar') {
    // Generate dashboard-style bar chart
    const maxValue = Math.max(...chartData.data);
    const barWidth = (canvas.width - 100) / chartData.data.length;
    const chartHeight = canvas.height - 100;
    const colors = chartData.colors || ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    
    // Draw grid lines
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = 40 + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(60, y);
      ctx.lineTo(canvas.width - 20, y);
      ctx.stroke();
    }
    
    // Draw bars
    chartData.data.forEach((value, index) => {
      if (value === 0) return;
      
      const barHeight = (value / maxValue) * chartHeight;
      const x = 60 + index * barWidth;
      const y = 40 + chartHeight - barHeight;
      
      // Bar
      ctx.fillStyle = colors[index % colors.length];
      ctx.fillRect(x + 5, y, barWidth - 10, barHeight);
      
      // Value label on top
      ctx.fillStyle = '#374151';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(value.toFixed(1), x + barWidth/2, y - 5);
      
      // X-axis label
      ctx.font = '10px Arial';
      ctx.save();
      ctx.translate(x + barWidth/2, 40 + chartHeight + 15);
      ctx.rotate(-Math.PI/6);
      ctx.fillText(chartData.labels[index], 0, 0);
      ctx.restore();
    });
    
    // Y-axis
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 40);
    ctx.lineTo(60, 40 + chartHeight);
    ctx.stroke();
    
    // X-axis
    ctx.beginPath();
    ctx.moveTo(60, 40 + chartHeight);
    ctx.lineTo(canvas.width - 20, 40 + chartHeight);
    ctx.stroke();
    
    // Y-axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '10px Arial';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const y = 40 + (chartHeight / 4) * i;
      const value = (maxValue / 4) * (4 - i);
      ctx.fillText(value.toFixed(0), 55, y + 3);
    }
  }
  
  return canvas;
};

const addChartToPDF = (doc: jsPDF, chartData: ChartData[], startY: number): number => {
  let currentY = startY;
  
  chartData.forEach((chart, index) => {
    // Add chart title
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text(chart.title, 14, currentY);
    currentY += 15;
    
    try {
      // Generate dashboard-style chart and add to PDF
      const canvas = generateDashboardStyleChart(chart);
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 140;
      const imgHeight = 105;
      
      // Check if we need a new page
      if (currentY + imgHeight > 250) {
        doc.addPage();
        currentY = 20;
      }
      
      doc.addImage(imgData, 'PNG', 14, currentY, imgWidth, imgHeight);
      currentY += imgHeight + 20;
      
    } catch (error) {
      console.error('Error adding chart to PDF:', error);
      // Fallback to table representation
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
    }
    
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
