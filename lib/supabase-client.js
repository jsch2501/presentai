import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cdmrzgvnspeceqamjkj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkbXJ6Z3Zuc2NwZWNlcWFtamtqIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcyOTk1MjkwMywiZXhwIjoyMDQ1NTI4OTAzfQ.2IdeeKptRKxniu-7jZ0gtHRtVIb4aj977XWizxUtUsM';

const supabase = createClient(supabaseUrl, supabaseKey);

// Sofortiger Verbindungstest
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
      
    if (error) throw error;
    console.log('Supabase Verbindung erfolgreich');
  } catch (error) {
    console.error('Supabase Verbindungsfehler:', error);
  }
};

testConnection();

export { supabase };

