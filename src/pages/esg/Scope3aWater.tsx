import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

interface OfficeLocation {
  id: string;
  name: string;
  address: string;
}

const Scope3aWater = () => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [locations, setLocations] = useState<OfficeLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  useEffect(() => {
    if (user) {
      fetchLocations();
    }
  }, [user]);

  const fetchLocations = async () => {
    try {
      const { data, error } = await supabase
        .from('office_locations')
        .select('id, name, address')
        .eq('user_id', user.id)
        .order('name');

      if (error) throw error;
      setLocations(data || []);
    } catch (error) {
      console.error('Error fetching locations:', error);
      toast({
        title: "Error!",
        description: "Failed to fetch office locations.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGo = () => {
    if (selectedLocation) {
      navigate(`/my-esg/environmental/scope-3/waste/water/${selectedLocation}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Water Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-sm text-gray-600 mb-6">
            <p>💡 Select an office location to enter water consumption data.</p>
            <p>💡 Water consumption data will be used to calculate Scope 3 emissions.</p>
          </div>
          {locations.length === 0 ? (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                No Office Locations Found
              </h3>
              <p className="text-gray-600 mb-4">
                You need to add office locations before you can enter water consumption data.
              </p>
              <Button 
                onClick={() => navigate('/my-esg/social/employee-profile')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Add Office Locations
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <label htmlFor="location-select" className="font-medium">Select Office Location:</label>
              <select
                id="location-select"
                className="border rounded px-3 py-2 min-w-[220px]"
                value={selectedLocation}
                onChange={e => setSelectedLocation(e.target.value)}
              >
                <option value="">-- Select a location --</option>
                {locations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
              <Button
                onClick={handleGo}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={!selectedLocation}
              >
                Go
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Scope3aWater;
