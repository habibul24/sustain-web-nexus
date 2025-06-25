
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Onboarding = () => {
  const [formData, setFormData] = useState({
    software: '',
    operations: '',
    firstYearReporting: '',
    framework: '',
    numberOfLocations: '',
    linkingSubsidiaries: false
  });
  const [loading, setLoading] = useState(false);
  
  const { user, refreshProfile } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update user profile with onboarding data
      const { error } = await supabase
        .from('user_profiles')
        .update({
          software_used: formData.software,
          operations_description: formData.operations,
          first_year_reporting: formData.firstYearReporting === 'yes',
          applicable_framework: formData.framework,
          number_of_locations: formData.numberOfLocations,
          linking_subsidiaries: formData.linkingSubsidiaries,
          onboarding_completed: true
        })
        .eq('id', user?.id);

      if (error) {
        toast({
          title: "Error saving information",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Welcome to GreenData!",
        description: "Your information has been saved. Let's start your sustainability journey!",
      });
      
      // Refresh the profile to get updated data
      await refreshProfile();
      
      // Small delay to ensure state is updated, then navigate
      setTimeout(() => {
        navigate('/my-esg');
        // Force a page reload as backup to ensure auth state is properly updated
        window.location.reload();
      }, 500);
      
    } catch (error: any) {
      toast({
        title: "Error saving information",
        description: error.message || String(error),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="shadow-xl border-green-200">
          <CardHeader className="bg-green-50 border-b text-center">
            <CardTitle className="text-3xl font-bold text-gray-900">
              Welcome to GreenData!
            </CardTitle>
            <p className="text-lg text-gray-600 mt-2">
              Let's Start Reducing Your Carbon Footprint Together
            </p>
          </CardHeader>

          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="software" className="text-sm font-medium text-gray-700">
                  Please Select the Software You Use
                </Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, software: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select software" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="placeholder1">Software Option 1</SelectItem>
                    <SelectItem value="placeholder2">Software Option 2</SelectItem>
                    <SelectItem value="placeholder3">Software Option 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="operations" className="text-sm font-medium text-gray-700">
                  Describe your operations below
                </Label>
                <Textarea
                  id="operations"
                  value={formData.operations}
                  onChange={(e) => setFormData(prev => ({ ...prev, operations: e.target.value }))}
                  placeholder="Describe your company's operations..."
                  className="mt-1 min-h-[100px]"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Is this your first year reporting?
                </Label>
                <RadioGroup 
                  value={formData.firstYearReporting}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, firstYearReporting: value }))}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="first-year-yes" />
                    <Label htmlFor="first-year-yes" className="text-sm">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="first-year-no" />
                    <Label htmlFor="first-year-no" className="text-sm">No</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="framework" className="text-sm font-medium text-gray-700">
                  Choose your applicable framework
                </Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, framework: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select framework" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="framework1">Framework Option 1</SelectItem>
                    <SelectItem value="framework2">Framework Option 2</SelectItem>
                    <SelectItem value="framework3">Framework Option 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="locations" className="text-sm font-medium text-gray-700">
                  Do you have multiple company locations/subsidiaries?
                </Label>
                <div className="mt-3 space-y-4">
                  <div>
                    <Label className="text-sm text-gray-600 mb-2 block">
                      Number of company locations:
                    </Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, numberOfLocations: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select number of locations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2-5">2-5</SelectItem>
                        <SelectItem value="6-10">6-10</SelectItem>
                        <SelectItem value="11-50">11-50</SelectItem>
                        <SelectItem value="50+">50+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="linking-subsidiaries"
                      checked={formData.linkingSubsidiaries}
                      onCheckedChange={(checked) => 
                        setFormData(prev => ({ ...prev, linkingSubsidiaries: checked === true }))
                      }
                    />
                    <Label htmlFor="linking-subsidiaries" className="text-sm">
                      I will be linking subsidiaries to the platform
                    </Label>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button 
                  type="submit"
                  className="w-full btn-orange-gradient font-semibold py-3"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Complete Setup & Continue to My ESG'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
