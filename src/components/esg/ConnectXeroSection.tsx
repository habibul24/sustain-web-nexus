
import React, { useEffect } from 'react';
import { Button } from '../ui/button';
import { Zap, ArrowRight } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useXeroAuth } from '@/hooks/useXeroAuth';

const features = [
  {
    title: 'Automated Data Import',
    description: 'Save time by automatically importing your energy consumption data',
  },
  {
    title: 'Accurate Calculations',
    description: 'Ensure accuracy with direct data from your accounting system',
  },
  {
    title: 'Real-time Updates',
    description: 'Keep your carbon emissions data up to date automatically',
  },
];

const ConnectXeroSection = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { connectToXero, handleXeroCallback } = useXeroAuth();

  // Handle OAuth callback
  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    
    if (code) {
      console.log('Xero OAuth callback detected');
      handleXeroCallback(code, state || undefined).then((success) => {
        if (success) {
          // Clean up URL parameters after successful connection
          navigate('/my-esg', { replace: true });
        }
      });
    }
  }, [searchParams, handleXeroCallback, navigate]);

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">Connect Your Accounting Software</h2>
        <p className="text-lg text-gray-600 mb-6 text-center max-w-2xl">
          Connect to Xero to automatically import your energy consumption data and streamline your carbon emission calculations.
        </p>
        <div className="flex flex-col md:flex-row gap-4">
          <Button 
            variant="secondary" 
            className="text-base px-6 py-3 flex items-center gap-2"
            onClick={connectToXero}
          >
            <Zap className="w-5 h-5" /> Connect to Xero
          </Button>
          <Button
            variant="default"
            className="text-base px-6 py-3 flex items-center gap-2 bg-green-500 hover:bg-green-600"
            onClick={() => navigate('/my-esg/environmental/scope-1/stationary-combustion')}
          >
            Start Calculation <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
      <div className="bg-gray-50 rounded-xl shadow p-8 mt-2">
        <h3 className="text-xl font-semibold mb-6">Why Connect to Xero?</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="bg-white rounded-lg p-6 shadow-sm flex flex-col items-start">
              <div className="font-bold text-base mb-2">{f.title}</div>
              <div className="text-gray-600 text-sm">{f.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConnectXeroSection;
