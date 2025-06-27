
-- Create email templates for welcome and verification emails
INSERT INTO public.email_templates (name, subject, html_content, text_content, template_type, variables) VALUES 
(
  'welcome_email_greendata',
  'Welcome to Green_data!',
  '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #333; text-align: center;">Green_data</h1>
    <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; margin: 20px 0;">
      <h2 style="color: #495057; margin-bottom: 20px;">Hey {{user_name}},</h2>
      <p style="color: #6c757d; line-height: 1.6; font-size: 16px;">
        Welcome to Green_data! We''re thrilled to have you on board and can''t wait to see what you accomplish.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{site_url}}" style="background-color: #495057; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Visit Website</a>
      </div>
      <p style="color: #6c757d; margin-top: 30px;">
        Thanks,<br>
        Green_data Team
      </p>
    </div>
    <p style="text-align: center; color: #adb5bd; font-size: 12px; margin-top: 30px;">
      © 2025 Green_data. All rights reserved.
    </p>
  </div>',
  'Welcome to Green_data! We''re thrilled to have you on board and can''t wait to see what you accomplish.',
  'welcome',
  '["user_name", "site_url"]'
),
(
  'email_verification_greendata',
  'Please verify your email address',
  '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
    <h1 style="color: #333; text-align: center;">Green_data</h1>
    <div style="background-color: #f8f9fa; padding: 30px; border-radius: 8px; margin: 20px 0;">
      <h2 style="color: #495057; margin-bottom: 20px;">Hello!</h2>
      <p style="color: #6c757d; line-height: 1.6; font-size: 16px; margin-bottom: 30px;">
        Please click the button below to verify your email address.
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="{{verification_url}}" style="background-color: #495057; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email Address</a>
      </div>
      <p style="color: #6c757d; font-size: 14px; margin-top: 30px;">
        If you did not create an account, no further action is required.
      </p>
      <p style="color: #6c757d; margin-top: 20px;">
        Regards,<br>
        Green_data
      </p>
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #dee2e6;">
        <p style="color: #6c757d; font-size: 12px;">
          If you''re having trouble clicking the "Verify Email Address" button, copy and paste the URL below into your web browser: {{verification_url}}
        </p>
      </div>
    </div>
    <p style="text-align: center; color: #adb5bd; font-size: 12px; margin-top: 30px;">
      © 2025 Green_data. All rights reserved.
    </p>
  </div>',
  'Please click the link to verify your email address: {{verification_url}}',
  'email_verification',
  '["verification_url"]'
);

-- Create email triggers for the new templates
INSERT INTO public.email_triggers (name, description, trigger_event, template_id, delay_minutes, is_active)
SELECT 
  'welcome_new_user_greendata',
  'Send welcome email to new Green_data users',
  'user_signup',
  et.id,
  1,
  true
FROM public.email_templates et WHERE et.name = 'welcome_email_greendata';

INSERT INTO public.email_triggers (name, description, trigger_event, template_id, delay_minutes, is_active)
SELECT 
  'email_verification_greendata',
  'Send email verification to new Green_data users',
  'email_verification',
  et.id,
  0,
  true
FROM public.email_templates et WHERE et.name = 'email_verification_greendata';
