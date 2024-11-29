import { useState } from 'react';
import styles from '../styles/Form.module.css';

export default function FollowUpQuestions({
  questions,
  answers,
  setAnswers,
  onComplete,
  onBack,
  isLoading
}) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [freeformAnswer, setFreeformAnswer] = useState('');
  const [selectedSuggestions, setSelectedSuggestions] = useState({});
  
  // Sicherheitsprüfung für questions Array
  if (!questions || questions.length === 0) {
    return <div>Lade Fragen...</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  const handleNext = () => {
    // Sammle alle ausgewählten Vorschläge und die Freitextantwort
    const selectedAnswers = Object.entries(selectedSuggestions)
      .filter(([_, isSelected]) => isSelected)
      .map(([suggestion]) => suggestion);
    
    if (freeformAnswer.trim()) {
      selectedAnswers.push(freeformAnswer);
    }

    if (selectedAnswers.length > 0) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: selectedAnswers.join(', ')
      }));
    }

    if (isLastQuestion) {
      onComplete();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setFreeformAnswer('');
      setSelectedSuggestions({});
    }
  };

  const toggleSuggestion = (suggestion) => {
    setSelectedSuggestions(prev => ({
      ...prev,
      [suggestion]: !prev[suggestion]
    }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onBack}
          className="text-gray-600 hover:text-gray-800 flex items-center"
        >
          <span className="mr-2">←</span> Zurück zur Hauptseite
        </button>
        <div className="text-sm text-gray-500">
          Frage {currentQuestionIndex + 1} von {questions.length}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">{currentQuestion.question}</h2>

        {/* Vorgeschlagene Antworten */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-3">Vorschläge:</p>
          <div className="grid grid-cols-1 gap-3">
            {currentQuestion.suggestions?.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => toggleSuggestion(suggestion)}
                className={`flex items-center justify-between p-3 border rounded-lg transition-all ${
                  selectedSuggestions[suggestion]
                    ? 'bg-green-50 border-green-500'
                    : 'hover:bg-blue-50'
                }`}
              >
                <span>{suggestion}</span>
                <span className={`flex items-center ${
                  selectedSuggestions[suggestion]
                    ? 'text-green-600'
                    : 'text-blue-500'
                }`}>
                  👍 {selectedSuggestions[suggestion] ? 'Vorgemerkt' : 'Gute Idee'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Freitext-Antwort */}
        <div className="space-y-4">
          <div className="border-t pt-4">
            <p className="text-sm text-gray-600 mb-2">
              Oder geben Sie eine eigene Antwort ein:
            </p>
            <input
              type="text"
              value={freeformAnswer}
              onChange={(e) => setFreeformAnswer(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ihre Antwort..."
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => {
            if (isLastQuestion) {
              onComplete();
            } else {
              setCurrentQuestionIndex(prev => prev + 1);
              setFreeformAnswer('');
              setSelectedSuggestions({});
            }
          }}
          className="text-gray-600 hover:text-gray-800"
        >
          Diese Frage überspringen
        </button>

        <button
          onClick={handleNext}
          disabled={isLoading}
          className={`px-6 py-2 rounded-md ${
            isLastQuestion 
              ? 'bg-purple-600 hover:bg-purple-700' 
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
        >
          {isLoading 
            ? 'Lädt...' 
            : isLastQuestion 
              ? 'Geschenkideen generieren' 
              : 'Weiter'}
        </button>
      </div>

      <div className="text-sm text-gray-500 text-center mt-4">
        Tipp: Sie können mehrere Vorschläge auswählen oder eine eigene Antwort eingeben.
      </div>
    </div>
  );
}
