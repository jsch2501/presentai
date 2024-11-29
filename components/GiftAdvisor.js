import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import InitialForm from './InitialForm';
import TypedExplanation from './TypedExplanation';
import FollowUpQuestions from './FollowUpQuestions';
import GiftIdeas from './GiftIdeas';
import { STEPS } from '../constants/giftAdvisorConstants';

export default function GiftAdvisor({ initialProfile, onSaveProfile }) {
  const router = useRouter();
  const [step, setStep] = useState(STEPS.INITIAL);
  const [formData, setFormData] = useState({});
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [ideas, setIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInitialSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      setFormData(data);

      // Wenn kein Profil ausgewählt wurde, fragen ob gespeichert werden soll
      if (!initialProfile) {
        const shouldSave = window.confirm(
          'Möchten Sie diese Angaben in einem neuen Profil speichern?'
        );
        
        if (shouldSave) {
          await onSaveProfile(data);
        }
      }
      
      console.log('Sending data for question generation:', data);

      const response = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('API Response:', result);

      if (!response.ok) {
        throw new Error(result.message || 'Fehler bei der Fragengenerierung');
      }

      if (!result.questions || !Array.isArray(result.questions)) {
        throw new Error('Ungültiges Antwortformat von der API');
      }

      setQuestions(result.questions);
      setStep(STEPS.FOLLOW_UP);
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      // Bleiben Sie beim initialen Formular im Fehlerfall
      setStep(STEPS.INITIAL);
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleGenerateIdeas = async (ratings = null) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Generating ideas with:', {
        formData,
        answers,
        ratings
      });

      const response = await fetch('/api/generate-ideas', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          formData,
          answers,
          ratings
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Fehler bei der Ideengenerierung');
      }

      console.log('Generated ideas:', data.suggestions);
      setIdeas(data.suggestions);
      setStep(STEPS.IDEAS);
    } catch (error) {
      console.error('Error generating ideas:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const profileData = {
        name: {
          first: event.target.firstName.value,
          last: event.target.lastName.value
        },
        // Nur die minimal erforderlichen Felder
        gender: event.target.gender?.value || null,
        relationship: null,
        occasions: null,
        preferences: null,
        notifications: null,
        history: null,
        additional_info: null,
        personality_traits: null
      };

      const response = await fetch('/api/profiles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        throw new Error('Fehler beim Speichern des Profils');
      }

      const savedProfile = await response.json();
      console.log('Saved profile:', savedProfile);
      
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {step === STEPS.INITIAL && (
        <InitialForm 
          onSubmit={handleInitialSubmit}
          isLoading={isLoading}
        />
      )}

      {step === STEPS.FOLLOW_UP && (
        <FollowUpQuestions
          questions={questions}
          answers={answers}
          setAnswers={setAnswers}
          onComplete={handleGenerateIdeas}
          isLoading={isLoading}
        />
      )}

      {step === STEPS.IDEAS && (
        <GiftIdeas
          ideas={ideas}
          onRegenerateIdeas={handleGenerateIdeas}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
