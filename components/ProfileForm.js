import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ProfileForm({ 
    initialData = null, 
    onSubmit, 
    submitButtonText = "Speichern",
    isEditing = false 
  }) {
    const router = useRouter();
    const [formData, setFormData] = useState({
      name: initialData?.name || { first: '', last: '' },
      gender: initialData?.gender || '',
      relationship: initialData?.relationship || null,
      occasions: initialData?.occasions || null,
      preferences: initialData?.preferences || null,
      notifications: initialData?.notifications || {
        enabled: false,
        reminders: [],
        method: 'email',
        contactInfo: {}
      },
      history: initialData?.history || null,
      personality_traits: initialData?.personality_traits || {},
      known_since: initialData?.known_since || '',
      description: initialData?.description || ''
    });
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      await onSubmit(formData);
    };
  
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Bestehende Formularfelder bleiben gleich */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Vorname
            </label>
            <input
              type="text"
              value={formData.name.first}
              onChange={(e) => setFormData({
                ...formData,
                name: { ...formData.name, first: e.target.value }
              })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>
          {/* ... weitere Formularfelder ... */}
        </div>
  
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/profile-management')}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Zurück
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {submitButtonText}
          </button>
        </div>
      </form>
    );
  }