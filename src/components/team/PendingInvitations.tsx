
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Invitation {
  email: string;
  role: string;
}

interface PendingInvitationsProps {
  invitations: Invitation[];
  onCancelInvitation: (email: string) => void;
}

export const PendingInvitations: React.FC<PendingInvitationsProps> = ({
  invitations,
  onCancelInvitation
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Team Invitations</CardTitle>
        <CardDescription>
          These people have been invited to your team and have been sent an invitation email. 
          They may join the team by accepting the email invitation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {invitations.map((invitation) => (
            <div key={invitation.email} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
              <span className="text-gray-900">{invitation.email}</span>
              <Button
                variant="ghost"
                onClick={() => onCancelInvitation(invitation.email)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Cancel
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
