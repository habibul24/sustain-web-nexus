
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { Upload, Users, UserCheck, Clock, TrendingUp } from 'lucide-react';
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
  turnoverRate: number;
  activeEmployees: number;
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
    turnoverRate: 0,
    activeEmployees: 0,
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

      if (error) throw error;

      setEmployees(data || []);
      calculateStats(data || []);
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
    const totalMaleWorkers = employeeData.filter(emp => emp.sex === 'Male').length;
    const totalFemaleWorkers = employeeData.filter(emp => emp.sex === 'Female').length;
    const employeesUnder30 = employeeData.filter(emp => emp.age && emp.age < 30).length;
    const activeEmployees = employeeData.filter(emp => !emp.date_of_exit).length;
    
    // Calculate turnover rate: (employees who left / total employees) * 100
    const employeesWhoLeft = employeeData.filter(emp => emp.date_of_exit).length;
    const turnoverRate = totalEmployees > 0 ? (employeesWhoLeft / totalEmployees) * 100 : 0;

    setStats({
      totalEmployees,
      totalMaleWorkers,
      totalFemaleWorkers,
      employeesUnder30,
      turnoverRate: Math.round(turnoverRate * 100) / 100,
      activeEmployees,
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
        sex: row['Sex'] || null,
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
              {stats.totalFemaleWorkers} female workers
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
              {stats.totalEmployees > 0 ? Math.round((stats.employeesUnder30 / stats.totalEmployees) * 100) : 0}% of total workforce
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employee Turnover Rate</CardTitle>
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
            <CardTitle className="text-sm font-medium">Active Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeEmployees}</div>
            <p className="text-xs text-muted-foreground">
              Currently employed
            </p>
          </CardContent>
        </Card>
      </div>

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
