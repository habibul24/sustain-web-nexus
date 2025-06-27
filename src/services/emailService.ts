
import { supabase } from '@/integrations/supabase/client';

export interface SendWelcomeEmailData {
  email: string;
  name: string;
  siteUrl: string;
}

export const sendWelcomeEmail = async (data: SendWelcomeEmailData) => {
  try {
    const { data: result, error } = await supabase.functions.invoke('send-welcome-email', {
      body: data,
    });

    if (error) {
      console.error('Error sending welcome email:', error);
      return { error };
    }

    console.log('Welcome email sent successfully:', result);
    return { data: result, error: null };
  } catch (error) {
    console.error('Error invoking send-welcome-email function:', error);
    return { error };
  }
};

export const logEmailSent = async (
  userId: string,
  email: string,
  templateType: string,
  status: string = 'sent'
) => {
  try {
    const { error } = await supabase.from('email_logs').insert({
      user_id: userId,
      to_email: email,
      from_email: 'Green_data <onboarding@resend.dev>',
      subject: templateType === 'welcome' ? 'Welcome to Green_data!' : 'Please verify your email address',
      status,
    });

    if (error) {
      console.error('Error logging email:', error);
    }
  } catch (error) {
    console.error('Error logging email:', error);
  }
};
