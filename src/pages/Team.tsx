
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CompanyDetails } from '@/components/team/CompanyDetails';
import { AddTeamMember } from '@/components/team/AddTeamMember';
import { PendingInvitations } from '@/components/team/PendingInvitations';

const Team = () => {
  const [pendingInvitations, setPendingInvitations] = useState([]);

  const handleAddMember = (email: string, role: string) => {
    // Add to pending invitations
    setPendingInvitations(prev => [...prev, { email, role }]);
    // Here you would typically send an invitation email
    console.log(`Inviting ${email} as ${role}`);
  };

  const handleCancelInvitation = (email: string) => {
    setPendingInvitations(prev => prev.filter(inv => inv.email !== email));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Team Settings</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <CompanyDetails />
          </div>
          
          <div className="space-y-8">
            <AddTeamMember onAddMember={handleAddMember} />
            <PendingInvitations 
              invitations={pendingInvitations}
              onCancelInvitation={handleCancelInvitation}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
