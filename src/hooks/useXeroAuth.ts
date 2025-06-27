
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthContext } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useXeroAuth = () => {
  const { user } = useAuthContext();

  const connectToXero = useCallback(async () => {
    if (!user) {
      toast.error('You must be logged in to connect to Xero');
      return;
    }

    try {
      console.log('Initiating Xero connection...');
      
      const { data, error } = await supabase.functions.invoke('xero-oauth', {
        body: { action: 'auth' },
      });

      if (error) {
        console.error('Xero auth error:', error);
        toast.error('Failed to connect to Xero');
        return;
      }

      if (data?.authUrl) {
        console.log('Redirecting to Xero auth URL');
        window.location.href = data.authUrl;
      } else {
        toast.error('Failed to generate Xero authorization URL');
      }
    } catch (error) {
      console.error('Xero connection error:', error);
      toast.error('Failed to connect to Xero');
    }
  }, [user]);

  const handleXeroCallback = useCallback(async (code: string, state?: string) => {
    if (!user) {
      toast.error('You must be logged in');
      return false;
    }

    try {
      console.log('Processing Xero callback...');
      
      const { data, error } = await supabase.functions.invoke('xero-oauth', {
        body: { 
          action: 'callback',
          code,
          state 
        },
      });

      if (error) {
        console.error('Xero callback error:', error);
        toast.error('Failed to complete Xero connection');
        return false;
      }

      if (data?.success) {
        toast.success('Xero connected successfully!');
        return true;
      } else {
        toast.error('Failed to connect to Xero');
        return false;
      }
    } catch (error) {
      console.error('Xero callback processing error:', error);
      toast.error('Failed to complete Xero connection');
      return false;
    }
  }, [user]);

  return {
    connectToXero,
    handleXeroCallback,
  };
};
