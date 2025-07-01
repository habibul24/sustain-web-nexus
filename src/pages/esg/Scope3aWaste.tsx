
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';

const Scope3aWaste = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const [contributesSignificantly, setContributesSignificantly] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadExistingData();
    }
  }, [user]);

  const loadExistingData = async () => {
    try {
      const { data, error } = await supabase
        .from('waste')
        .select('*')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading waste data:', error);
        return;
      }

      if (data) {
        setContributesSignificantly(data.contributes_significantly);
      }
    } catch (error) {
      console.error('Error loading waste data:', error);
    }
  };

  const handleSave = async () => {
    if (!user || contributesSignificantly === null) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('waste')
        .upsert({
          user_id: user.id,
          contributes_significantly: contributesSignificantly,
        }, {
          onConflict: 'user_id'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error saving waste data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    await handleSave();
    navigate('/my-esg/environmental/scope-3/waste/paper');
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Waste generated from operations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label className="text-lg font-medium text-gray-700">
              Does the waste generated in Company operations contribute significantly to scope 3 emissions?
            </Label>
            <RadioGroup
              value={contributesSignificantly === null ? '' : contributesSignificantly.toString()}
              onValueChange={(value) => setContributesSignificantly(value === 'true')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="yes" />
                <Label htmlFor="yes">Yes</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="no" />
                <Label htmlFor="no">No</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleNext}
              disabled={contributesSignificantly === null || loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? 'Saving...' : 'Next'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Scope3aWaste;
