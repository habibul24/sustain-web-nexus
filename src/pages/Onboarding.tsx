import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface OfficeLocation {
  name: string;
  address: string;
}

const Onboarding = () => {
  const [formData, setFormData] = useState({
    software: '',
    operations: '',
    firstYearReporting: '',
    framework: '',
    reportingYearEndDate: '',
    hasMultipleLocations: '',
    hasSubsidiaries: '',
    numberOfSubsidiaries: '',
    gatheringDataViaApp: false
  });
  const [officeLocations, setOfficeLocations] = useState<OfficeLocation[]>([{ name: '', address: '' }]);
  const [loading, setLoading] = useState(false);
  
  const { user, refreshProfile } = useAuthContext();
  const navigate = useNavigate();

  const addOfficeLocation = () => {
    setOfficeLocations([...officeLocations, { name: '', address: '' }]);
  };

  const removeOfficeLocation = (index: number) => {
    setOfficeLocations(officeLocations.filter((_, i) => i !== index));
  };

  const updateOfficeLocation = (index: number, field: keyof OfficeLocation, value: string) => {
    const updated = [...officeLocations];
    updated[index][field] = value;
    setOfficeLocations(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Update user profile with onboarding data
      const { error: profileError } = await supabase
        .from('user_profiles')
        .update({
          software_used: formData.software,
          operations_description: formData.operations,
          first_year_reporting: formData.firstYearReporting === 'yes',
          applicable_framework: formData.framework,
          reporting_year_end_date: formData.reportingYearEndDate,
          has_multiple_locations: formData.hasMultipleLocations === 'yes',
          has_subsidiaries: formData.hasSubsidiaries === 'yes',
          number_of_subsidiaries: formData.numberOfSubsidiaries ? parseInt(formData.numberOfSubsidiaries) : null,
          gathering_data_via_app: formData.gatheringDataViaApp,
          onboarding_completed: true
        })
        .eq('id', user?.id);

      if (profileError) {
        toast({
          title: "Error saving information",
          description: profileError.message,
          variant: "destructive",
        });
        return;
      }

      // Save office locations if user has multiple locations
      if (formData.hasMultipleLocations === 'yes') {
        const validLocations = officeLocations.filter(loc => loc.name.trim() && loc.address.trim());
        if (validLocations.length > 0) {
          const { error: locationsError } = await supabase
            .from('office_locations')
            .insert(
              validLocations.map(location => ({
                user_id: user?.id,
                name: location.name,
                address: location.address
              }))
            );

          if (locationsError) {
            toast({
              title: "Error saving office locations",
              description: locationsError.message,
              variant: "destructive",
            });
            return;
          }
        }
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
                    <SelectItem value="xero">Xero</SelectItem>
                    <SelectItem value="sage">Sage</SelectItem>
                    <SelectItem value="sage-intacct">Sage Intacct</SelectItem>
                    <SelectItem value="netsuite">Netsuite</SelectItem>
                    <SelectItem value="sap">SAP</SelectItem>
                    <SelectItem value="oracle-fusion-cloud-erp">Oracle Fusion Cloud ERP</SelectItem>
                    <SelectItem value="reach">Reach</SelectItem>
                    <SelectItem value="quickbooks">Quickbooks</SelectItem>
                    <SelectItem value="mas-accounting">MAS Accounting</SelectItem>
                    <SelectItem value="abss">ABSS</SelectItem>
                    <SelectItem value="sunsystems">Sunsystems</SelectItem>
                    <SelectItem value="myob">MYOB</SelectItem>
                    <SelectItem value="hnry">HNRY</SelectItem>
                    <SelectItem value="sleek">Sleek</SelectItem>
                    <SelectItem value="odoo">Odoo</SelectItem>
                    <SelectItem value="excel-sheets">Excel sheets</SelectItem>
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
                    <SelectItem value="gri">Global Reporting Initiative standards (GRI)</SelectItem>
                    <SelectItem value="sasb">Sustainability Accounting Standards Board standards (SASB)</SelectItem>
                    <SelectItem value="issb">International Sustainability Standards Board (ISSB) IFRS S1 and S2</SelectItem>
                    <SelectItem value="cdp">Carbon Disclosure Projects (CDP)</SelectItem>
                    <SelectItem value="csrd">Corporate Sustainability Reporting Directive (CSRD)</SelectItem>
                    <SelectItem value="cdsb">Climate Disclosure Standard Boards (CDSB)</SelectItem>
                    <SelectItem value="ungc">United Nations Global Compact</SelectItem>
                    <SelectItem value="iirc">International Integrated Reporting Council (IIRC)</SelectItem>
                    <SelectItem value="gresb">Global Real Estate Sustainability Benchmark (GRESB)</SelectItem>
                    <SelectItem value="sbti">Science Based Targets initiative (SBTi)</SelectItem>
                    <SelectItem value="efrag">European Financial Reporting Advisory Group (EFRAG)</SelectItem>
                    <SelectItem value="tcfd">Task Force on Climate-Related Financial Disclosures (TCFD)</SelectItem>
                    <SelectItem value="nger">National Greenhouse and Energy Reporting (NGER)</SelectItem>
                    <SelectItem value="ghg">Greenhouse Gas Protocol Accounting and Reporting Standard (GHG)</SelectItem>
                    <SelectItem value="lca">Life Cycle Assessment (LCA)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="reportingYearEndDate" className="text-sm font-medium text-gray-700">
                  State the end date of the year for which you are reporting data?
                </Label>
                <Input
                  id="reportingYearEndDate"
                  type="text"
                  placeholder="dd/mm/yyyy"
                  value={formData.reportingYearEndDate}
                  onChange={e => setFormData(prev => ({ ...prev, reportingYearEndDate: e.target.value }))}
                  className="mt-1"
                  pattern="^(0[1-9]|[12][0-9]|3[01])/(0[1-9]|1[0-2])/\d{4}$"
                  required
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Do you have multiple office locations?
                </Label>
                <RadioGroup 
                  value={formData.hasMultipleLocations}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, hasMultipleLocations: value }))}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="multiple-locations-yes" />
                    <Label htmlFor="multiple-locations-yes" className="text-sm">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="multiple-locations-no" />
                    <Label htmlFor="multiple-locations-no" className="text-sm">No</Label>
                  </div>
                </RadioGroup>

                {formData.hasMultipleLocations === 'yes' && (
                  <div className="mt-4 space-y-4">
                    <Label className="text-sm font-medium text-gray-700">
                      How many office locations do you operate?
                    </Label>
                    
                    {officeLocations.map((location, index) => (
                      <div key={index} className="border rounded-lg p-4 space-y-3">
                        <div className="flex justify-between items-center">
                          <Label className="text-sm font-medium">Office Location {index + 1}</Label>
                          {officeLocations.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeOfficeLocation(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        <div>
                          <Label className="text-xs text-gray-600">Office Name</Label>
                          <Input
                            placeholder="e.g., Main Office, Branch Office"
                            value={location.name}
                            onChange={(e) => updateOfficeLocation(index, 'name', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-gray-600">Address</Label>
                          <Textarea
                            placeholder="Enter full address"
                            value={location.address}
                            onChange={(e) => updateOfficeLocation(index, 'address', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    ))}
                    
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addOfficeLocation}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Another Office Location
                    </Button>
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Do you have subsidiary companies?
                </Label>
                <RadioGroup 
                  value={formData.hasSubsidiaries}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, hasSubsidiaries: value }))}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="subsidiaries-yes" />
                    <Label htmlFor="subsidiaries-yes" className="text-sm">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="subsidiaries-no" />
                    <Label htmlFor="subsidiaries-no" className="text-sm">No</Label>
                  </div>
                </RadioGroup>

                {formData.hasSubsidiaries === 'yes' && (
                  <div className="mt-4">
                    <Label className="text-sm text-gray-600 mb-2 block">
                      How many subsidiary companies do you have?
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      placeholder="Enter number of subsidiaries"
                      value={formData.numberOfSubsidiaries}
                      onChange={(e) => setFormData(prev => ({ ...prev, numberOfSubsidiaries: e.target.value }))}
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="gathering-data-via-app"
                  checked={formData.gatheringDataViaApp}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, gatheringDataViaApp: checked === true }))
                  }
                />
                <Label htmlFor="gathering-data-via-app" className="text-sm">
                  I will be gathering the data from my offices/subsidiaries using the GreenData app.
                </Label>
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
