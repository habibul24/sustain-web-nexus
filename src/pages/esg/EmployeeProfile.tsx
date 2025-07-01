import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { Upload, Users, UserCheck, Clock, TrendingUp, Globe, Building, Trash2 } from 'lucide-react';
import * as XLSX from 'xlsx';

interface Employee {
  id?: string;
  serial_number?: number;
  name: string;
  position?: string;
  is_executive?: boolean;
  age?: number;
  sex?: string;
  employee_number?: string;
  work_mode?: string;
  country_of_assignment?: string;
  factory_of_assignment?: string;
  date_of_employment?: string;
  date_of_exit?: string;
  category_department?: string;
  level_designation?: string;
  salary?: number;
}

interface EmployeeStats {
  totalEmployees: number;
  totalMaleWorkers: number;
  totalFemaleWorkers: number;
  employeesUnder30: number;
  employees30To50: number;
  employeesAbove50: number;
  turnoverRate: number;
  turnoverRateMale: number;
  turnoverRateFemale: number;
  turnoverRateUnder30: number;
  turnoverRate30To50: number;
  turnoverRateAbove50: number;
  activeEmployees: number;
  totalExecutives: number;
  maleExecutives: number;
  femaleExecutives: number;
  newHires2025: number;
  employeesByCountry: Record<string, number>;
  availableYears: number[];
}

const EmployeeProfile = () => {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedTurnoverYear, setSelectedTurnoverYear] = useState<number>(2025);
  const [stats, setStats] = useState<EmployeeStats>({
    totalEmployees: 0,
    totalMaleWorkers: 0,
    totalFemaleWorkers: 0,
    employeesUnder30: 0,
    employees30To50: 0,
    employeesAbove50: 0,
    turnoverRate: 0,
    turnoverRateMale: 0,
    turnoverRateFemale: 0,
    turnoverRateUnder30: 0,
    turnoverRate30To50: 0,
    turnoverRateAbove50: 0,
    activeEmployees: 0,
    totalExecutives: 0,
    maleExecutives: 0,
    femaleExecutives: 0,
    newHires2025: 0,
    employeesByCountry: {},
    availableYears: [],
  });

  useEffect(() => {
    if (user) {
      loadEmployees();
    }
  }, [user]);

  const loadEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading employees:', error);
        toast({
          title: "Error",
          description: "Failed to load employee data",
          variant: "destructive",
        });
        return;
      }

      const employeeData = data || [];
      setEmployees(employeeData);
      calculateStats(employeeData, selectedTurnoverYear);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast({
        title: "Error",
        description: "Failed to load employee data",
        variant: "destructive",
      });
    }
  };

  const removeAllData = async () => {
    setRemoving(true);
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('user_id', user?.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "All employee data has been removed",
      });

      setEmployees([]);
      calculateStats([], selectedTurnoverYear);
    } catch (error) {
      console.error('Error removing data:', error);
      toast({
        title: "Error",
        description: "Failed to remove employee data",
        variant: "destructive",
      });
    } finally {
      setRemoving(false);
    }
  };

  const calculateStats = (employeeData: Employee[], turnoverYear: number) => {
    const totalEmployees = employeeData.length;
    const totalMaleWorkers = employeeData.filter(emp => emp.sex === 'M' || emp.sex === 'Male').length;
    const totalFemaleWorkers = employeeData.filter(emp => emp.sex === 'F' || emp.sex === 'Female').length;
    
    // Age groups
    const employeesUnder30 = employeeData.filter(emp => emp.age && emp.age < 30).length;
    const employees30To50 = employeeData.filter(emp => emp.age && emp.age >= 30 && emp.age <= 50).length;
    const employeesAbove50 = employeeData.filter(emp => emp.age && emp.age > 50).length;
    
    const activeEmployees = employeeData.filter(emp => !emp.date_of_exit).length;
    
    // Executives - check for "Yes" in position field
    const executives = employeeData.filter(emp => emp.position === 'Yes');
    const totalExecutives = executives.length;
    const maleExecutives = executives.filter(emp => emp.sex === 'M' || emp.sex === 'Male').length;
    const femaleExecutives = executives.filter(emp => emp.sex === 'F' || emp.sex === 'Female').length;
    
    // New hires in 2025 - improved logic to handle different date formats
    const newHires2025 = employeeData.filter(emp => {
      if (!emp.date_of_employment) return false;
      
      console.log('Processing employee:', emp.name, 'Date of employment:', emp.date_of_employment, 'Type:', typeof emp.date_of_employment);
      
      // Try to parse the date - handle string dates
      let hireDate = new Date(emp.date_of_employment);
      
      // Check if the date is valid and extract year
      if (isNaN(hireDate.getTime())) {
        console.log('Invalid date format, trying alternative parsing for:', emp.date_of_employment);
        
        // Try parsing as Excel serial number if it's a number
        const dateValue = parseFloat(emp.date_of_employment);
        if (!isNaN(dateValue)) {
          // Excel date serial number conversion (Excel epoch starts Jan 1, 1900)
          hireDate = new Date((dateValue - 25569) * 86400 * 1000);
          console.log('Parsed as Excel date:', hireDate);
        } else {
          // Try parsing MM/DD/YYYY format manually
          const dateParts = emp.date_of_employment.toString().split('/');
          if (dateParts.length === 3) {
            const month = parseInt(dateParts[0]) - 1; // Month is 0-indexed
            const day = parseInt(dateParts[1]);
            const year = parseInt(dateParts[2]);
            hireDate = new Date(year, month, day);
            console.log('Parsed as MM/DD/YYYY:', hireDate, 'Parts:', { month, day, year });
          } else {
            console.log('Could not parse date format:', emp.date_of_employment);
            return false;
          }
        }
      }
      
      const hireYear = hireDate.getFullYear();
      const is2025 = hireYear === 2025;
      console.log('Employee hire date:', emp.date_of_employment, 'Parsed year:', hireYear, 'Is 2025:', is2025);
      return is2025;
    }).length;
    
    // Employees by country
    const employeesByCountry: Record<string, number> = {};
    employeeData.forEach(emp => {
      if (emp.country_of_assignment) {
        employeesByCountry[emp.country_of_assignment] = (employeesByCountry[emp.country_of_assignment] || 0) + 1;
      }
    });
    
    // Get available years from exit dates
    const availableYears = Array.from(new Set(employeeData
      .filter(emp => emp.date_of_exit)
      .map(emp => {
        if (!emp.date_of_exit) return null;
        
        let exitDate = new Date(emp.date_of_exit);
        
        // Handle Excel serial numbers or string dates
        if (isNaN(exitDate.getTime())) {
          const dateValue = parseFloat(emp.date_of_exit);
          if (!isNaN(dateValue)) {
            exitDate = new Date((dateValue - 25569) * 86400 * 1000);
          } else {
            const dateParts = emp.date_of_exit.toString().split('/');
            if (dateParts.length === 3) {
              const month = parseInt(dateParts[0]) - 1;
              const day = parseInt(dateParts[1]);
              const year = parseInt(dateParts[2]);
              exitDate = new Date(year, month, day);
            }
          }
        }
        
        return !isNaN(exitDate.getTime()) ? exitDate.getFullYear() : null;
      })
      .filter(year => year !== null) as number[]))
      .sort((a, b) => b - a); // Sort descending

    // Add current year if not present
    if (!availableYears.includes(turnoverYear)) {
      availableYears.unshift(turnoverYear);
      availableYears.sort((a, b) => b - a);
    }
    
    // Turnover rates for selected year - using standard formula with average employees
    const employeesWhoLeftInYear = employeeData.filter(emp => {
      if (!emp.date_of_exit) return false;
      
      let exitDate = new Date(emp.date_of_exit);
      
      // Handle Excel serial numbers or string dates
      if (isNaN(exitDate.getTime())) {
        const dateValue = parseFloat(emp.date_of_exit);
        if (!isNaN(dateValue)) {
          exitDate = new Date((dateValue - 25569) * 86400 * 1000);
        } else {
          const dateParts = emp.date_of_exit.toString().split('/');
          if (dateParts.length === 3) {
            const month = parseInt(dateParts[0]) - 1;
            const day = parseInt(dateParts[1]);
            const year = parseInt(dateParts[2]);
            exitDate = new Date(year, month, day);
          }
        }
      }
      
      return !isNaN(exitDate.getTime()) && exitDate.getFullYear() === turnoverYear;
    }).length;

    // Calculate employees at start of year (hired before or during the year)
    const employeesAtStartOfYear = employeeData.filter(emp => {
      if (!emp.date_of_employment) return false;
      
      let hireDate = new Date(emp.date_of_employment);
      
      // Handle Excel serial numbers or string dates
      if (isNaN(hireDate.getTime())) {
        const dateValue = parseFloat(emp.date_of_employment);
        if (!isNaN(dateValue)) {
          hireDate = new Date((dateValue - 25569) * 86400 * 1000);
        } else {
          const dateParts = emp.date_of_employment.toString().split('/');
          if (dateParts.length === 3) {
            const month = parseInt(dateParts[0]) - 1;
            const day = parseInt(dateParts[1]);
            const year = parseInt(dateParts[2]);
            hireDate = new Date(year, month, day);
          }
        }
      }
      
      return !isNaN(hireDate.getTime()) && hireDate.getFullYear() <= turnoverYear;
    }).length;

    // Calculate employees at end of year (still employed or left after the year)
    const employeesAtEndOfYear = employeeData.filter(emp => {
      // If no exit date, still employed
      if (!emp.date_of_exit) return true;
      
      let exitDate = new Date(emp.date_of_exit);
      
      // Handle Excel serial numbers or string dates
      if (isNaN(exitDate.getTime())) {
        const dateValue = parseFloat(emp.date_of_exit);
        if (!isNaN(dateValue)) {
          exitDate = new Date((dateValue - 25569) * 86400 * 1000);
        } else {
          const dateParts = emp.date_of_exit.toString().split('/');
          if (dateParts.length === 3) {
            const month = parseInt(dateParts[0]) - 1;
            const day = parseInt(dateParts[1]);
            const year = parseInt(dateParts[2]);
            exitDate = new Date(year, month, day);
          }
        }
      }
      
      return !isNaN(exitDate.getTime()) && exitDate.getFullYear() > turnoverYear;
    }).length;

    // Calculate average employees during the year
    const averageEmployees = (employeesAtStartOfYear + employeesAtEndOfYear) / 2;
    const turnoverRate = averageEmployees > 0 ? (employeesWhoLeftInYear / averageEmployees) * 100 : 0;
    
    // Male turnover rate for selected year
    const maleEmployeesWhoLeftInYear = employeeData.filter(emp => {
      if (!emp.date_of_exit || (emp.sex !== 'M' && emp.sex !== 'Male')) return false;
      
      let exitDate = new Date(emp.date_of_exit);
      
      if (isNaN(exitDate.getTime())) {
        const dateValue = parseFloat(emp.date_of_exit);
        if (!isNaN(dateValue)) {
          exitDate = new Date((dateValue - 25569) * 86400 * 1000);
        } else {
          const dateParts = emp.date_of_exit.toString().split('/');
          if (dateParts.length === 3) {
            const month = parseInt(dateParts[0]) - 1;
            const day = parseInt(dateParts[1]);
            const year = parseInt(dateParts[2]);
            exitDate = new Date(year, month, day);
          }
        }
      }
      
      return !isNaN(exitDate.getTime()) && exitDate.getFullYear() === turnoverYear;
    }).length;

    // Calculate male employees at start of year
    const maleEmployeesAtStartOfYear = employeeData.filter(emp => {
      if (!emp.date_of_employment || (emp.sex !== 'M' && emp.sex !== 'Male')) return false;
      
      let hireDate = new Date(emp.date_of_employment);
      
      if (isNaN(hireDate.getTime())) {
        const dateValue = parseFloat(emp.date_of_employment);
        if (!isNaN(dateValue)) {
          hireDate = new Date((dateValue - 25569) * 86400 * 1000);
        } else {
          const dateParts = emp.date_of_employment.toString().split('/');
          if (dateParts.length === 3) {
            const month = parseInt(dateParts[0]) - 1;
            const day = parseInt(dateParts[1]);
            const year = parseInt(dateParts[2]);
            hireDate = new Date(year, month, day);
          }
        }
      }
      
      return !isNaN(hireDate.getTime()) && hireDate.getFullYear() <= turnoverYear;
    }).length;

    // Calculate male employees at end of year
    const maleEmployeesAtEndOfYear = employeeData.filter(emp => {
      if (emp.sex !== 'M' && emp.sex !== 'Male') return false;
      
      if (!emp.date_of_exit) return true;
      
      let exitDate = new Date(emp.date_of_exit);
      
      if (isNaN(exitDate.getTime())) {
        const dateValue = parseFloat(emp.date_of_exit);
        if (!isNaN(dateValue)) {
          exitDate = new Date((dateValue - 25569) * 86400 * 1000);
        } else {
          const dateParts = emp.date_of_exit.toString().split('/');
          if (dateParts.length === 3) {
            const month = parseInt(dateParts[0]) - 1;
            const day = parseInt(dateParts[1]);
            const year = parseInt(dateParts[2]);
            exitDate = new Date(year, month, day);
          }
        }
      }
      
      return !isNaN(exitDate.getTime()) && exitDate.getFullYear() > turnoverYear;
    }).length;

    const averageMaleEmployees = (maleEmployeesAtStartOfYear + maleEmployeesAtEndOfYear) / 2;
    const turnoverRateMale = averageMaleEmployees > 0 ? (maleEmployeesWhoLeftInYear / averageMaleEmployees) * 100 : 0;
    
    // Female turnover rate for selected year
    const femaleEmployeesWhoLeftInYear = employeeData.filter(emp => {
      if (!emp.date_of_exit || (emp.sex !== 'F' && emp.sex !== 'Female')) return false;
      
      let exitDate = new Date(emp.date_of_exit);
      
      if (isNaN(exitDate.getTime())) {
        const dateValue = parseFloat(emp.date_of_exit);
        if (!isNaN(dateValue)) {
          exitDate = new Date((dateValue - 25569) * 86400 * 1000);
        } else {
          const dateParts = emp.date_of_exit.toString().split('/');
          if (dateParts.length === 3) {
            const month = parseInt(dateParts[0]) - 1;
            const day = parseInt(dateParts[1]);
            const year = parseInt(dateParts[2]);
            exitDate = new Date(year, month, day);
          }
        }
      }
      
      return !isNaN(exitDate.getTime()) && exitDate.getFullYear() === turnoverYear;
    }).length;

    // Calculate female employees at start of year
    const femaleEmployeesAtStartOfYear = employeeData.filter(emp => {
      if (!emp.date_of_employment || (emp.sex !== 'F' && emp.sex !== 'Female')) return false;
      
      let hireDate = new Date(emp.date_of_employment);
      
      if (isNaN(hireDate.getTime())) {
        const dateValue = parseFloat(emp.date_of_employment);
        if (!isNaN(dateValue)) {
          hireDate = new Date((dateValue - 25569) * 86400 * 1000);
        } else {
          const dateParts = emp.date_of_employment.toString().split('/');
          if (dateParts.length === 3) {
            const month = parseInt(dateParts[0]) - 1;
            const day = parseInt(dateParts[1]);
            const year = parseInt(dateParts[2]);
            hireDate = new Date(year, month, day);
          }
        }
      }
      
      return !isNaN(hireDate.getTime()) && hireDate.getFullYear() <= turnoverYear;
    }).length;

    // Calculate female employees at end of year
    const femaleEmployeesAtEndOfYear = employeeData.filter(emp => {
      if (emp.sex !== 'F' && emp.sex !== 'Female') return false;
      
      if (!emp.date_of_exit) return true;
      
      let exitDate = new Date(emp.date_of_exit);
      
      if (isNaN(exitDate.getTime())) {
        const dateValue = parseFloat(emp.date_of_exit);
        if (!isNaN(dateValue)) {
          exitDate = new Date((dateValue - 25569) * 86400 * 1000);
        } else {
          const dateParts = emp.date_of_exit.toString().split('/');
          if (dateParts.length === 3) {
            const month = parseInt(dateParts[0]) - 1;
            const day = parseInt(dateParts[1]);
            const year = parseInt(dateParts[2]);
            exitDate = new Date(year, month, day);
          }
        }
      }
      
      return !isNaN(exitDate.getTime()) && exitDate.getFullYear() > turnoverYear;
    }).length;

    const averageFemaleEmployees = (femaleEmployeesAtStartOfYear + femaleEmployeesAtEndOfYear) / 2;
    const turnoverRateFemale = averageFemaleEmployees > 0 ? (femaleEmployeesWhoLeftInYear / averageFemaleEmployees) * 100 : 0;
    
    // Turnover by age group (keeping existing logic for overall turnover)
    const under30WhoLeft = employeeData.filter(emp => emp.date_of_exit && emp.age && emp.age < 30).length;
    const turnoverRateUnder30 = employeesUnder30 > 0 ? (under30WhoLeft / employeesUnder30) * 100 : 0;
    
    const age30To50WhoLeft = employeeData.filter(emp => emp.date_of_exit && emp.age && emp.age >= 30 && emp.age <= 50).length;
    const turnoverRate30To50 = employees30To50 > 0 ? (age30To50WhoLeft / employees30To50) * 100 : 0;
    
    const above50WhoLeft = employeeData.filter(emp => emp.date_of_exit && emp.age && emp.age > 50).length;
    const turnoverRateAbove50 = employeesAbove50 > 0 ? (above50WhoLeft / employeesAbove50) * 100 : 0;

    setStats({
      totalEmployees,
      totalMaleWorkers,
      totalFemaleWorkers,
      employeesUnder30,
      employees30To50,
      employeesAbove50,
      turnoverRate: Math.round(turnoverRate * 100) / 100,
      turnoverRateMale: Math.round(turnoverRateMale * 100) / 100,
      turnoverRateFemale: Math.round(turnoverRateFemale * 100) / 100,
      turnoverRateUnder30: Math.round(turnoverRateUnder30 * 100) / 100,
      turnoverRate30To50: Math.round(turnoverRate30To50 * 100) / 100,
      turnoverRateAbove50: Math.round(turnoverRateAbove50 * 100) / 100,
      activeEmployees,
      totalExecutives,
      maleExecutives,
      femaleExecutives,
      newHires2025,
      employeesByCountry,
      availableYears,
    });
  };

  const handleYearChange = (year: string) => {
    const selectedYear = parseInt(year);
    setSelectedTurnoverYear(selectedYear);
    calculateStats(employees, selectedYear);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      // Read the Excel file
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Transform the data to match our database schema
      const employeeData: Employee[] = jsonData.map((row: any) => {
        // Improved date handling for employment date
        let employmentDate = null;
        if (row['Date of employment']) {
          const dateValue = row['Date of employment'];
          console.log('Raw employment date from Excel:', dateValue, 'Type:', typeof dateValue);
          
          // Handle different date formats
          if (typeof dateValue === 'number') {
            // Excel serial number
            const excelDate = new Date((dateValue - 25569) * 86400 * 1000);
            employmentDate = excelDate.toISOString().split('T')[0];
            console.log('Converted Excel serial number:', dateValue, 'to:', employmentDate);
          } else if (typeof dateValue === 'string') {
            // Try to parse as MM/DD/YYYY format
            const dateParts = dateValue.split('/');
            if (dateParts.length === 3) {
              const month = parseInt(dateParts[0]) - 1; // Month is 0-indexed
              const day = parseInt(dateParts[1]);
              const year = parseInt(dateParts[2]);
              const parsedDate = new Date(year, month, day);
              employmentDate = parsedDate.toISOString().split('T')[0];
              console.log('Parsed MM/DD/YYYY:', dateValue, 'to:', employmentDate);
            } else {
              // Try standard date parsing
              const parsedDate = new Date(dateValue);
              if (!isNaN(parsedDate.getTime())) {
                employmentDate = parsedDate.toISOString().split('T')[0];
                console.log('Standard date parsing:', dateValue, 'to:', employmentDate);
              }
            }
          } else if (dateValue instanceof Date) {
            employmentDate = dateValue.toISOString().split('T')[0];
            console.log('Date object:', dateValue, 'to:', employmentDate);
          }
        }

        // Similar handling for exit date
        let exitDate = null;
        if (row['Date of exit']) {
          const dateValue = row['Date of exit'];
          console.log('Raw exit date from Excel:', dateValue, 'Type:', typeof dateValue);
          
          if (typeof dateValue === 'number') {
            const excelDate = new Date((dateValue - 25569) * 86400 * 1000);
            exitDate = excelDate.toISOString().split('T')[0];
          } else if (typeof dateValue === 'string') {
            const dateParts = dateValue.split('/');
            if (dateParts.length === 3) {
              const month = parseInt(dateParts[0]) - 1;
              const day = parseInt(dateParts[1]);
              const year = parseInt(dateParts[2]);
              const parsedDate = new Date(year, month, day);
              exitDate = parsedDate.toISOString().split('T')[0];
            } else {
              const parsedDate = new Date(dateValue);
              if (!isNaN(parsedDate.getTime())) {
                exitDate = parsedDate.toISOString().split('T')[0];
              }
            }
          } else if (dateValue instanceof Date) {
            exitDate = dateValue.toISOString().split('T')[0];
          }
        }

        return {
          serial_number: row['S/N'] || null,
          name: row['Name'] || '',
          position: row['Position- Executive or not'] || null,
          is_executive: row['Position- Executive or not'] === 'Yes',
          age: row['Age'] || null,
          sex: row['Sex'] || null,
          employee_number: row['Employee number'] || null,
          work_mode: row['Work mode (Full Time or Part Time)'] || null,
          country_of_assignment: row['Country of Primary Assignment'] || null,
          factory_of_assignment: row['Factory of Primary Assignment'] || null,
          date_of_employment: employmentDate,
          date_of_exit: exitDate,
          category_department: row['Category/ Department'] || null,
          level_designation: row['By level'] || null,
          salary: row['Salary'] || null,
        };
      });

      // Clear existing data and insert new data
      const { error: deleteError } = await supabase
        .from('employees')
        .delete()
        .eq('user_id', user?.id);

      if (deleteError) throw deleteError;

      // Insert new employee data
      const { error: insertError } = await supabase
        .from('employees')
        .insert(employeeData.map(emp => ({ ...emp, user_id: user?.id })));

      if (insertError) throw insertError;

      toast({
        title: "Success",
        description: `Successfully uploaded ${employeeData.length} employee records`,
      });

      loadEmployees();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload employee data. Please check the file format.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      // Reset the input
      event.target.value = '';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Employee Profile</h1>
        <p className="text-gray-600 mt-2">Upload and manage employee data from Excel files</p>
      </div>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Employee Data
          </CardTitle>
          <CardDescription>
            Upload an Excel file containing employee information. The file should include columns for S/N, Name, Position, Age, Sex, Employee number, Work mode, Country of Primary Assignment, Factory of Primary Assignment, Date of employment, Date of exit, Category/Department, By level, and Salary.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <div className="flex gap-2">
              <Button 
                disabled={uploading}
                className="flex-1"
              >
                {uploading ? 'Uploading...' : 'Upload Excel File'}
              </Button>
              {employees.length > 0 && (
                <Button
                  variant="destructive"
                  onClick={removeAllData}
                  disabled={removing}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {removing ? 'Removing...' : 'Remove Data'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Turnover Year Filter */}
      {stats.availableYears.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Turnover Rate Filter</CardTitle>
            <CardDescription>
              Select the year to view turnover rates for that specific year
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedTurnoverYear.toString()} onValueChange={handleYearChange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {stats.availableYears.map(year => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEmployees}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeEmployees} currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Male Workers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMaleWorkers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalEmployees > 0 ? Math.round((stats.totalMaleWorkers / stats.totalEmployees) * 100) : 0}% of total workforce
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Female Workers</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalFemaleWorkers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalEmployees > 0 ? Math.round((stats.totalFemaleWorkers / stats.totalEmployees) * 100) : 0}% of total workforce
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Executives</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExecutives}</div>
            <p className="text-xs text-muted-foreground">
              {stats.maleExecutives}M / {stats.femaleExecutives}F
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employees Under 30</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.employeesUnder30}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalEmployees > 0 ? Math.round((stats.employeesUnder30 / stats.totalEmployees) * 100) : 0}% of workforce
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employees 30-50</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.employees30To50}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalEmployees > 0 ? Math.round((stats.employees30To50 / stats.totalEmployees) * 100) : 0}% of workforce
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employees Above 50</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.employeesAbove50}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalEmployees > 0 ? Math.round((stats.employeesAbove50 / stats.totalEmployees) * 100) : 0}% of workforce
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Hires 2025</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newHires2025}</div>
            <p className="text-xs text-muted-foreground">
              This year
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Turnover Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.turnoverRate}%</div>
            <p className="text-xs text-muted-foreground">
              For year {selectedTurnoverYear}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Male Turnover Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.turnoverRateMale}%</div>
            <p className="text-xs text-muted-foreground">
              Male employees ({selectedTurnoverYear})
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Female Turnover Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.turnoverRateFemale}%</div>
            <p className="text-xs text-muted-foreground">
              Female employees ({selectedTurnoverYear})
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Countries</CardTitle>
            <Globe className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Object.keys(stats.employeesByCountry).length}</div>
            <p className="text-xs text-muted-foreground">
              Operating countries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Countries Breakdown */}
      {Object.keys(stats.employeesByCountry).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Employees by Country</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(stats.employeesByCountry).map(([country, count]) => (
                <div key={country} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{country}</span>
                  <span className="text-sm text-muted-foreground">{count} employees</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Employee Data Table */}
      {employees.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Employee Data Summary</CardTitle>
            <CardDescription>
              Overview of uploaded employee records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600">
              <p>Total Records: {employees.length}</p>
              <p>Last Updated: {new Date().toLocaleDateString()}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EmployeeProfile;
