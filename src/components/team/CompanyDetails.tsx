
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export const CompanyDetails = () => {
  const { user, profile, refreshProfile } = useAuthContext();
  const [companyName, setCompanyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (profile?.company_name) {
      setCompanyName(profile.company_name);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ company_name: companyName })
        .eq('id', user.id);

      if (error) throw error;

      await refreshProfile();
      toast({
        title: 'Success',
        description: 'Company details updated successfully.',
      });
    } catch (error) {
      console.error('Error updating company details:', error);
      toast({
        title: 'Error',
        description: 'Failed to update company details.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDisplayName = () => {
    if (profile?.full_name) return profile.full_name;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  const getDisplayEmail = () => {
    return user?.email || profile?.email || '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Details</CardTitle>
        <CardDescription>
          The company's name and owner information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">
            Company Owner
          </Label>
          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-blue-500 text-white">
                {getDisplayName().charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-gray-900">{getDisplayName()}</div>
              <div className="text-sm text-gray-500">{getDisplayEmail()}</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyName" className="text-sm font-medium text-gray-700">
            Company Name
          </Label>
          <Input
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Enter company name"
            className="w-full"
          />
        </div>

        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            disabled={isLoading}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6"
          >
            {isLoading ? 'Saving...' : 'SAVE'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
