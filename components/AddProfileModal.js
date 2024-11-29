import { useState } from 'react';
import RelationshipSelector from './RelationshipSelector';
import DateSelector from './DateSelector';
import NotificationSettings from './NotificationSettings';
import AdditionalInfoForm from './AdditionalInfoForm';

export default function AddProfileModal({ isOpen, onClose, onSave }) {
  const [step, setStep] = useState(1);
  const [profileData, setProfileData] = useState({
    name: '',
    gender: '',
    relationships: {},
    customDates: [],
    notifications: {
      enabled: false,
      reminders: [],
      method: 'email',
      contactInfo: {}
    },
    additionalInfo: {
      questions: {},
      freeform: ''
    }
  });

  const [showValidationError, setShowValidationError] = useState(false);

  const handleGenderSelect = (selectedGender) => {
    setProfileData(prev => ({
      ...prev,
      gender: prev.gender === selectedGender ? '' : selectedGender
    }));
  };

  const handleRelationshipSelect = (category, value) => {
    setProfileData(prev => ({
      ...prev,
      relationships: {
        ...prev.relationships,
        [category]: category === 'family' || category === 'partnership' 
          ? (prev.relationships[category] === value ? null : value)
          : Array.isArray(prev.relationships[category])
            ? prev.relationships[category].includes(value)
              ? prev.relationships[category].filter(v => v !== value)
              : [...prev.relationships[category], value]
            : [value]
      }
    }));
  };

  const handleSave = async () => {
    if (!profileData.name.trim()) {
      setShowValidationError(true);
      return;
    }
    
    try {
      await onSave(profileData);
      setShowValidationError(false);
      onClose();
    } catch (error) {
      console.error('Fehler beim Speichern:', error);
      alert('Fehler beim Speichern des Profils');
    }
  };

  const handleNameChange = (e) => {
    setProfileData(prev => ({
      ...prev,
      name: e.target.value
    }));
    if (showValidationError && e.target.value.trim()) {
      setShowValidationError(false);
    }
  };

  const handleNext = () => {
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute inset-10 bg-white rounded-lg p-6 overflow-auto">
        {step === 1 ? (
          <>
            <h2 className="text-2xl font-bold mb-6">Neues Profil erstellen</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={handleNameChange}
                className={`w-full p-2 border rounded ${
                  showValidationError && !profileData.name.trim()
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              />
              {showValidationError && !profileData.name.trim() && (
                <p className="mt-1 text-sm text-red-600">
                  Bitte füllen Sie alle Pflichtfelder aus
                </p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Geschlecht
              </label>
              <div className="flex gap-2">
                {['männlich', 'weiblich', 'divers'].map((gender) => (
                  <button
                    key={gender}
                    type="button"
                    onClick={() => handleGenderSelect(gender)}
                    className={`px-4 py-2 rounded-full ${
                      profileData.gender === gender
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {gender}
                  </button>
                ))}
              </div>
            </div>

            <RelationshipSelector
              value={profileData.relationships}
              onChange={(relationships) => setProfileData(prev => ({
                ...prev,
                relationships
              }))}
              onGenderSelect={handleGenderSelect}
              onRelationshipSelect={handleRelationshipSelect}
            />

            <DateSelector
              value={profileData.occasions}
              onChange={(occasions) => setProfileData(prev => ({
                ...prev,
                occasions
              }))}
              showAnniversary={profileData.relationships?.showAnniversary}
            />

            <NotificationSettings
              value={profileData.notifications}
              onChange={(notifications) => setProfileData(prev => ({
                ...prev,
                notifications: {
                  ...notifications,
                  reminders: notifications.reminders || []
                }
              }))}
            />

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => handleNext()}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Weitere Angaben
              </button>
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Abbrechen
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Speichern
                </button>
              </div>
            </div>
          </>
        ) : (
          <AdditionalInfoForm
            value={profileData}
            onChange={setProfileData}
            onBack={handleBack}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
}
