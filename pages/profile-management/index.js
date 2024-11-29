import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Navigation from '../../components/Navigation';
import ProfileCard from '../../components/ProfileCard';
import AddProfileModal from '../../components/AddProfileModal';

export default function ProfileManagement() {
  const router = useRouter();
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    try {
      setLoading(true);
      const response = await fetch('/api/profiles');
      const data = await response.json();
      setProfiles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Fehler beim Laden der Profile:', err);
      setError('Fehler beim Laden der Profile');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(profileId) {
    if (!window.confirm('Möchten Sie dieses Profil wirklich löschen?')) {
      return;
    }

    try {
      const response = await fetch(`/api/profiles/${profileId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Fehler beim Löschen des Profils');
      await fetchProfiles();
    } catch (err) {
      console.error('Fehler beim Löschen:', err);
      setError('Fehler beim Löschen des Profils');
    }
  }

  async function handleSaveProfile(profileData) {
    try {
      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) throw new Error('Fehler beim Speichern des Profils');
      
      await fetchProfiles();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Fehler beim Speichern:', err);
      setError('Fehler beim Speichern des Profils');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Meine Profile</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            + Neues Profil
          </button>
        </div>

        {loading && (
          <div className="text-center py-8">
            <p>Lade Profile...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map(profile => (
            <ProfileCard
              key={profile.id}
              profile={profile}
              onEdit={() => router.push(`/profile-management/${profile.id}/edit`)}
              onDelete={() => handleDelete(profile.id)}
            />
          ))}
        </div>

        <AddProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveProfile}
        />
      </main>
    </div>
  );
}
