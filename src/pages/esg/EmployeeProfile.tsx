import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { supabase } from '../../integrations/supabase/client';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'sonner';
import { generatePDF, generateExcel } from '../../utils/exportUtils';
import { useNavigate } from 'react-router-dom';

interface Employee {
  id: string;
  name: string;
  position: string | null;
  category_department: string | null;
  age: number | null;
  sex: string | null;
  salary: number | null;
  date_of_employment: string | null;
  date_of_exit: string | null;
  is_executive: boolean | null;
  level_designation: string | null;
  work_mode: string | null;
  country_of_assignment: string | null;
  factory_of_assignment: string | null;
  employee_number: string | null;
  serial_number: number | null;
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
}

interface ComparisonData {
  currentEmissionFactor: number;
  priorEmissionFactor: number;
  hasIncreased: boolean;
  percentageChange: number;
}

const EmployeeProfile = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchEmployees();
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

  const generateDashboardCharts = (employeeData: Employee[]): ChartData[] => {
    const charts: ChartData[] = [];
    
    if (employeeData.length === 0) return charts;

    // Employee Distribution by Department
    const departmentCounts: Record<string, number> = {};
    employeeData.forEach(emp => {
      const dept = emp.category_department || 'Unknown';
      departmentCounts[dept] = (departmentCounts[dept] || 0) + 1;
    });

    if (Object.keys(departmentCounts).length > 0) {
      charts.push({
        title: 'Employee Distribution by Department',
        labels: Object.keys(departmentCounts),
        data: Object.values(departmentCounts),
        type: 'doughnut'
      });
    }

    // Employee Distribution by Gender
    const genderCounts: Record<string, number> = {};
    employeeData.forEach(emp => {
      const gender = emp.sex || 'Unknown';
      genderCounts[gender] = (genderCounts[gender] || 0) + 1;
    });

    if (Object.keys(genderCounts).length > 0) {
      charts.push({
        title: 'Employee Distribution by Gender',
        labels: Object.keys(genderCounts),
        data: Object.values(genderCounts),
        type: 'pie'
      });
    }

    // Employee Distribution by Work Mode
    const workModeCounts: Record<string, number> = {};
    employeeData.forEach(emp => {
      const mode = emp.work_mode || 'Unknown';
      workModeCounts[mode] = (workModeCounts[mode] || 0) + 1;
    });

    if (Object.keys(workModeCounts).length > 0) {
      charts.push({
        title: 'Employee Distribution by Work Mode',
        labels: Object.keys(workModeCounts),
        data: Object.values(workModeCounts),
        type: 'doughnut'
      });
    }

    // Employee Growth by Year (using employment dates)
    const currentYear = new Date().getFullYear();
    const years = [currentYear - 2, currentYear - 1, currentYear];
    const yearlyHires = years.map(year => {
      return employeeData.filter(emp => {
        if (!emp.date_of_employment) return false;
        const empYear = new Date(emp.date_of_employment).getFullYear();
        return empYear === year;
      }).length;
    });

    charts.push({
      title: 'Employee Hiring Trend by Year',
      labels: years.map(year => year.toString()),
      data: yearlyHires,
      type: 'bar'
    });

    // Age Distribution
    const ageBands: Record<string, number> = {
      '18-25': 0,
      '26-35': 0,
      '36-45': 0,
      '46-55': 0,
      '56+': 0,
      'Unknown': 0
    };

    employeeData.forEach(emp => {
      if (!emp.age) {
        ageBands['Unknown']++;
      } else if (emp.age <= 25) {
        ageBands['18-25']++;
      } else if (emp.age <= 35) {
        ageBands['26-35']++;
      } else if (emp.age <= 45) {
        ageBands['36-45']++;
      } else if (emp.age <= 55) {
        ageBands['46-55']++;
      } else {
        ageBands['56+']++;
      }
    });

    charts.push({
      title: 'Employee Age Distribution',
      labels: Object.keys(ageBands),
      data: Object.values(ageBands),
      type: 'bar'
    });

    return charts;
  };

  const calculateYearOverYearComparison = (employeeData: Employee[]): ComparisonData | null => {
    if (employeeData.length === 0) return null;

    const currentYear = new Date().getFullYear();
    const currentYearHires = employeeData.filter(emp => {
      if (!emp.date_of_employment) return false;
      const empYear = new Date(emp.date_of_employment).getFullYear();
      return empYear === currentYear;
    }).length;

    const priorYearHires = employeeData.filter(emp => {
      if (!emp.date_of_employment) return false;
      const empYear = new Date(emp.date_of_employment).getFullYear();
      return empYear === currentYear - 1;
    }).length;

    if (priorYearHires === 0) return null;

    const hasIncreased = currentYearHires > priorYearHires;
    const percentageChange = Math.abs(((currentYearHires - priorYearHires) / priorYearHires) * 100);

    return {
      currentEmissionFactor: currentYearHires,
      priorEmissionFactor: priorYearHires,
      hasIncreased,
      percentageChange
    };
  };

  const fetchEmployees = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setEmployees(data || []);
      
      // Generate charts and comparison data
      setChartData(generateDashboardCharts(data || []));
      setComparisonData(calculateYearOverYearComparison(data || []));
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast.error('Failed to load employee data');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Handle file upload logic here
    setUploadSuccess(true);
    toast.success('File uploaded successfully!');
    
    // Reset after 3 seconds
    setTimeout(() => setUploadSuccess(false), 3000);
  };

  const downloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/Employee Profile Template.xlsx';
    link.download = 'Employee Profile Template.xlsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGeneratePDF = () => {
    try {
      const summary = {
        totalQuantity: employees.length,
        totalActiveSources: new Set(employees.map(emp => emp.category_department || 'Unknown')).size,
        totalEmission: 0 // Not applicable for employee data
      };
      
      const tableData = employees.map(emp => ({
        source: emp.name,
        quantity: emp.salary || 0,
        ghgFactor: 0, // Not applicable
        co2Emitted: 0 // Not applicable
      }));
      
      generatePDF(
        tableData, 
        summary, 
        onboardingData, 
        chartData, 
        comparisonData || undefined,
        4 // Social scope
      );
      toast.success('PDF generated. Go to Dashboard to print the graphs!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const handleGenerateExcel = () => {
    try {
      const summary = {
        totalQuantity: employees.length,
        totalActiveSources: new Set(employees.map(emp => emp.category_department || 'Unknown')).size,
        totalEmission: 0
      };
      
      const tableData = employees.map(emp => ({
        source: emp.name,
        quantity: emp.salary || 0,
        ghgFactor: 0,
        co2Emitted: 0
      }));
      
      generateExcel(tableData, summary);
      toast.success('Excel file generated successfully!');
    } catch (error) {
      console.error('Error generating Excel:', error);
      toast.error('Failed to generate Excel file');
    }
  };

  const goToDashboardSocial = () => {
    navigate('/dashboard?tab=social');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading employee data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        className="mb-4 px-4 py-2 bg-purple-600 text-white rounded"
        onClick={goToDashboardSocial}
      >
        Go to Social Dashboard
      </button>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Employee Profile Management</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Upload Employee Data
              {uploadSuccess && <Badge variant="secondary" className="bg-green-100 text-green-800">✓ Success</Badge>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Button onClick={downloadTemplate} variant="outline">
                Download Template
              </Button>
              <span className="text-sm text-gray-600">Download the Excel template to format your employee data</span>
            </div>
            
            <Separator />
            
            <div className="space-y-2">
              <Input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="cursor-pointer"
              />
              <p className="text-sm text-gray-600">
                Upload your completed employee data file (Excel or CSV format)
              </p>
            </div>
          </CardContent>
        </Card>

        {employees.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Employee Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{employees.length}</div>
                  <div className="text-sm text-gray-600">Total Employees</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {new Set(employees.map(emp => emp.category_department || 'Unknown')).size}
                  </div>
                  <div className="text-sm text-gray-600">Departments</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {employees.filter(emp => emp.is_executive).length}
                  </div>
                  <div className="text-sm text-gray-600">Executives</div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Position</th>
                      <th className="px-4 py-3">Department</th>
                      <th className="px-4 py-3">Employment Date</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.slice(0, 5).map((employee) => (
                      <tr key={employee.id} className="bg-white border-b">
                        <td className="px-4 py-3 font-medium">{employee.name}</td>
                        <td className="px-4 py-3">{employee.position || 'N/A'}</td>
                        <td className="px-4 py-3">{employee.category_department || 'N/A'}</td>
                        <td className="px-4 py-3">
                          {employee.date_of_employment 
                            ? new Date(employee.date_of_employment).toLocaleDateString()
                            : 'N/A'
                          }
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant={employee.date_of_exit ? "destructive" : "default"}>
                            {employee.date_of_exit ? 'Inactive' : 'Active'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {employees.length > 5 && (
                  <div className="mt-4 text-sm text-gray-600 text-center">
                    Showing 5 of {employees.length} employees
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
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
          onClick={() => window.location.href = '/dashboard'}
        >
          Complete Assessment
        </Button>
      </div>
    </div>
  );
};

export default EmployeeProfile;
