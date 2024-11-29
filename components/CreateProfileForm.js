import { useState } from 'react';
import { personalityQuestions } from '../data/personalityQuestions';

export default function CreateProfileForm({ 
  initialData, 
  onSubmit, 
  onBack, 
  submitButtonText = "Speichern",
  isEditing = false 
}) {
  // Rest des Codes bleibt gleich...
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
      // Basis-Informationen
      name: initialData?.name || { first: '', last: '' },
      gender: initialData?.gender || '',
      relationship: initialData?.relationship || { type: '', specific: '' },
      occasions: initialData?.occasions || null,
      
      // Weitere Details
      known_since: initialData?.known_since || '',
      description: initialData?.description || '',
      personality_traits: initialData?.personality_traits || {},
      
      // Andere optionale Felder
      preferences: initialData?.preferences || null,
      notifications: initialData?.notifications || {
        enabled: false,
        reminders: [],
        method: 'email',
        contactInfo: {}
      },
      history: initialData?.history || null
    });
  
    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      await onSubmit(formData);
    };
  
    return (
      <div>
        {step === 1 && (
          <div>
            <h2 className="text-xl mb-4">Basis-Informationen</h2>
            {/* Erste Seite mit Basis-Informationen */}
            {/* ... */}
            <button onClick={nextStep}>Weiter</button>
          </div>
        )}
  
        {step === 2 && (
          <div>
            <h2 className="text-xl mb-4">Weitere Details</h2>
            {/* Zweite Seite mit weiteren Details */}
            {/* ... */}
            <div className="flex justify-between">
              <button onClick={prevStep}>Zurück</button>
              <button onClick={handleSubmit}>{submitButtonText}</button>
            </div>
          </div>
        )}
      </div>
    );
  }