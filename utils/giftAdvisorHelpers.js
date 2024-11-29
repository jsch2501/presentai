import { STEPS } from '../constants/giftAdvisorConstants';

export async function handleInitialSubmit({
  description,
  budget,
  selectedCategories,
  setIsLoading,
  setError,
  setFollowUpQuestions,
  setStep,
  setCurrentQuestionIndex
}) {
  setIsLoading(true);
  setError('');

  try {
    const response = await fetch('/api/generate-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        description, 
        budget, 
        categories: selectedCategories
      }),
    });
    
    if (!response.ok) {
      throw new Error('Fehler bei der Fragengenerierung');
    }
    
    const data = await response.json();
    setFollowUpQuestions([
      ...data.questions,
      {
        id: 'city',
        question: "Was ist die nächstgrößere Stadt in Ihrer Nähe für Aktivitäten und Erlebnisgeschenke?"
      }
    ]);
    setStep(STEPS.FOLLOW_UP);
    setCurrentQuestionIndex(0);
  } catch (error) {
    console.error('Fehler:', error);
    setError('Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.');
  } finally {
    setIsLoading(false);
  }
}

export async function handleGenerateIdeas({
  description,
  budget,
  selectedCategories,
  answers,
  nearestCity,
  feedback,
  setAllIdeas,
  setCurrentIdeas,
  setStep,
  setFeedback
}) {
  console.log('handleGenerateIdeas gestartet mit:', {
    description,
    budget,
    selectedCategories,
    nearestCity
  });

  try {
    const response = await fetch('/api/generate-ideas', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ 
        description, 
        budget, 
        categories: selectedCategories,
        answers,
        nearestCity,
        feedback
      }),
    });
    
    console.log('API Response Status:', response.status);
    
    const data = await response.json();
    console.log('API Response Data:', data);
    
    if (!response.ok) {
      throw new Error(data.message || 'Fehler bei der Ideengenerierung');
    }
    
    if (!data.suggestions || !Array.isArray(data.suggestions)) {
      console.error('Ungültiges Datenformat:', data);
      throw new Error('Ungültiges Datenformat von der API');
    }
    
    setAllIdeas(data.suggestions);
    setCurrentIdeas(data.suggestions.slice(0, 3));
    setStep(STEPS.IDEAS);
    setFeedback({});
  } catch (error) {
    console.error('Fehler in handleGenerateIdeas:', error);
    throw error;
  }
}
