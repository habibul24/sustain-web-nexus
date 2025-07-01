
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Scope3aPaper = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [usesPaper, setUsesPaper] = useState<boolean | null>(null);
  const [sortsPaperWaste, setSortsPaperWaste] = useState<boolean | null>(null);
  const [measuresSortedWaste, setMeasuresSortedWaste] = useState<boolean | null>(null);
  const [engagesWasteCompany, setEngagesWasteCompany] = useState<boolean | null>(null);
  const [hasVendorScopeData, setHasVendorScopeData] = useState<boolean | null>(null);
  
  // Waste treatment options
  const [recycles, setRecycles] = useState(false);
  const [incinerates, setIncinerates] = useState(false);
  const [usesLandfill, setUsesLandfill] = useState(false);
  
  // Quantity data
  const [openingQuantity, setOpeningQuantity] = useState('');
  const [totalPurchased, setTotalPurchased] = useState('');
  const [totalRecycled, setTotalRecycled] = useState('');
  const [closingQuantity, setClosingQuantity] = useState('');
  
  // Table data for waste types
  const [wasteData, setWasteData] = useState<Array<{
    type: string;
    quantity: string;
    emissionFactor: string;
  }>>([]);

  useEffect(() => {
    if (user) {
      loadExistingData();
    }
  }, [user]);

  const loadExistingData = async () => {
    try {
      const { data, error } = await supabase
        .from('paper')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading paper data:', error);
        return;
      }

      if (data) {
        setUsesPaper(data.uses_paper);
        setSortsPaperWaste(data.sorts_paper_waste);
        setMeasuresSortedWaste(data.measures_sorted_waste);
        setEngagesWasteCompany(data.engages_waste_company);
        setHasVendorScopeData(data.has_vendor_scope_data);
        setRecycles(data.recycles || false);
        setIncinerates(data.incinerates || false);
        setUsesLandfill(data.uses_landfill || false);
        setOpeningQuantity(data.opening_quantity?.toString() || '');
        setTotalPurchased(data.total_purchased?.toString() || '');
        setTotalRecycled(data.total_recycled?.toString() || '');
        setClosingQuantity(data.closing_quantity?.toString() || '');
      }
    } catch (error) {
      console.error('Error loading paper data:', error);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const paperData = {
        user_id: user.id,
        uses_paper: usesPaper,
        sorts_paper_waste: sortsPaperWaste,
        measures_sorted_waste: measuresSortedWaste,
        engages_waste_company: engagesWasteCompany,
        has_vendor_scope_data: hasVendorScopeData,
        recycles,
        incinerates,
        uses_landfill: usesLandfill,
        opening_quantity: openingQuantity ? parseFloat(openingQuantity) : null,
        total_purchased: totalPurchased ? parseFloat(totalPurchased) : null,
        total_recycled: totalRecycled ? parseFloat(totalRecycled) : null,
        closing_quantity: closingQuantity ? parseFloat(closingQuantity) : null,
      };

      const { error } = await supabase
        .from('paper')
        .upsert(paperData, { onConflict: 'user_id' });

      if (error) throw error;

      // Save individual waste type data
      for (const waste of wasteData) {
        if (waste.quantity && waste.type) {
          await supabase
            .from('paper')
            .upsert({
              user_id: user.id,
              waste_type: waste.type,
              quantity: parseFloat(waste.quantity),
              emission_factor_from_vendor: waste.emissionFactor ? parseFloat(waste.emissionFactor) : null,
            }, { onConflict: 'user_id,waste_type' });
        }
      }

      toast({
        title: "Data saved successfully!",
        description: "Your paper waste assessment data has been saved.",
      });
    } catch (error) {
      console.error('Error saving paper data:', error);
      toast({
        title: "Error saving data",
        description: "There was an error saving your data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateWasteData = (index: number, field: string, value: string) => {
    const newData = [...wasteData];
    newData[index] = { ...newData[index], [field]: value };
    setWasteData(newData);
  };

  useEffect(() => {
    // Add rows for selected waste types
    const types = [];
    if (recycles) types.push('recycle');
    if (incinerates) types.push('combust');
    if (usesLandfill) types.push('landfill');
    
    const newWasteData = types.map(type => 
      wasteData.find(w => w.type === type) || { type, quantity: '', emissionFactor: '' }
    );
    setWasteData(newWasteData);
  }, [recycles, incinerates, usesLandfill]);

  const handleNext = async () => {
    await handleSave();
    navigate('/my-esg/environmental/scope-3/waste/water');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Paper Waste Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Question 1: Does the company use paper */}
          <div className="space-y-4">
            <Label className="text-lg font-medium text-gray-700">
              Does the company use paper in its operations?
            </Label>
            <RadioGroup
              value={usesPaper === null ? '' : usesPaper.toString()}
              onValueChange={(value) => setUsesPaper(value === 'true')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="uses-paper-yes" />
                <Label htmlFor="uses-paper-yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="uses-paper-no" />
                <Label htmlFor="uses-paper-no">No</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Show rest of questions only if uses paper */}
          {usesPaper === true && (
            <>
              {/* Question 2: Does the company sort its paper waste */}
              <div className="space-y-4">
                <Label className="text-lg font-medium text-gray-700">
                  Does the company sort its paper waste?
                </Label>
                <RadioGroup
                  value={sortsPaperWaste === null ? '' : sortsPaperWaste.toString()}
                  onValueChange={(value) => setSortsPaperWaste(value === 'true')}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="true" id="sorts-yes" />
                    <Label htmlFor="sorts-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="false" id="sorts-no" />
                    <Label htmlFor="sorts-no">No</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* If does NOT sort paper waste */}
              {sortsPaperWaste === false && (
                <div className="space-y-4">
                  <Label className="text-lg font-medium text-gray-700">
                    Please provide the following information:
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="opening">Opening quantity of paper at the beginning of the period</Label>
                      <Input
                        id="opening"
                        type="number"
                        value={openingQuantity}
                        onChange={(e) => setOpeningQuantity(e.target.value)}
                        placeholder="Enter quantity in kg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="purchased">Total kg of paper purchased during the period</Label>
                      <Input
                        id="purchased"
                        type="number"
                        value={totalPurchased}
                        onChange={(e) => setTotalPurchased(e.target.value)}
                        placeholder="Enter quantity in kg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="recycled">Total kg of paper recycled in the period</Label>
                      <Input
                        id="recycled"
                        type="number"
                        value={totalRecycled}
                        onChange={(e) => setTotalRecycled(e.target.value)}
                        placeholder="Enter quantity in kg"
                      />
                    </div>
                    <div>
                      <Label htmlFor="closing">Closing quantity of paper available at end of period</Label>
                      <Input
                        id="closing"
                        type="number"
                        value={closingQuantity}
                        onChange={(e) => setClosingQuantity(e.target.value)}
                        placeholder="Enter quantity in kg"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* If sorts paper waste - ask about measuring */}
              {sortsPaperWaste === true && (
                <>
                  <div className="space-y-4">
                    <Label className="text-lg font-medium text-gray-700">
                      Do you measure total sorted waste of paper?
                    </Label>
                    <RadioGroup
                      value={measuresSortedWaste === null ? '' : measuresSortedWaste.toString()}
                      onValueChange={(value) => setMeasuresSortedWaste(value === 'true')}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="true" id="measures-yes" />
                        <Label htmlFor="measures-yes">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="false" id="measures-no" />
                        <Label htmlFor="measures-no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* If measures sorted waste */}
                  {measuresSortedWaste === true && (
                    <>
                      <div className="space-y-4">
                        <Label className="text-lg font-medium text-gray-700">
                          Select the waste treatment methods you use:
                        </Label>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="recycle"
                              checked={recycles}
                              onCheckedChange={(checked) => setRecycles(checked === true)}
                            />
                            <Label htmlFor="recycle">Do you recycle?</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="incinerate"
                              checked={incinerates}
                              onCheckedChange={(checked) => setIncinerates(checked === true)}
                            />
                            <Label htmlFor="incinerate">Do you incinerate/combust?</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="landfill"
                              checked={usesLandfill}
                              onCheckedChange={(checked) => setUsesLandfill(checked === true)}
                            />
                            <Label htmlFor="landfill">Do you use General Disposal/Landfill?</Label>
                          </div>
                        </div>
                      </div>

                      {/* Show table if any treatment methods selected */}
                      {(recycles || incinerates || usesLandfill) && (
                        <div className="space-y-4">
                          <Label className="text-lg font-medium text-gray-700">
                            Waste Treatment Data
                          </Label>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Type</TableHead>
                                <TableHead>Quantity</TableHead>
                                <TableHead>Unit of Measurement</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {wasteData.map((row, index) => (
                                <TableRow key={index}>
                                  <TableCell className="capitalize">{row.type}</TableCell>
                                  <TableCell>
                                    <Input
                                      type="number"
                                      value={row.quantity}
                                      onChange={(e) => updateWasteData(index, 'quantity', e.target.value)}
                                      placeholder="Enter quantity"
                                    />
                                  </TableCell>
                                  <TableCell>kg</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </>
                  )}

                  {/* If does NOT measure sorted waste */}
                  {measuresSortedWaste === false && (
                    <>
                      <div className="space-y-4">
                        <Label className="text-lg font-medium text-gray-700">
                          Engage the services of waste treatment company?
                        </Label>
                        <RadioGroup
                          value={engagesWasteCompany === null ? '' : engagesWasteCompany.toString()}
                          onValueChange={(value) => setEngagesWasteCompany(value === 'true')}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="true" id="engages-yes" />
                            <Label htmlFor="engages-yes">Yes</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="false" id="engages-no" />
                            <Label htmlFor="engages-no">No</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {engagesWasteCompany === true && (
                        <>
                          <div className="space-y-4">
                            <Label className="text-lg font-medium text-gray-700">
                              Have scope 1 and 2 from vendor?
                            </Label>
                            <RadioGroup
                              value={hasVendorScopeData === null ? '' : hasVendorScopeData.toString()}
                              onValueChange={(value) => setHasVendorScopeData(value === 'true')}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="true" id="vendor-yes" />
                                <Label htmlFor="vendor-yes">Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="false" id="vendor-no" />
                                <Label htmlFor="vendor-no">No</Label>
                              </div>
                            </RadioGroup>
                          </div>

                          {hasVendorScopeData === true && (
                            <div className="space-y-4">
                              <Label className="text-lg font-medium text-gray-700">
                                Vendor Data
                              </Label>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Unit of Measurement</TableHead>
                                    <TableHead>Emission Factor from vendor</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  <TableRow>
                                    <TableCell>
                                      <Input
                                        type="number"
                                        value={wasteData[0]?.quantity || ''}
                                        onChange={(e) => updateWasteData(0, 'quantity', e.target.value)}
                                        placeholder="Enter quantity"
                                      />
                                    </TableCell>
                                    <TableCell>kg</TableCell>
                                    <TableCell>
                                      <Input
                                        type="number"
                                        value={wasteData[0]?.emissionFactor || ''}
                                        onChange={(e) => updateWasteData(0, 'emissionFactor', e.target.value)}
                                        placeholder="Enter emission factor"
                                      />
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}

          <div className="flex justify-between space-x-4">
            <Button
              onClick={handleSave}
              disabled={loading}
              variant="outline"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? 'Saving...' : 'Save'}
            </Button>
            
            <Button
              onClick={handleNext}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              Next to Water
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Scope3aPaper;
