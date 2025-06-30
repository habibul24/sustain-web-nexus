
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { Upload, Users, UserCheck, Clock, TrendingUp, Globe, Building } from 'lucide-react';
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
}

const EmployeeProfile = () => {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
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
      calculateStats(employeeData);
    } catch (error) {
      console.error('Error loading employees:', error);
      toast({
        title: "Error",
        description: "Failed to load employee data",
        variant: "destructive",
      });
    }
  };

  const calculateStats = (employeeData: Employee[]) => {
    const totalEmployees = employeeData.length;
    const totalMaleWorkers = employeeData.filter(emp => emp.sex === 'M' || emp.sex === 'Male').length;
    const totalFemaleWorkers = employeeData.filter(emp => emp.sex === 'F' || emp.sex === 'Female').length;
    
    // Age groups
    const employeesUnder30 = employeeData.filter(emp => emp.age && emp.age < 30).length;
    const employees30To50 = employeeData.filter(emp => emp.age && emp.age >= 30 && emp.age <= 50).length;
    const employeesAbove50 = employeeData.filter(emp => emp.age && emp.age > 50).length;
    
    const activeEmployees = employeeData.filter(emp => !emp.date_of_exit).length;
    
    // Executives
    const executives = employeeData.filter(emp => emp.is_executive);
    const totalExecutives = executives.length;
    const maleExecutives = executives.filter(emp => emp.sex === 'M' || emp.sex === 'Male').length;
    const femaleExecutives = executives.filter(emp => emp.sex === 'F' || emp.sex === 'Female').length;
    
    // New hires in 2025
    const newHires2025 = employeeData.filter(emp => {
      if (!emp.date_of_employment) return false;
      const hireYear = new Date(emp.date_of_employment).getFullYear();
      return hireYear === 2025;
    }).length;
    
    // Employees by country
    const employeesByCountry: Record<string, number> = {};
    employeeData.forEach(emp => {
      if (emp.country_of_assignment) {
        employeesByCountry[emp.country_of_assignment] = (employeesByCountry[emp.country_of_assignment] || 0) + 1;
      }
    });
    
    // Turnover rates
    const employeesWhoLeft = employeeData.filter(emp => emp.date_of_exit).length;
    const turnoverRate = totalEmployees > 0 ? (employeesWhoLeft / totalEmployees) * 100 : 0;
    
    const maleEmployeesWhoLeft = employeeData.filter(emp => emp.date_of_exit && (emp.sex === 'M' || emp.sex === 'Male')).length;
    const turnoverRateMale = totalMaleWorkers > 0 ? (maleEmployeesWhoLeft / totalMaleWorkers) * 100 : 0;
    
    const femaleEmployeesWhoLeft = employeeData.filter(emp => emp.date_of_exit && (emp.sex === 'F' || emp.sex === 'Female')).length;
    const turnoverRateFemale = totalFemaleWorkers > 0 ? (femaleEmployeesWhoLeft / totalFemaleWorkers) * 100 : 0;
    
    // Turnover by age group
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
    });
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
      const employeeData: Employee[] = jsonData.map((row: any) => ({
        serial_number: row['S/N'] || null,
        name: row['Name'] || '',
        position: row['Position- Executive or not'] || null,
        is_executive: row['Position- Executive or not']?.toLowerCase().includes('executive') || false,
        age: row['Age'] || null,
        sex: row['Sex'] || null, // Keep M/F as is, will handle in calculations
        employee_number: row['Employee number'] || null,
        work_mode: row['Work mode (Full Time or Part Time)'] || null,
        country_of_assignment: row['Country of Primary Assignment'] || null,
        factory_of_assignment: row['Factory of Primary Assignment'] || null,
        date_of_employment: row['Date of employment'] ? new Date(row['Date of employment']).toISOString().split('T')[0] : null,
        date_of_exit: row['Date of exit'] ? new Date(row['Date of exit']).toISOString().split('T')[0] : null,
        category_department: row['Category/ Department'] || null,
        level_designation: row['By level'] || null,
        salary: row['Salary'] || null,
      }));

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
            <Button 
              disabled={uploading}
              className="w-full"
            >
              {uploading ? 'Uploading...' : 'Upload Excel File'}
            </Button>
          </div>
        </CardContent>
      </Card>

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
              Based on exit records
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
              Male employees
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
              Female employees
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
