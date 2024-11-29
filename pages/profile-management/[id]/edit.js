import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';  // Diese Datei wird verwendet
import ProfileDetailsForm from '@/components/ProfileDetailsForm';

// ... Rest des Codes bleibt gleich

export default function EditProfile() {
  const router = useRouter();
  const { id } = router.query;
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchProfile();
    }
  }, [id]);

  async function fetchProfile() {
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

      console.log('Fetched profile:', data);
      setProfile(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(updatedProfile) {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updatedProfile)
        .eq('id', id);

      if (error) throw error;

      router.push('/profile-management');
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <div>Laden...</div>;
  if (error) return <div>Fehler: {error}</div>;
  if (!profile) return <div>Profil nicht gefunden</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Profil bearbeiten</h1>
      <ProfileDetailsForm 
        profile={profile}
        onSave={handleSave}
        isEditing={true}
      />
    </div>
  );
}