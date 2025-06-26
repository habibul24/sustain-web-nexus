
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface AddTeamMemberProps {
  onAddMember: (email: string, role: string) => void;
}

export const AddTeamMember: React.FC<AddTeamMemberProps> = ({ onAddMember }) => {
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('Administrator');

  const roles = [
    {
      id: 'Administrator',
      name: 'Administrator',
      description: 'Administrator users can perform any action.'
    },
    {
      id: 'Subsidiary',
      name: 'Subsidiary', 
      description: 'Subsidiary users have the ability to read, create, and update.'
    },
    {
      id: 'Direct Supplier',
      name: 'Direct Supplier',
      description: 'Direct Supplier users have the ability to read, create, and update.'
    }
  ];

  const handleAdd = () => {
    if (email && selectedRole) {
      onAddMember(email, selectedRole);
      setEmail('');
      setSelectedRole('Administrator');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Team Member</CardTitle>
        <CardDescription>
          Add a new team member to your team, allowing them to collaborate with you.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-700">
            Please provide the email address of the person you would like to add to this team.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-gray-700">Role</Label>
          <RadioGroup value={selectedRole} onValueChange={setSelectedRole}>
            {roles.map((role) => (
              <div key={role.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value={role.id} id={role.id} className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor={role.id} className="font-medium text-gray-900 cursor-pointer">
                    {role.name}
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    {role.description}
                  </p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleAdd}
            disabled={!email}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6"
          >
            ADD
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
