
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Scope3aWater = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Water Assessment
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-700 mb-4">
              Water Assessment Coming Soon
            </h3>
            <p className="text-gray-600">
              This section will contain the water-related waste assessment questions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Scope3aWater;
