import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cdmrzgvnspeceqamjkj.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkbXJ6Z3Zuc2NwZWNlcWFtamtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTk1MjkwMywiZXhwIjoyMDQ1NTI4OTAzfQ.2IdeeKptRKxniu-7jZ0gtHRtVIb4aj977XWizxUtUsM';

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
