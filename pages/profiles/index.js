import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

const Profiles = () => {
  const router = useRouter();
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    // Hier können wir später die Profile laden
  }, []);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile) => (
            <div key={profile.id} className="border p-4 rounded-lg">
              {/* Profil-Inhalt hier */}
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Profiles;
