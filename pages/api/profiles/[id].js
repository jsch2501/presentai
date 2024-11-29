import { createClient } from '@supabase/supabase-js';

// Korrekte Supabase-Konfiguration
const supabaseUrl = 'https://cdmrzgvnscpeceqamjkj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkbXJ6Z3Zuc2NwZWNlcWFtamtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk5NTI5MDMsImV4cCI6MjA0NTUyODkwM30.V5AvV9IZWMwikCKCj69ISAKEsFiZToLMqquiL70LRQ4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  const { id } = req.query;

  // Optionen-Anfrage für CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    try {
      console.log('Fetching profile with ID:', id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      if (!data) {
        return res.status(404).json({ 
          success: false, 
          error: 'Profil nicht gefunden' 
        });
      }

      return res.status(200).json({
        success: true,
        data: data
      });

    } catch (error) {
      console.error('Server error:', error);
      return res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }

  if (req.method === 'PUT') {
    try {
      const updates = req.body;
      console.log('Updating profile:', id, updates);

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({
        success: true,
        data: data
      });

    } catch (error) {
      console.error('Update error:', error);
      return res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return res.status(200).json({
        success: true,
        message: 'Profil erfolgreich gelöscht'
      });

    } catch (error) {
      return res.status(500).json({ 
        success: false, 
        error: error.message 
      });
    }
  }

  return res.status(405).json({ 
    success: false, 
    error: 'Method not allowed' 
  });
}