// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://acqbozvocqdbdbifxckm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFjcWJvenZvY3FkYmRiaWZ4Y2ttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA2Nzk5ODQsImV4cCI6MjA2NjI1NTk4NH0.YCAq2gk6yhjevF-eGiYx8S_0SgieXAc583_NpSZReBM";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);