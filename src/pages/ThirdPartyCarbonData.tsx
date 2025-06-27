import React, { useState } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Plus, Printer } from 'lucide-react';

const teamMembers = [
  { id: '1', name: 'Alice Smith' },
  { id: '2', name: 'Bob Johnson' },
];

export default function ThirdPartyCarbonData() {
  const [open, setOpen] = useState(false);
  const [dueDate, setDueDate] = useState<Date | undefined>();

  return (
    <div className="p-8 min-h-screen bg-muted/50">
      <h1 className="text-2xl font-semibold mb-2">Third Party Carbon Data</h1>
      <h2 className="text-lg font-medium mb-4">Pending Requests</h2>
      <div className="mb-6">
        <div className="bg-muted flex items-center p-4 rounded-md text-muted-foreground">
          <span className="mr-2"><i className="fa fa-info-circle" /></span>
          No pending requests found.
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader>
            <CardDescription>Total Emission</CardDescription>
            <CardTitle className="text-3xl font-bold">0.00 KgCo2e</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-muted-foreground">Carbon emissions from all sources</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Total Vendors</CardDescription>
            <CardTitle className="text-3xl font-bold">0</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-muted-foreground">Companies reporting data</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>New Data Available</CardDescription>
            <CardTitle className="text-3xl font-bold">0</CardTitle>
          </CardHeader>
          <CardContent className="pt-0 text-sm text-muted-foreground">Reports in the last 7 days</CardContent>
        </Card>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
        <h3 className="text-xl font-semibold mb-2 md:mb-0">Subsidiary Companies</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full shadow-md"><Plus /></Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Request Carbon Data</DialogTitle>
              <DialogDescription />
            </DialogHeader>
            <form className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Title</label>
                <Input placeholder="Enter request title" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Description</label>
                <Textarea placeholder="Enter description" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Due Date</label>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4 text-muted-foreground" />
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    className="rounded-md border"
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium">Request From</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.map((member) => (
                      <SelectItem key={member.id} value={member.id}>{member.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter className="pt-4">
                <DialogClose asChild>
                  <Button variant="outline" type="button">Cancel</Button>
                </DialogClose>
                <Button type="submit">Submit Request</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="overflow-x-auto mb-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name Of Company</TableHead>
              <TableHead>Nature Of Business</TableHead>
              <TableHead>Date Of Report</TableHead>
              <TableHead>Scope 1 Carbon Emission</TableHead>
              <TableHead>Scope 2 Carbon Emission</TableHead>
              <TableHead>Scope 3 Carbon Emission</TableHead>
              <TableHead>Total Emissions</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">No subsidiary reports available</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <h3 className="text-xl font-semibold mb-2">Direct Suppliers</h3>
      <div className="overflow-x-auto mb-8">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name Of Company</TableHead>
              <TableHead>Nature Of Business</TableHead>
              <TableHead>Date Of Report</TableHead>
              <TableHead>Scope 1 Carbon Emission</TableHead>
              <TableHead>Scope 2 Carbon Emission</TableHead>
              <TableHead>Scope 3 Carbon Emission</TableHead>
              <TableHead>Total Emissions</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={8} className="text-center text-muted-foreground">No direct supplier reports available</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end gap-4 mt-8">
        <span className="font-semibold text-lg">Total Emissions:</span>
        <span className="text-lg">0.00 KgCo2e</span>
        <Button variant="default" className="flex items-center gap-2" disabled>
          <Printer className="w-5 h-5" /> Print
        </Button>
      </div>
    </div>
  );
} 