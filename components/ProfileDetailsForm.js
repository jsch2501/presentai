import { useState } from 'react';

export default function ProfileDetailsForm({ profile, onSave, onBack }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: profile?.name || { first: '', last: '' },
    gender: profile?.gender || '',
    relationship: profile?.relationship || { type: '', specific: '' },
    personality_traits: profile?.personality_traits || {},
    known_since: profile?.known_since || '',
    description: profile?.description || '',
    occasions: profile?.occasions || null,
    preferences: profile?.preferences || null,
    notifications: profile?.notifications || { 
      enabled: false, 
      reminders: [], 
      method: 'email', 
      contactInfo: {} 
    },
    history: profile?.history || null,
    additional_info: profile?.additional_info || null
  });

  const nextStep = () => setStep(2);
  const prevStep = () => setStep(1);

  return (
    <div className="max-w-2xl mx-auto">
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Allgemeine Informationen</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vorname
              </label>
              <input
                type="text"
                value={formData.name.first}
                onChange={(e) => setFormData({
                  ...formData,
                  name: { ...formData.name, first: e.target.value }
                })}
                className="w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nachname
              </label>
              <input
                type="text"
                value={formData.name.last}
                onChange={(e) => setFormData({
                  ...formData,
                  name: { ...formData.name, last: e.target.value }
                })}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Beziehung
            </label>
            <select
              value={formData.relationship.type}
              onChange={(e) => setFormData({
                ...formData,
                relationship: { ...formData.relationship, type: e.target.value }
              })}
              className="w-full p-2 border rounded mb-2"
            >
              <option value="">Bitte wählen</option>
              <option value="family">Familie</option>
              <option value="friend">Freund/in</option>
              <option value="colleague">Kollege/in</option>
              <option value="other">Andere</option>
            </select>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onBack}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Zurück
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Weiter
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4">Weitere Details</h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wie lange kennen Sie die Person schon?
            </label>
            <input
              type="text"
              value={formData.known_since}
              onChange={(e) => setFormData({ ...formData, known_since: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="z.B. 5 Jahre"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Beschreibung der Person
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Erzählen Sie etwas über die Person..."
              className="w-full p-2 border rounded h-32"
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Persönlichkeit & Interessen:</h3>
            <div className="space-y-4">
              {[
                { id: 'introvert', question: 'Ist die Person eher introvertiert?' },
                { id: 'tech', question: 'Interessiert sich die Person für Technik?' },
                { id: 'creative', question: 'Ist die Person kreativ?' },
                { id: 'nature', question: 'Verbringt die Person gerne Zeit in der Natur?' },
                { id: 'sports', question: 'Ist die Person sportlich aktiv?' }
              ].map((q) => (
                <div key={q.id} className="flex items-center justify-between">
                  <span className="text-sm">{q.question}</span>
                  <div className="space-x-2">
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        personality_traits: {
                          ...formData.personality_traits,
                          [q.id]: { answer: true }
                        }
                      })}
                      className={`px-3 py-1 rounded ${
                        formData.personality_traits[q.id]?.answer === true
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100'
                      }`}
                    >
                      Ja
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        personality_traits: {
                          ...formData.personality_traits,
                          [q.id]: { answer: false }
                        }
                      })}
                      className={`px-3 py-1 rounded ${
                        formData.personality_traits[q.id]?.answer === false
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100'
                      }`}
                    >
                      Nein
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Zurück
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                onSave(formData);
              }}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Änderungen speichern
            </button>
          </div>
        </div>
      )}
    </div>
  );
}