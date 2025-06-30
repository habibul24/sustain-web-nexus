
-- Create a storage bucket for invoice uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('invoice-uploads', 'invoice-uploads', false);

-- Create RLS policies for the invoice uploads bucket
CREATE POLICY "Users can upload their own invoices" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'invoice-uploads' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own invoices" ON storage.objects
FOR SELECT USING (
  bucket_id = 'invoice-uploads' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own invoices" ON storage.objects
FOR DELETE USING (
  bucket_id = 'invoice-uploads' AND 
  auth.uid()::text = (storage.foldername(name))[1]
);
