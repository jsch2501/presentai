import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cdmrzgvnscpeceqamjkj.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNkbXJ6Z3Zuc2NwZWNlcWFtamtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk5NTI5MDMsImV4cCI6MjA0NTUyODkwM30.V5AvV9IZWMwikCKCj69ISAKEsFiZToLMqquiL70LRQ4';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*');

      if (error) throw error;

      return res.status(200).json(data);
    } catch (error) {
      console.error('Error fetching profiles:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  if (req.method === 'POST') {
    try {
      // Minimale Datenstruktur
      const profileData = {
        name: req.body.name || { first: '', last: '' },
        gender: req.body.gender || null,
        relationship: req.body.relationship || null,
        occasions: req.body.occasions || null,
        preferences: req.body.preferences || null,
        notifications: req.body.notifications || null,
        history: req.body.history || null,
        additional_info: req.body.additional_info || null,
        personality_traits: req.body.personality_traits || null,
        known_since: req.body.known_since || null,
        description: req.body.description || null,
        user_id: req.body.user_id || null
      };

      console.log('Sending profile data:', profileData);

      const { data, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select();

      if (error) throw error;

      return res.status(201).json(data[0]);
    } catch (error) {
      console.error('Error creating profile:', error);
      return res.status(500).json({ error: error.message });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
