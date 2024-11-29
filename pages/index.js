import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navigation from '../components/Navigation';
import GiftAdvisor from '../components/GiftAdvisor';

export default function Home() {
  const [showProfileSelect, setShowProfileSelect] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    fetchProfiles();
  }, []);

  async function fetchProfiles() {
    try {
      const response = await fetch('/api/profiles');
      const data = await response.json();
      setProfiles(data);
    } catch (error) {
      console.error('Fehler beim Laden der Profile:', error);
    }
  }

  return (
    <div className="min-h-screen">
      <Head>
        <title>GiftlyAI - Finden Sie das perfekte Geschenk</title>
        <meta name="description" content="Personalisierte Geschenkvorschläge mit KI" />
      </Head>

      <Navigation />
      
      <main className="container mx-auto px-4 pt-20">
        {showProfileSelect && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Wählen Sie ein Profil oder starten Sie eine neue Suche</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Array.isArray(profiles) && profiles.map(profile => (
                <button
                  key={profile.id}
                  onClick={() => {
                    setSelectedProfile(profile);
                    setShowProfileSelect(false);
                  }}
                  className="p-4 border rounded hover:bg-gray-50"
                >
                  <h3 className="font-medium">{profile.name}</h3>
                  <p className="text-sm text-gray-600">
                    {profile.relationship?.specific}
                  </p>
                </button>
              ))}
              <button
                onClick={() => setShowProfileSelect(false)}
                className="p-4 border rounded hover:bg-gray-50 flex items-center justify-center"
              >
                <span>+ Neue Suche ohne Profil</span>
              </button>
            </div>
          </div>
        )}

        <GiftAdvisor 
          initialProfile={selectedProfile}
          onSaveProfile={async (formData) => {
            try {
              const response = await fetch('/api/profiles', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  name: formData.name || 'Neues Profil',
                  relationship: {
                    type: formData.relationship,
                    specific: formData.relationship
                  },
                  occasions: {
                    birthday: null,
                    anniversary: null,
                    customDates: []
                  },
                  preferences: {
                    interests: formData.interests?.split(',').map(i => i.trim()) || [],
                    dislikes: []
                  }
                }),
              });
              
              if (!response.ok) throw new Error('Fehler beim Speichern des Profils');
              
              const savedProfile = await response.json();
              setProfiles([...profiles, savedProfile]);
              // Optional: Erfolgsmeldung anzeigen
            } catch (error) {
              console.error('Fehler:', error);
              // Optional: Fehlermeldung anzeigen
            }
          }}
        />
      </main>
    </div>
  );
}
