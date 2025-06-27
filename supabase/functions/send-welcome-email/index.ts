
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  name: string;
  siteUrl: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name, siteUrl }: WelcomeEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Green_data <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to Green_data!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #333; text-align: center;">Green_data</h1>
          <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #495057; margin-bottom: 20px;">Hey ${name},</h2>
            <p style="color: #6c757d; line-height: 1.6; font-size: 16px;">
              Welcome to Green_data! We're thrilled to have you on board and can't wait to see what you accomplish.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${siteUrl}" style="background-color: #495057; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Visit Website</a>
            </div>
            <p style="color: #6c757d; margin-top: 30px;">
              Thanks,<br>
              Green_data Team
            </p>
          </div>
          <p style="text-align: center; color: #adb5bd; font-size: 12px; margin-top: 30px;">
            © 2025 Green_data. All rights reserved.
          </p>
        </div>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
