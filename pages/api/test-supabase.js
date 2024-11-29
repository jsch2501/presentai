import { createClient } from '@supabase/supabase-js';

// Korrekte Initialisierung mit den richtigen Umgebungsvariablen
const supabaseUrl = 'https://cdmrzgvnscpeceqamjkj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkbXJ6Z3Zuc2NwZWNlcWFtamtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk5NTI5MDMsImV4cCI6MjA0NTUyODkwM30.V5AvV9IZWMwikCKCj69ISAKEsFiZToLMqquiL70LRQ4';

// Supabase Client mit den korrekten Optionen
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  }
});

export default async function handler(req, res) {
  try {
    // Einfacher Test-Query
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (error) {
      throw error;
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
}
