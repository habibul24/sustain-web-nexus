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
  selectedYear: number;
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
    selectedYear: 2025,
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

    // Filter employees for the selected year
    const employeesInYear = employeeData.filter(emp => {
      const hireDate = parseDate(emp.date_of_employment);
      const exitDate = parseDate(emp.date_of_exit);
      
      if (!hireDate) return false;
      
      // Employee was hired before or during the selected year
      const hiredBeforeOrDuringYear = hireDate.getFullYear() <= turnoverYear;
      
      // Employee was still employed during the selected year (no exit date or exited after the year)
      const stillEmployedInYear = !exitDate || exitDate.getFullYear() > turnoverYear;
      
      return hiredBeforeOrDuringYear && stillEmployedInYear;
    });

    const totalEmployees = employeesInYear.length;
    const totalMaleWorkers = employeesInYear.filter(emp => emp.sex === 'M' || emp.sex === 'Male').length;
    const totalFemaleWorkers = employeesInYear.filter(emp => emp.sex === 'F' || emp.sex === 'Female').length;
    
    // Age groups for the selected year
    const employeesUnder30 = employeesInYear.filter(emp => emp.age && emp.age < 30).length;
    const employees30To50 = employeesInYear.filter(emp => emp.age && emp.age >= 30 && emp.age <= 50).length;
    const employeesAbove50 = employeesInYear.filter(emp => emp.age && emp.age > 50).length;
    
    const activeEmployees = employeesInYear.filter(emp => !emp.date_of_exit).length;
    
    // Executives for the selected year
    const executives = employeesInYear.filter(emp => emp.position === 'Yes');
    const totalExecutives = executives.length;
    const maleExecutives = executives.filter(emp => emp.sex === 'M' || emp.sex === 'Male').length;
    const femaleExecutives = executives.filter(emp => emp.sex === 'F' || emp.sex === 'Female').length;
    
    // New hires in the selected year
    const newHiresInYear = employeesInYear.filter(emp => {
      const hireDate = parseDate(emp.date_of_employment);
      return hireDate && hireDate.getFullYear() === turnoverYear;
    }).length;
    
    // Employees by country for the selected year
    const employeesByCountry: Record<string, number> = {};
    employeesInYear.forEach(emp => {
      if (emp.country_of_assignment) {
        employeesByCountry[emp.country_of_assignment] = (employeesByCountry[emp.country_of_assignment] || 0) + 1;
      }
    });
    
    // Get all available years from employment dates
    const employmentYears = employeeData
      .map(emp => {
        const hireDate = parseDate(emp.date_of_employment);
        return hireDate ? hireDate.getFullYear() : null;
      })
      .filter(year => year !== null) as number[];

    // Get all available years from exit dates
    const exitYears = employeeData
      .map(emp => {
        const exitDate = parseDate(emp.date_of_exit);
        return exitDate ? exitDate.getFullYear() : null;
      })
      .filter(year => year !== null) as number[];

    // Combine and deduplicate all years
    const allYears = Array.from(new Set([...employmentYears, ...exitYears]))
      .sort((a, b) => b - a); // Sort descending

    // Add current year if not present
    const currentYear = new Date().getFullYear();
    if (!allYears.includes(currentYear)) {
      allYears.unshift(currentYear);
      allYears.sort((a, b) => b - a);
    }
    
    // Turnover rates for selected year
    const employeesWhoLeftInYear = employeeData.filter(emp => {
      const exitDate = parseDate(emp.date_of_exit);
      return exitDate && exitDate.getFullYear() === turnoverYear;
    }).length;

    // Calculate employees at start of year (hired before or during the year)
    const employeesAtStartOfYear = employeeData.filter(emp => {
      const hireDate = parseDate(emp.date_of_employment);
      return hireDate && hireDate.getFullYear() <= turnoverYear;
    }).length;

    // Calculate employees at end of year (still employed or left after the year)
    const employeesAtEndOfYear = employeeData.filter(emp => {
      const hireDate = parseDate(emp.date_of_employment);
      if (!hireDate || hireDate.getFullYear() > turnoverYear) return false;
      
      const exitDate = parseDate(emp.date_of_exit);
      return !exitDate || exitDate.getFullYear() > turnoverYear;
    }).length;

    // Calculate average employees during the year
    const averageEmployees = (employeesAtStartOfYear + employeesAtEndOfYear) / 2;
    const turnoverRate = averageEmployees > 0 ? (employeesWhoLeftInYear / averageEmployees) * 100 : 0;
    
    // Male turnover rate for selected year
    const maleEmployeesWhoLeftInYear = employeeData.filter(emp => {
      if ((emp.sex !== 'M' && emp.sex !== 'Male')) return false;
      const exitDate = parseDate(emp.date_of_exit);
      return exitDate && exitDate.getFullYear() === turnoverYear;
    }).length;

    // Calculate male employees at start of year
    const maleEmployeesAtStartOfYear = employeeData.filter(emp => {
      if ((emp.sex !== 'M' && emp.sex !== 'Male')) return false;
      const hireDate = parseDate(emp.date_of_employment);
      return hireDate && hireDate.getFullYear() <= turnoverYear;
    }).length;

    // Calculate male employees at end of year
    const maleEmployeesAtEndOfYear = employeeData.filter(emp => {
      if (emp.sex !== 'M' && emp.sex !== 'Male') return false;
      
      const hireDate = parseDate(emp.date_of_employment);
      if (!hireDate || hireDate.getFullYear() > turnoverYear) return false;
      
      const exitDate = parseDate(emp.date_of_exit);
      return !exitDate || exitDate.getFullYear() > turnoverYear;
    }).length;

    const averageMaleEmployees = (maleEmployeesAtStartOfYear + maleEmployeesAtEndOfYear) / 2;
    const turnoverRateMale = averageMaleEmployees > 0 ? (maleEmployeesWhoLeftInYear / averageMaleEmployees) * 100 : 0;
    
    // Female turnover rate for selected year
    const femaleEmployeesWhoLeftInYear = employeeData.filter(emp => {
      if ((emp.sex !== 'F' && emp.sex !== 'Female')) return false;
      const exitDate = parseDate(emp.date_of_exit);
      return exitDate && exitDate.getFullYear() === turnoverYear;
    }).length;

    // Calculate female employees at start of year
    const femaleEmployeesAtStartOfYear = employeeData.filter(emp => {
      if ((emp.sex !== 'F' && emp.sex !== 'Female')) return false;
      const hireDate = parseDate(emp.date_of_employment);
      return hireDate && hireDate.getFullYear() <= turnoverYear;
    }).length;

    // Calculate female employees at end of year
    const femaleEmployeesAtEndOfYear = employeeData.filter(emp => {
      if (emp.sex !== 'F' && emp.sex !== 'Female') return false;
      
      const hireDate = parseDate(emp.date_of_employment);
      if (!hireDate || hireDate.getFullYear() > turnoverYear) return false;
      
      const exitDate = parseDate(emp.date_of_exit);
      return !exitDate || exitDate.getFullYear() > turnoverYear;
    }).length;

    const averageFemaleEmployees = (femaleEmployeesAtStartOfYear + femaleEmployeesAtEndOfYear) / 2;
    const turnoverRateFemale = averageFemaleEmployees > 0 ? (femaleEmployeesWhoLeftInYear / averageFemaleEmployees) * 100 : 0;
    
    // Turnover by age group (keeping existing logic for overall turnover)
    const under30WhoLeft = employeesInYear.filter(emp => emp.date_of_exit && emp.age && emp.age < 30).length;
    const turnoverRateUnder30 = employeesUnder30 > 0 ? (under30WhoLeft / employeesUnder30) * 100 : 0;
    
    const age30To50WhoLeft = employeesInYear.filter(emp => emp.date_of_exit && emp.age && emp.age >= 30 && emp.age <= 50).length;
    const turnoverRate30To50 = employees30To50 > 0 ? (age30To50WhoLeft / employees30To50) * 100 : 0;
    
    const above50WhoLeft = employeesInYear.filter(emp => emp.date_of_exit && emp.age && emp.age > 50).length;
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
      newHires2025: newHiresInYear,
      employeesByCountry,
      availableYears: allYears,
      selectedYear: turnoverYear,
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

      {/* Year Filter */}
      {stats.availableYears.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Year Filter</CardTitle>
            <CardDescription>
              Select a year to view all statistics for that specific year. This affects total employees, gender distribution, age groups, executives, and turnover rates.
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
              {stats.activeEmployees} currently active ({stats.selectedYear})
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
              {stats.totalEmployees > 0 ? Math.round((stats.totalMaleWorkers / stats.totalEmployees) * 100) : 0}% of total workforce ({stats.selectedYear})
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
              {stats.totalEmployees > 0 ? Math.round((stats.totalFemaleWorkers / stats.totalEmployees) * 100) : 0}% of total workforce ({stats.selectedYear})
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
              {stats.maleExecutives}M / {stats.femaleExecutives}F ({stats.selectedYear})
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
              {stats.totalEmployees > 0 ? Math.round((stats.employeesUnder30 / stats.totalEmployees) * 100) : 0}% of workforce ({stats.selectedYear})
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
              {stats.totalEmployees > 0 ? Math.round((stats.employees30To50 / stats.totalEmployees) * 100) : 0}% of workforce ({stats.selectedYear})
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
              {stats.totalEmployees > 0 ? Math.round((stats.employeesAbove50 / stats.totalEmployees) * 100) : 0}% of workforce ({stats.selectedYear})
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Hires {stats.selectedYear}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.newHires2025}</div>
            <p className="text-xs text-muted-foreground">
              Hired in {stats.selectedYear}
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
              For year {stats.selectedYear}
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
              Male employees ({stats.selectedYear})
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
              Female employees ({stats.selectedYear})
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
              Operating countries ({stats.selectedYear})
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Countries Breakdown */}
      {Object.keys(stats.employeesByCountry).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Employees by Country ({stats.selectedYear})</CardTitle>
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
